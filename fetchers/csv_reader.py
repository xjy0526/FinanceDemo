"""
CSV Portfolio Reader — Alternative data source to Parqet.

Reads portfolio positions from a CSV file or uploaded JSON data.
Expected CSV columns: ticker, shares, buy_price, buy_date (optional), currency (optional), sector (optional), name (optional)
"""

import csv
import os
from datetime import datetime
from typing import Optional
import logging

logger = logging.getLogger("financebro.csv_reader")


def _normalize_asset_type(raw_value: str, ticker: str, market: str) -> str:
    value = (raw_value or "").strip().lower()
    market_value = (market or "").strip().lower()
    ticker_upper = (ticker or "").upper()

    aliases = {
        "stock": "equity",
        "equity": "equity",
        "cn_equity": "cn_equity",
        "china_a": "cn_equity",
        "a_share": "cn_equity",
        "ashare": "cn_equity",
        "polymarket": "prediction_market",
        "prediction_market": "prediction_market",
        "prediction": "prediction_market",
    }

    if value in aliases:
        return aliases[value]
    if ticker_upper.endswith((".SS", ".SZ")) or market_value in {"cn", "cn-a", "china", "china-a"}:
        return "cn_equity"
    if market_value == "polymarket":
        return "prediction_market"
    return "equity"


def _normalize_market(asset_type: str, market: str, ticker: str) -> str:
    market_value = (market or "").strip()
    if market_value:
        return market_value
    ticker_upper = (ticker or "").upper()
    if asset_type == "prediction_market":
        return "Polymarket"
    if asset_type == "cn_equity" or ticker_upper.endswith((".SS", ".SZ")):
        return "CN-A"
    return "Global"


def _normalize_country(asset_type: str, country: str) -> str:
    if country and str(country).strip():
        return str(country).strip().upper()
    if asset_type == "cn_equity":
        return "CN"
    if asset_type == "prediction_market":
        return "WEB3"
    return ""


def parse_csv_file(file_path: str) -> list[dict]:
    """Parse a CSV file into a list of position dicts."""
    if not os.path.exists(file_path):
        logger.error(f"CSV file not found: {file_path}")
        return []

    with open(file_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        return _normalize_rows(list(reader))


def parse_csv_json(positions: list[dict]) -> list[dict]:
    """Parse uploaded JSON positions (from frontend CSV upload)."""
    return _normalize_rows(positions)


def _normalize_rows(rows: list[dict]) -> list[dict]:
    """Normalize CSV rows into standard portfolio position format."""
    positions = []
    for row in rows:
        # Normalize keys to lowercase
        row = {k.lower().strip(): v for k, v in row.items()}

        ticker = row.get('ticker', '').strip().upper()
        if not ticker:
            continue

        # Skip cash rows
        if ticker in ('CASH', 'cash', ''):
            continue

        try:
            shares = float(row.get('shares', 0))
            buy_price = float(row.get('buy_price', 0))
        except (ValueError, TypeError):
            logger.warning(f"Skipping invalid row for ticker {ticker}: shares/buy_price not numeric")
            continue

        if shares <= 0:
            continue

        market = row.get('market', '').strip()
        asset_type = _normalize_asset_type(row.get('asset_type', ''), ticker, market)

        currency = row.get('currency', 'USD').strip().upper()
        if asset_type == "cn_equity" and not row.get('currency'):
            currency = 'CNY'
        elif asset_type == "prediction_market" and not row.get('currency'):
            currency = 'USD'

        if currency not in ('USD', 'EUR', 'GBP', 'CHF', 'CAD', 'JPY', 'CNY'):
            currency = 'USD'

        buy_date = _parse_date(row.get('buy_date', ''))
        sector = row.get('sector', '').strip() or None
        name = row.get('name', '').strip() or ticker
        current_price = row.get('current_price', '')
        try:
            current_price = float(current_price) if str(current_price).strip() else None
        except (TypeError, ValueError):
            current_price = None

        positions.append({
            'ticker': ticker,
            'name': name,
            'shares': shares,
            'buy_price': buy_price,
            'current_price': current_price,
            'buy_date': buy_date,
            'currency': currency,
            'sector': sector,
            'asset_type': asset_type,
            'market': _normalize_market(asset_type, market, ticker),
            'exchange': row.get('exchange', '').strip(),
            'country': _normalize_country(asset_type, row.get('country', '')),
            'source': 'csv',
        })

    logger.info(f"Parsed {len(positions)} positions from CSV")
    return positions


def _parse_date(date_str: str) -> Optional[str]:
    """Try to parse a date string into ISO format."""
    if not date_str or not date_str.strip():
        return None

    date_str = date_str.strip()
    for fmt in ('%Y-%m-%d', '%d.%m.%Y', '%m/%d/%Y', '%d/%m/%Y', '%Y/%m/%d'):
        try:
            return datetime.strptime(date_str, fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue

    return None


def csv_positions_to_portfolio_format(positions: list[dict], prices: dict = None) -> list[dict]:
    """
    Convert CSV positions to the internal portfolio format expected by the scoring engine.

    This produces the same structure as Parqet positions so the rest of
    the pipeline (scoring, rebalancing, analytics) works unchanged.
    """
    portfolio = []
    for pos in positions:
        ticker = pos['ticker']
        current_price = pos.get('current_price')
        if current_price is None:
            current_price = prices.get(ticker, pos['buy_price']) if prices else pos['buy_price']
        value = current_price * pos['shares']
        cost_basis = pos['buy_price'] * pos['shares']
        pnl = value - cost_basis
        pnl_pct = ((current_price / pos['buy_price']) - 1) * 100 if pos['buy_price'] > 0 else 0

        portfolio.append({
            'ticker': ticker,
            'name': pos.get('name', ticker),
            'shares': pos['shares'],
            'currentPrice': current_price,
            'buyPrice': pos['buy_price'],
            'totalValue': value,
            'pnl': pnl,
            'pnlPercent': pnl_pct,
            'currency': pos.get('currency', 'USD'),
            'sector': pos.get('sector'),
            'asset_type': pos.get('asset_type', 'equity'),
            'market': pos.get('market', 'Global'),
            'exchange': pos.get('exchange', ''),
            'country': pos.get('country', ''),
            'buy_date': pos.get('buy_date'),
            'source': 'csv',
        })

    return portfolio
