#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "⚙️  Building Aiken project (Preview network)"
command -v aiken >/dev/null 2>&1 || {
  echo "❌ Aiken CLI not found. Install from https://aiken-lang.org" >&2
  exit 1
}

aiken build

echo "✅ Build complete. Artifacts available in $(realpath plutus.json)"
