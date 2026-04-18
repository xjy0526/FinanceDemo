"""PortfolioPilot - AI compatibility layer.

这个模块保留了原 `vertex_ai.py` 的导入路径，避免业务层大改。
底层实现改为 Qwen / DashScope 的 OpenAI-compatible Chat Completions API。
"""
from __future__ import annotations

import json
import logging
import uuid
from dataclasses import dataclass, field
from datetime import date
from typing import Any, Optional

import httpx

from config import settings
from services.display_currency import format_display_money

logger = logging.getLogger(__name__)

# Globaler Cache-Name (wird nach Refresh gesetzt)
_active_cache_name: Optional[str] = None
_context_cache_store: dict[str, str] = {}

# Tägliches AI-Call-Limit (Kostenschutz)
_MAX_DAILY_CALLS = 100
_daily_call_count = 0
_daily_call_date: Optional[date] = None


def _check_daily_limit():
    """Prüft und aktualisiert das tägliche AI-Call-Limit."""
    global _daily_call_count, _daily_call_date

    today = date.today()
    if _daily_call_date != today:
        _daily_call_count = 0
        _daily_call_date = today

    _daily_call_count += 1

    if _daily_call_count > _MAX_DAILY_CALLS:
        raise RuntimeError(
            f"Tägliches AI-Call-Limit erreicht ({_MAX_DAILY_CALLS}/Tag). "
            "Schutz gegen unkontrollierte Kosten. Resettet um Mitternacht."
        )

    if _daily_call_count % 10 == 0:
        logger.info(f"📊 AI-Calls heute: {_daily_call_count}/{_MAX_DAILY_CALLS}")


@dataclass
class FunctionDeclaration:
    name: str
    description: str = ""
    parameters: dict[str, Any] = field(default_factory=dict)


@dataclass
class GoogleSearch:
    """Platzhalter für die alte Google-Search-Konfiguration."""


@dataclass
class Tool:
    function_declarations: list[FunctionDeclaration] | None = None
    google_search: GoogleSearch | None = None


@dataclass
class FunctionCall:
    name: str
    args: dict[str, Any] = field(default_factory=dict)
    id: str = ""


@dataclass
class FunctionResponse:
    name: str
    response: dict[str, Any] = field(default_factory=dict)


@dataclass
class Part:
    text: Optional[str] = None
    function_call: Optional[FunctionCall] = None
    function_response: Optional[FunctionResponse] = None
    inline_data: Optional[dict[str, Any]] = None

    @classmethod
    def from_function_response(cls, name: str, response: dict[str, Any]) -> "Part":
        return cls(function_response=FunctionResponse(name=name, response=response))

    @classmethod
    def from_bytes(cls, data: bytes, mime_type: str) -> "Part":
        return cls(inline_data={"data": data, "mime_type": mime_type})


@dataclass
class Content:
    role: str
    parts: list[Part]


@dataclass
class Candidate:
    content: Content


@dataclass
class GenerateContentResponse:
    text: str
    candidates: list[Candidate]


class _CacheRecord:
    def __init__(self, name: str):
        self.name = name


class _QwenCaches:
    async def create(self, model: str, config: dict[str, Any]):
        contents = config.get("contents", [])
        joined_parts: list[str] = []
        for content in contents:
            for part in getattr(content, "parts", []):
                if getattr(part, "text", None):
                    joined_parts.append(part.text)
        cache_name = f"qwen-cache-{uuid.uuid4().hex[:12]}"
        _context_cache_store[cache_name] = "\n".join(joined_parts)
        return _CacheRecord(cache_name)

    async def delete(self, name: str):
        _context_cache_store.pop(name, None)


class _QwenModels:
    def __init__(self, client: "QwenClient"):
        self._client = client

    async def generate_content(
        self,
        model: str,
        contents: str | list[Content],
        config: Optional[dict[str, Any]] = None,
    ) -> GenerateContentResponse:
        return await self._client.generate_content(model=model, contents=contents, config=config or {})


class _QwenAio:
    def __init__(self, client: "QwenClient"):
        self.models = _QwenModels(client)
        self.caches = _QwenCaches()


class QwenClient:
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.aio = _QwenAio(self)
        self._http = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=60,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
        )

    async def generate_content(
        self,
        model: str,
        contents: str | list[Content],
        config: dict[str, Any],
    ) -> GenerateContentResponse:
        messages = _build_messages(contents, config)
        payload: dict[str, Any] = {
            "model": _resolve_model_name(model),
            "messages": messages,
            "temperature": 0.2,
        }

        tools = _extract_tools(config)
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"

        system_instruction = config.get("system_instruction", "")
        response_schema = config.get("response_schema")
        response_mime = config.get("response_mime_type")
        if response_schema:
            schema_hint = (
                "\n\nReturn only valid JSON matching this schema exactly:\n"
                f"{json.dumps(response_schema, ensure_ascii=False)}"
            )
            if messages and messages[0]["role"] == "system":
                messages[0]["content"] = (messages[0].get("content") or "") + schema_hint
            else:
                messages.insert(0, {"role": "system", "content": schema_hint.strip()})
            if response_mime == "application/json" and response_schema.get("type") == "object":
                payload["response_format"] = {"type": "json_object"}
        elif response_mime == "application/json":
            if messages and messages[0]["role"] == "system":
                messages[0]["content"] = (messages[0].get("content") or "") + "\n\nReturn valid JSON only."
            else:
                messages.insert(0, {"role": "system", "content": "Return valid JSON only."})

        payload["messages"] = messages

        response = await self._post_with_fallback(payload)
        data = response.json()
        choice = (data.get("choices") or [{}])[0]
        message = choice.get("message", {}) or {}
        content_text = message.get("content") or ""

        parts: list[Part] = []
        tool_calls = message.get("tool_calls") or []
        for tool_call in tool_calls:
            args_raw = tool_call.get("function", {}).get("arguments") or "{}"
            try:
                args = json.loads(args_raw)
            except json.JSONDecodeError:
                args = {}
            parts.append(
                Part(
                    function_call=FunctionCall(
                        id=tool_call.get("id", ""),
                        name=tool_call.get("function", {}).get("name", ""),
                        args=args,
                    )
                )
            )

        if content_text:
            parts.insert(0, Part(text=content_text))

        if not parts:
            parts = [Part(text="")]

        return GenerateContentResponse(
            text=content_text,
            candidates=[Candidate(content=Content(role="model", parts=parts))],
        )

    async def _post_with_fallback(self, payload: dict[str, Any]) -> httpx.Response:
        response = await self._http.post("/chat/completions", json=payload)
        if response.status_code < 400:
            return response

        if "response_format" in payload:
            fallback_payload = dict(payload)
            fallback_payload.pop("response_format", None)
            response = await self._http.post("/chat/completions", json=fallback_payload)
            if response.status_code < 400:
                return response

        try:
            detail = response.json()
        except Exception:
            detail = response.text
        raise RuntimeError(f"Qwen API Fehler: {detail}")


def _resolve_model_name(requested_model: str) -> str:
    if settings.QWEN_REASONING_MODEL and "pro" in requested_model.lower():
        return settings.QWEN_REASONING_MODEL
    return settings.QWEN_MODEL or requested_model


def _extract_tools(config: dict[str, Any]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for tool in config.get("tools", []):
        declarations = getattr(tool, "function_declarations", None) or []
        for declaration in declarations:
            result.append(
                {
                    "type": "function",
                    "function": {
                        "name": declaration.name,
                        "description": declaration.description,
                        "parameters": declaration.parameters,
                    },
                }
            )
    return result


def _build_messages(contents: str | list[Content], config: dict[str, Any]) -> list[dict[str, Any]]:
    messages: list[dict[str, Any]] = []
    system_instruction = config.get("system_instruction")
    if system_instruction:
        messages.append({"role": "system", "content": str(system_instruction)})

    cached_name = config.get("cached_content")
    cached_text = _context_cache_store.get(cached_name or "")
    if cached_text:
        messages.append({"role": "system", "content": cached_text})

    if isinstance(contents, str):
        messages.append({"role": "user", "content": contents})
        return messages

    previous_tool_calls: list[dict[str, str]] = []

    for content in contents:
        role = "assistant" if content.role in {"model", "assistant"} else "user"
        text_parts: list[str] = []
        tool_calls: list[dict[str, Any]] = []
        function_responses: list[FunctionResponse] = []

        for part in content.parts:
            if part.inline_data is not None:
                mime_type = part.inline_data.get("mime_type", "application/octet-stream")
                raise RuntimeError(f"Inline AI input derzeit nicht unterstützt: {mime_type}")
            if part.text:
                text_parts.append(part.text)
            if part.function_call:
                call_id = part.function_call.id or f"call_{uuid.uuid4().hex[:10]}"
                tool_calls.append(
                    {
                        "id": call_id,
                        "type": "function",
                        "function": {
                            "name": part.function_call.name,
                            "arguments": json.dumps(part.function_call.args, ensure_ascii=False),
                        },
                    }
                )
            if part.function_response:
                function_responses.append(part.function_response)

        if tool_calls:
            assistant_message: dict[str, Any] = {"role": "assistant", "tool_calls": tool_calls}
            if text_parts:
                assistant_message["content"] = "\n".join(text_parts)
            else:
                assistant_message["content"] = ""
            messages.append(assistant_message)
            previous_tool_calls = [
                {"id": tool_call["id"], "name": tool_call["function"]["name"]}
                for tool_call in tool_calls
            ]
            continue

        if function_responses:
            for idx, response_part in enumerate(function_responses):
                tool_call_id = ""
                if idx < len(previous_tool_calls):
                    tool_call_id = previous_tool_calls[idx]["id"]
                elif previous_tool_calls:
                    tool_call_id = previous_tool_calls[-1]["id"]
                else:
                    tool_call_id = f"call_{uuid.uuid4().hex[:10]}"

                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call_id,
                        "content": json.dumps(response_part.response, ensure_ascii=False),
                    }
                )
            continue

        messages.append({"role": role, "content": "\n".join(text_parts)})

    return messages


def get_client():
    """Erstellt einen Qwen-kompatiblen Client mit täglichem Call-Limit."""
    _check_daily_limit()

    api_key = settings.QWEN_API_KEY or settings.GEMINI_API_KEY
    if not api_key:
        raise RuntimeError("Keine AI-Konfiguration gefunden. Bitte QWEN_API_KEY in .env setzen.")

    return QwenClient(api_key=api_key, base_url=settings.QWEN_BASE_URL)


def get_daily_usage() -> dict:
    """Gibt aktuelle AI-Call-Statistik zurück."""
    return {
        "calls_today": _daily_call_count,
        "max_daily": _MAX_DAILY_CALLS,
        "remaining": max(0, _MAX_DAILY_CALLS - _daily_call_count),
        "date": str(_daily_call_date or date.today()),
        "provider": settings.AI_PROVIDER,
        "model": settings.QWEN_MODEL,
    }


def get_grounded_config() -> dict:
    """Kompatibilitäts-Config.

    Qwen OpenAI-compatible Mode bietet hier kein direktes Google-Search-Grounding.
    Wir lassen die Struktur bewusst kompatibel, damit bestehende Services weiterlaufen.
    """
    return {"tools": [Tool(google_search=GoogleSearch())]}


async def cache_portfolio_context(summary) -> Optional[str]:
    """Speichert Portfolio-Kontext lokal im Prozess als Cache-Key."""
    global _active_cache_name

    if not settings.gemini_configured:
        return None

    context_lines = [
        "Du bist ein professioneller Finanzanalyst. "
        "Hier ist der aktuelle Portfolio-Status:",
        "",
        f"Portfolio-Wert: {format_display_money(summary.total_value, summary, digits=0)}",
        f"P&L: {format_display_money(summary.total_pnl, summary, digits=0, signed=True)} ({summary.total_pnl_percent:+.1f}%)",
        f"Positionen: {summary.num_positions}",
    ]

    if summary.fear_greed:
        context_lines.append(
            f"Fear & Greed Index: {summary.fear_greed.value}/100 "
            f"({summary.fear_greed.label})"
        )

    context_lines.append("")
    context_lines.append("Positionen (Ticker | Name | Asset | Score | Rating | P&L% | Sektor):")

    for stock in summary.stocks:
        if stock.position.ticker == "CASH":
            continue
        score_val = stock.score.total_score if stock.score else 0
        rating_val = stock.score.rating.value if stock.score else "hold"
        pnl_pct = stock.position.pnl_percent
        sector = stock.position.sector
        asset_type = stock.position.asset_type
        context_lines.append(
            f"  {stock.position.ticker} ({stock.position.name}) | "
            f"Asset: {asset_type} | Score: {score_val:.0f} | "
            f"{rating_val} | P&L: {pnl_pct:+.1f}% | {sector}"
        )

    cache_name = f"qwen-cache-{uuid.uuid4().hex[:12]}"
    _context_cache_store[cache_name] = "\n".join(context_lines)
    _active_cache_name = cache_name
    logger.info(f"💾 Portfolio-Kontext lokal gecached: {cache_name}")
    return cache_name


def get_cached_content() -> Optional[str]:
    """Gibt den aktiven Cache-Namen zurück (oder None)."""
    return _active_cache_name
