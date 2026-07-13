#!/bin/bash
# Batch 2: Download remaining categories
mkdir -p /tmp/forum-music/viral-hits /tmp/forum-music/chinese-classics /tmp/forum-music/english-songs

# 网络红歌
echo "=== VIRAL HITS ==="
for i in $(seq 1 20); do
  queries=(
    "upbeat pop music royalty free"
    "energetic dance music no copyright"
    "trending pop instrumental free"
    "electronic pop background music"
    "happy upbeat royalty free music"
  )
  q=${queries[$((i % 5))]}
  yt-dlp -x --audio-format mp3 --audio-quality 9 --max-filesize 8M \
    -o "/tmp/forum-music/viral-hits/v$(printf '%02d' $i).%(ext)s" \
    "ytsearch1:$q" 2>&1 | grep -E "Deleting|ERROR" | head -1
  echo "Viral $i/20 done"
done

# 中文名曲 (use Chinese instrumentals)
echo "=== CHINESE CLASSICS ==="
for i in $(seq 1 20); do
  queries=(
    "chinese instrumental music royalty free"
    "traditional chinese guzheng music no copyright"
    "chinese bamboo flute relaxing music"
    "erhu instrumental no copyright"
    "chinese orchestral music free"
  )
  q=${queries[$((i % 5))]}
  yt-dlp -x --audio-format mp3 --audio-quality 9 --max-filesize 8M \
    -o "/tmp/forum-music/chinese-classics/z$(printf '%02d' $i).%(ext)s" \
    "ytsearch1:$q" 2>&1 | grep -E "Deleting|ERROR" | head -1
  echo "Chinese $i/20 done"
done

# 英文歌曲
echo "=== ENGLISH SONGS ==="
for i in $(seq 1 20); do
  queries=(
    "royalty free english pop music"
    "indie pop no copyright"
    "acoustic english song instrumental"
    "soft rock royalty free"
    "folk pop background music"
  )
  q=${queries[$((i % 5))]}
  yt-dlp -x --audio-format mp3 --audio-quality 9 --max-filesize 8M \
    -o "/tmp/forum-music/english-songs/e$(printf '%02d' $i).%(ext)s" \
    "ytsearch1:$q" 2>&1 | grep -E "Deleting|ERROR" | head -1
  echo "English $i/20 done"
done

echo "=== ALL DONE ==="
for d in sleep-music classic-8090 folk viral-hits chinese-classics english-songs; do
  echo "$d: $(ls /tmp/forum-music/$d/ 2>/dev/null | wc -l) files"
done
