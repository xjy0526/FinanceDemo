"""Presentation currency helpers.

Internal portfolio values stay EUR-based, but user-facing reports should show
USD by default and optionally CNY.
"""
from __future__ import annotations

from typing import Any


DEFAULT_DISPLAY_CURRENCY = "USD"
DEFAULT_EUR_USD = 1.08
DEFAULT_EUR_CNY = 7.8


def normalize_display_currency(currency: str | None = None) -> str:
    return "CNY" if str(currency or "").upper() == "CNY" else "USD"


def display_rate(summary: Any = None, currency: str | None = None) -> float:
    code = normalize_display_currency(currency)
    if isinstance(summary, dict):
        if code == "CNY":
            return float(summary.get("eur_cny_rate") or DEFAULT_EUR_CNY)
        return float(summary.get("eur_usd_rate") or DEFAULT_EUR_USD)
    if code == "CNY":
        return float(getattr(summary, "eur_cny_rate", 0) or DEFAULT_EUR_CNY)
    return float(getattr(summary, "eur_usd_rate", 0) or DEFAULT_EUR_USD)


def to_display_amount(value_eur: float | int | None, summary: Any = None, currency: str | None = None) -> float:
    return float(value_eur or 0) * display_rate(summary, currency)


def format_display_money(
    value_eur: float | int | None,
    summary: Any = None,
    currency: str | None = None,
    digits: int = 2,
    signed: bool = False,
) -> str:
    code = normalize_display_currency(currency)
    value = to_display_amount(value_eur, summary, code)
    prefix = "+" if signed and value >= 0 else ""
    symbol = "$" if code == "USD" else "¥"
    return f"{prefix}{symbol}{value:,.{digits}f} {code}"
