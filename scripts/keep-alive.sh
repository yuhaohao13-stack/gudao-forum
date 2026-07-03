#!/bin/bash
# ============================================
# 古道论坛 + Crazy维修 — 保活推送脚本
# 每周由 cron 触发一次。
# 脚本自动判断：距上次推送是否 ≥ 90 天？
#   是 → 推送（季度保活）
#   否 → 跳过
# 这样就算关机错过了，下次开机 cron 触发时自动补上。
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_FILE="$SCRIPT_DIR/keep-alive-state.json"
MIN_INTERVAL_DAYS=85  # 约3个月，留几天余量

DATE_TAG=$(date '+%Y-%m-%d')
TIMESTAMP=$(date '+%s')
NOW_TS="$TIMESTAMP"

# 读取上次推送时间
LAST_TS=0
if [ -f "$STATE_FILE" ]; then
  LAST_TS=$(grep -o '"lastPush": *[0-9]*' "$STATE_FILE" | grep -o '[0-9]*' || echo "0")
fi

# 计算天数差
DAYS_SINCE=$(( (NOW_TS - LAST_TS) / 86400 ))

if [ "$LAST_TS" -ne 0 ] && [ "$DAYS_SINCE" -lt "$MIN_INTERVAL_DAYS" ]; then
  echo "⏭️  距上次推送仅 ${DAYS_SINCE} 天，未满 ${MIN_INTERVAL_DAYS} 天，跳过本轮。"
  exit 0
fi

echo "🔄 距上次推送 ${DAYS_SINCE} 天（阈值 ${MIN_INTERVAL_DAYS} 天），开始保活推送..."

# ─── 古道论坛 ───
FORUM_DIR="/Users/hy/.openclaw/workspace/forum"
echo "🏛️ 古道论坛..."
cd "$FORUM_DIR"
echo "keepalive-${DATE_TAG}-${TIMESTAMP}" > public/version.txt
git add public/version.txt
git commit -m "🔄 季度保活推送 ${DATE_TAG}" || echo "  无变更"
git push
echo "  ✅ 已推送"

# ─── Crazy Repair ───
CR_DIR="/Users/hy/.openclaw/workspace/crazy-repair"
echo "🔧 Crazy维修..."
cd "$CR_DIR"
echo "keepalive-${DATE_TAG}-${TIMESTAMP}" > public/version.txt
git add public/version.txt
git commit -m "🔄 季度保活推送 ${DATE_TAG}" || echo "  无变更"
git push
echo "  ✅ 已推送"

# ─── 更新状态文件 ───
cat > "$STATE_FILE" << EOF
{
  "lastPush": ${NOW_TS},
  "lastPushDate": "${DATE_TAG}",
  "lastPushTimestamp": ${TIMESTAMP}
}
EOF

echo "========================================="
echo "✅ 两个站点保活完成 (${DATE_TAG})"
echo "========================================="
