#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

APP_URL="http://127.0.0.1:8000"

if [ ! -x "./venv/bin/python" ]; then
    echo "Virtual environment not found: ./venv/bin/python"
    echo "Please create it first with:"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi

echo "Starting PortfolioPilot..."
echo "URL: $APP_URL"

if command -v open >/dev/null 2>&1; then
    (sleep 2 && open "$APP_URL") >/dev/null 2>&1 &
fi

exec ./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000
