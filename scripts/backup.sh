#!/bin/bash
# 古道论坛 — 代码打包脚本
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTDIR="${1:-/tmp}"
TAG=$(date +%Y%m%d_%H%M%S)
OUTFILE="$OUTDIR/forum-code-$TAG.zip"

echo "📦 打包论坛代码 (排除 node_modules, .next, .git)..."
cd "$DIR"
zip -r "$OUTFILE" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x "*.zip" \
  -x ".DS_Store" \
  > /dev/null 2>&1

echo "✅ 打包完成: $OUTFILE"
echo "   大小: $(du -h "$OUTFILE" | cut -f1)"
echo "$OUTFILE"
