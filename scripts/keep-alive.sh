#!/bin/bash
# ============================================
# 古道论坛 + Crazy维修 — 保活推送脚本
# 每季度执行一次，修改 version.txt → 提交 → 推送到 GitHub
# 触发 Vercel 自动部署，防止项目被归档/冷存储
# ============================================

set -e

DATE_TAG=$(date '+%Y-%m-%d')
TIMESTAMP=$(date '+%s')

# 古道论坛
FORUM_DIR="/Users/hy/.openclaw/workspace/forum"
echo "🏛️ 古道论坛..."
cd "$FORUM_DIR"
echo "keepalive-${DATE_TAG}-${TIMESTAMP}" > public/version.txt
git add public/version.txt
git commit -m "🔄 季度保活推送 ${DATE_TAG}"
git push
echo "  ✅ 已推送"

# Crazy Repair
CR_DIR="/Users/hy/.openclaw/workspace/crazy-repair"
echo "🔧 Crazy维修..."
cd "$CR_DIR"
echo "keepalive-${DATE_TAG}-${TIMESTAMP}" > public/version.txt
git add public/version.txt
git commit -m "🔄 季度保活推送 ${DATE_TAG}"
git push
echo "  ✅ 已推送"

echo "========================================="
echo "✅ 两个站点保活完成 (${DATE_TAG})"
echo "========================================="
