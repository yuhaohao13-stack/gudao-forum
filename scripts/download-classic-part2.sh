#!/bin/bash
# Part 2: Download folk, chinese-classics, english-songs
OUTDIR="/tmp/classic-music"
mkdir -p "$OUTDIR/folk" "$OUTDIR/chinese-classics" "$OUTDIR/english-songs"

download() {
  local cat="$1" id="$2" query="$3"
  local file="$OUTDIR/$cat/$id.mp3"
  if [ -f "$file" ] && [ -s "$file" ]; then
    echo "  ✅ $id exists"
    return 0
  fi
  yt-dlp --no-warnings -x --audio-format mp3 --audio-quality 5 \
    --max-filesize 15M \
    --sleep-requests 1 \
    --sleep-interval 12 \
    --max-sleep-interval 20 \
    -o "$OUTDIR/$cat/tmp_$id.%(ext)s" \
    "ytsearch:$query" 2>/dev/null | tail -1
  if [ -f "$OUTDIR/$cat/tmp_$id.mp3" ]; then
    mv "$OUTDIR/$cat/tmp_$id.mp3" "$file"
    echo "  ✅ $id: $query"
  else
    echo "  ❌ $id: $query"
  fi
}

echo "=== 民谣 ==="
download "folk" "f01" "马頔 南山南 完整版"; sleep 15
download "folk" "f02" "赵雷 成都 完整版"; sleep 15
download "folk" "f03" "宋冬野 董小姐 完整版"; sleep 15
download "folk" "f04" "陈鸿宇 理想三旬 完整版"; sleep 15
download "folk" "f05" "朴树 平凡之路 完整版"; sleep 15
download "folk" "f06" "朴树 那些花儿 完整版"; sleep 15
download "folk" "f07" "老狼 同桌的你 经典"; sleep 15
download "folk" "f08" "老狼 睡在我上铺的兄弟 经典"; sleep 15
download "folk" "f09" "许巍 曾经的你 完整版"; sleep 15
download "folk" "f10" "许巍 蓝莲花 完整版"; sleep 15
download "folk" "f11" "赵照 当你老了 完整版"; sleep 15
download "folk" "f12" "宋冬野 莉莉安 完整版"; sleep 15
download "folk" "f13" "宋冬野 安和桥 完整版"; sleep 15
download "folk" "f14" "赵雷 吉姆餐厅 完整版"; sleep 15
download "folk" "f15" "陈粒 奇妙能力歌 完整版"; sleep 15
download "folk" "f16" "陈粒 历历万乡 完整版"; sleep 15
download "folk" "f17" "丽江小倩 谣 完整版"; sleep 15
download "folk" "f18" "赵雷 南方姑娘 完整版"; sleep 15
download "folk" "f19" "赵雷 画 完整版"; sleep 15
download "folk" "f20" "谢春花 借我 完整版"; sleep 15

echo "=== 中文名曲 ==="
download "chinese-classics" "z01" "周杰伦 青花瓷 官方MV"; sleep 15
download "chinese-classics" "z02" "周杰伦 七里香 官方MV"; sleep 15
download "chinese-classics" "z03" "陈奕迅 十年 完整版"; sleep 15
download "chinese-classics" "z04" "邓紫棋 泡沫 完整版"; sleep 15
download "chinese-classics" "z05" "田馥甄 小幸运 完整版"; sleep 15
download "chinese-classics" "z06" "孙燕姿 遇见 完整版"; sleep 15
download "chinese-classics" "z07" "刘若英 后来 完整版"; sleep 15
download "chinese-classics" "z08" "光良 童话 完整版"; sleep 15
download "chinese-classics" "z09" "张韶涵 隐形的翅膀 完整版"; sleep 15
download "chinese-classics" "z10" "胡夏 那些年 完整版"; sleep 15
download "chinese-classics" "z11" "王菲 匆匆那年 完整版"; sleep 15
download "chinese-classics" "z12" "王菲 红豆 完整版"; sleep 15
download "chinese-classics" "z13" "周杰伦 夜曲 完整版"; sleep 15
download "chinese-classics" "z14" "周杰伦 东风破 完整版"; sleep 15
download "chinese-classics" "z15" "林俊杰 江南 完整版"; sleep 15
download "chinese-classics" "z16" "林俊杰 一千年以后 完整版"; sleep 15
download "chinese-classics" "z17" "林俊杰 可惜没如果 完整版"; sleep 15
download "chinese-classics" "z18" "林俊杰 她说 完整版"; sleep 15
download "chinese-classics" "z19" "薛之谦 演员 完整版"; sleep 15
download "chinese-classics" "z20" "薛之谦 丑八怪 完整版"; sleep 15

echo "=== 国际英文歌曲 ==="
download "english-songs" "e01" "The Beatles Yesterday official audio"; sleep 15
download "english-songs" "e02" "John Lennon Imagine official audio"; sleep 15
download "english-songs" "e03" "Eagles Hotel California official audio"; sleep 15
download "english-songs" "e04" "Queen Bohemian Rhapsody official audio"; sleep 15
download "english-songs" "e05" "Michael Jackson Billie Jean official audio"; sleep 15
download "english-songs" "e06" "Celine Dion My Heart Will Go On official audio"; sleep 15
download "english-songs" "e07" "Ed Sheeran Shape of You official audio"; sleep 15
download "english-songs" "e08" "Adele Someone Like You official audio"; sleep 15
download "english-songs" "e09" "Adele Rolling in the Deep official audio"; sleep 15
download "english-songs" "e10" "The Beatles Let It Be official audio"; sleep 15
download "english-songs" "e11" "The Beatles Hey Jude official audio"; sleep 15
download "english-songs" "e12" "John Denver Take Me Home Country Roads official"; sleep 15
download "english-songs" "e13" "Adele Hello official audio"; sleep 15
download "english-songs" "e14" "Maroon 5 Sugar official audio"; sleep 15
download "english-songs" "e15" "Ed Sheeran Perfect official audio"; sleep 15
download "english-songs" "e16" "OneRepublic Counting Stars official audio"; sleep 15
download "english-songs" "e17" "Coldplay Viva La Vida official audio"; sleep 15
download "english-songs" "e18" "John Legend All of Me official audio"; sleep 15
download "english-songs" "e19" "Wiz Khalifa See You Again official audio"; sleep 15
download "english-songs" "e20" "Luis Fonsi Despacito official audio"; sleep 15

echo ""
echo "=== All done at $(date) ==="
for d in classic-8090 viral-hits folk chinese-classics english-songs sleep-music; do
  c=$(ls "$OUTDIR/$d/"*.mp3 2>/dev/null | wc -l)
  size=$(du -sh "$OUTDIR/$d/" 2>/dev/null | cut -f1)
  echo "$d: $c files ($size)"
done
