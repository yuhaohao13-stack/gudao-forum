#!/bin/bash
# Download all 120 classic songs from YouTube (one by one with delays)
# Usage: bash scripts/download-classic.sh

OUTDIR="/tmp/classic-music"
mkdir -p "$OUTDIR"

download() {
  local cat="$1" id="$2" query="$3"
  local file="$OUTDIR/$cat/$id.mp3"
  
  if [ -f "$file" ] && [ -s "$file" ]; then
    echo "  ✅ $id already exists, skipping"
    return 0
  fi
  
  yt-dlp --no-warnings -x --audio-format mp3 --audio-quality 5 \
    --max-filesize 15M \
    --sleep-requests 1 \
    --sleep-interval 12 \
    --max-sleep-interval 20 \
    -o "$OUTDIR/$cat/tmp_$id.%(ext)s" \
    --default-search "ytsearch" \
    "ytsearch:$query" 2>/dev/null | tail -1
  
  if [ -f "$OUTDIR/$cat/tmp_$id.mp3" ]; then
    mv "$OUTDIR/$cat/tmp_$id.mp3" "$file"
    echo "  ✅ $id: $query"
    return 0
  fi
  echo "  ❌ $id: $query"
  return 1
}

echo "Running at $(date)"
echo ""

# ===== classic-8090 =====
echo "=== 8090经典曲目 ==="
mkdir -p "$OUTDIR/classic-8090"
download "classic-8090" "c01" "Beyond 海阔天空 官方音频"
sleep 15
download "classic-8090" "c02" "Beyond 光辉岁月 官方音频"
sleep 15
download "classic-8090" "c03" "张学友 吻别 官方版"
sleep 15
download "classic-8090" "c04" "邓丽君 月亮代表我的心 经典"
sleep 15
download "classic-8090" "c05" "齐秦 大约在冬季 经典"
sleep 15
download "classic-8090" "c06" "群星 明天会更好 经典"
sleep 15
download "classic-8090" "c07" "周华健 真心英雄 经典"
sleep 15
download "classic-8090" "c08" "周华健 朋友 官方版"
sleep 15
download "classic-8090" "c09" "郑智化 水手 经典"
sleep 15
download "classic-8090" "c10" "郑智化 星星点灯 经典"
sleep 15
download "classic-8090" "c11" "张信哲 爱如潮水 经典"
sleep 15
download "classic-8090" "c12" "周华健 花心 官方版"
sleep 15
download "classic-8090" "c13" "刘德华 忘情水 经典"
sleep 15
download "classic-8090" "c14" "陈慧娴 千千阙歌 经典"
sleep 15
download "classic-8090" "c15" "陈百强 偏偏喜欢你 经典"
sleep 15
download "classic-8090" "c16" "陈百强 一生何求 经典"
sleep 15
download "classic-8090" "c17" "罗文 甄妮 铁血丹心 经典"
sleep 15
download "classic-8090" "c18" "许冠杰 沧海一声笑 经典"
sleep 15
download "classic-8090" "c19" "叶丽仪 上海滩 经典"
sleep 15
download "classic-8090" "c20" "张雨生 我的未来不是梦 经典"
sleep 15

# ===== viral-hits =====
echo "=== 网络红歌 ==="
mkdir -p "$OUTDIR/viral-hits"
download "viral-hits" "v01" "柳爽 漠河舞厅 完整版"
sleep 15
download "viral-hits" "v02" "陈奕迅 孤勇者 完整版"
sleep 15
download "viral-hits" "v03" "买辣椒也用券 起风了 完整版"
sleep 15
download "viral-hits" "v04" "艾辰 错位时空 完整版"
sleep 15
download "viral-hits" "v05" "七叔 踏山河 完整版"
sleep 15
download "viral-hits" "v06" "七叔 半生雪 完整版"
sleep 15
download "viral-hits" "v07" "大籽 白月光与朱砂痣 完整版"
sleep 15
download "viral-hits" "v08" "黄霄雲 星辰大海 完整版"
sleep 15
download "viral-hits" "v09" "梦然 少年 完整版"
sleep 15
download "viral-hits" "v10" "温奕心 一路生花 完整版"
sleep 15
download "viral-hits" "v11" "阿肆 热爱105度的你 完整版"
sleep 15
download "viral-hits" "v12" "阿梨粤 晚风心里吹 完整版"
sleep 15
download "viral-hits" "v13" "李承铉 天上飞 完整版"
sleep 15
download "viral-hits" "v14" "八三夭 想见你想见你想见你 完整版"
sleep 15
download "viral-hits" "v15" "胡66 后来遇见他 完整版"
sleep 15
download "viral-hits" "v16" "崔伟立 酒醉的蝴蝶 完整版"
sleep 15
download "viral-hits" "v17" "海伦 桥边姑娘 完整版"
sleep 15
download "viral-hits" "v18" "程响 人间烟火 完整版"
sleep 15
download "viral-hits" "v19" "任然 飞鸟和蝉 完整版"
sleep 15
download "viral-hits" "v20" "铁脑袋 执迷不悟 完整版"

echo ""
echo "First 40 songs done at $(date)"
echo ""
echo "=== Check counts ==="
for d in classic-8090 viral-hits folk chinese-classics english-songs sleep-music; do
  c=$(ls "$OUTDIR/$d/"*.mp3 2>/dev/null | wc -l)
  echo "$d: $c"
done
