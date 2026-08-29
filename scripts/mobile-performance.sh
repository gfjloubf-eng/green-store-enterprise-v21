#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${1:-https://green-store-enterprise-v21.vercel.app}"
OUT_DIR="${2:-/tmp/qutoof-performance}"
mkdir -p "$OUT_DIR"
ROOT="$OUT_DIR/root.html"
curl -fsSL "$BASE_URL/" -o "$ROOT"
printf '%s\n' 'asset\tbytes\tseconds\tstatus'
printf '%s\n' "root.html\t$(wc -c < "$ROOT")\t$(curl -sS -o /dev/null -w '%{time_total}' --limit-rate 64k "$BASE_URL/")\t200"
mapfile -t ASSETS < <(grep -Eo 'src="[^"]+\.js"|href="[^"]+\.css"' "$ROOT" | sed -E 's/^(src|href)="//; s/"$//' | sed 's#^/#/#' | sort -u)
for asset in "${ASSETS[@]}"; do
  path="${asset%%\?*}"
  name="$(basename "$path")"
  file="$OUT_DIR/$name"
  metrics="$(curl -fsSL --limit-rate 64k -o "$file" -w '%{size_download}\t%{time_total}\t%{http_code}' "$BASE_URL$path")"
  printf '%s\t%s\n' "$path" "$metrics"
done
printf '%s\n' 'largest local dist assets:'
if [ -d frontend-react/dist ]; then
  du -ah frontend-react/dist | sort -hr | head -12
fi
