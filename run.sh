#!/usr/bin/env bash
set -e

echo "1 : 1 : 1"

# venv
if [ ! -d ".venv" ]; then
  python -m venv .venv
fi
source .venv/bin/activate

# зависимости
pip install --quiet -r requirements.txt

# запуск
echo "→ http://localhost:8080"
python server.py