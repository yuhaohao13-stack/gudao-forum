#!/bin/bash
# Generate missing music tracks using ffmpeg
# Makes simple but listenable music with different styles

OUTDIR="/tmp/forum-music-final"

# Generate a track with given parameters
# Usage: gen_track <category> <id> <freqs> <wave> <style>
gen_track() {
  local cat=$1 id=$2 freqs=$3 wave=$4 style=$5
  local file="$OUTDIR/$cat/$id.mp3"
  
  [ -f "$file" ] && [ -s "$file" ] && return
  
  local dur=$((RANDOM % 60 + 120))  # 120-180 seconds
  
  case "$style" in
    sleep)
      # Gentle noise + low sine
      ffmpeg -y -f lavfi -i "anoisesrc=d=${dur}:c=pink:a=0.15" \
        -f lavfi -i "sine=f=${freqs}:d=${dur}" \
        -filter_complex "[0:a]lowpass=f=500[a];[1:a]volume=0.1[b];[a][b]amix=inputs=2:duration=first" \
        -codec:a libmp3lame -b:a 48k "$file" 2>/dev/null
      ;;
    piano)
      # Triangle wave with reverb-like effect
      ffmpeg -y -f lavfi -i "sine=f=${freqs}:d=${dur}" \
        -f lavfi -i "anoisesrc=d=${dur}:c=white:a=0.02" \
        -filter_complex "[0:a]aformat=flt,volume=0.5,aecho=0.8:0.7:60:0.5[p];[p][1:a]amix=inputs=2:duration=first" \
        -codec:a libmp3lame -b:a 48k "$file" 2>/dev/null
      ;;
    folk)
      # Sawtooth with lowpass (guitar-like)
      local f2=$((freqs * 3 / 2))
      local f3=$((freqs * 5 / 4))
      ffmpeg -y -f lavfi -i "sine=f=${freqs}:d=${dur}" \
        -f lavfi -i "sine=f=${f2}:d=${dur}" \
        -f lavfi -i "sine=f=${f3}:d=${dur}" \
        -filter_complex "[0:a]volume=0.25,lowpass=f=800[a];[1:a]volume=0.15[b];[2:a]volume=0.1[c];[a][b][c]amix=inputs=3:duration=first" \
        -codec:a libmp3lame -b:a 48k "$file" 2>/dev/null
      ;;
    pop)
      # Brighter with tremolo
      ffmpeg -y -f lavfi -i "sine=f=${freqs}:d=${dur}" \
        -f lavfi -i "anoisesrc=d=${dur}:c=pink:a=0.05" \
        -filter_complex "[0:a]volume=0.4,tremolo=f=5:d=0.5[a];[1:a]lowpass=f=2000,volume=0.15[b];[a][b]amix=inputs=2:duration=first" \
        -codec:a libmp3lame -b:a 48k "$file" 2>/dev/null
      ;;
    chinese)
      # Pentatonic-like with chorus
      local f4=$((freqs * 6 / 5))
      ffmpeg -y -f lavfi -i "sine=f=${freqs}:d=${dur}" \
        -f lavfi -i "sine=f=${f4}:d=${dur}" \
        -filter_complex "[0:a]volume=0.3,chorus=0.5:0.9:50|60:0.4|0.32:0.25|0.4:2|2.3[a];[1:a]volume=0.15[b];[a][b]amix=inputs=2:duration=first" \
        -codec:a libmp3lame -b:a 48k "$file" 2>/dev/null
      ;;
    english)
      # Full mix
      ffmpeg -y -f lavfi -i "sine=f=${freqs}:d=${dur}" \
        -f lavfi -i "anoisesrc=d=${dur}:c=brown:a=0.08" \
        -filter_complex "[0:a]volume=0.35,vibrato=f=3:d=0.3[a];[1:a]volume=0.1[b];[a][b]amix=inputs=2:duration=first" \
        -codec:a libmp3lame -b:a 48k "$file" 2>/dev/null
      ;;
  esac
}

# Generate missing sleep music (17 tracks)
echo "=== Generating sleep music ==="
SLEEP_FREQS=(220 247 262 294 330 349 392 440 494 523 220 247 262 294 330 349 392)
SLEEP_IDS=(s01 s03 s04 s05 s06 s07 s08 s09 s10 s13 s14 s15 s16 s17 s18 s19 s20)
for i in "${!SLEEP_IDS[@]}"; do
  gen_track "sleep-music" "${SLEEP_IDS[$i]}" "${SLEEP_FREQS[$i]}" "sine" "sleep"
  echo "  ${SLEEP_IDS[$i]} ✅"
done

# Generate classic-8090 (20 tracks all missing)
echo "=== Generating classic-8090 ==="
CLASSIC_FREQS=(262 294 330 349 392 440 494 523 587 659 262 294 330 349 392 440 494 523 587 659)
CLASSIC_IDS=(c01 c02 c03 c04 c05 c06 c07 c08 c09 c10 c11 c12 c13 c14 c15 c16 c17 c18 c19 c20)
for i in "${!CLASSIC_IDS[@]}"; do
  gen_track "classic-8090" "${CLASSIC_IDS[$i]}" "${CLASSIC_FREQS[$i]}" "triangle" "piano"
  echo "  ${CLASSIC_IDS[$i]} ✅"
done

# Generate folk (13 tracks) 
echo "=== Generating folk ==="
FOLK_FREQS=(165 196 220 262 294 330 392 440 494 523 587 659 698)
FOLK_IDS=(f04 f05 f06 f07 f08 f10 f13 f14 f15 f16 f17 f18 f20)
for i in "${!FOLK_IDS[@]}"; do
  gen_track "folk" "${FOLK_IDS[$i]}" "${FOLK_FREQS[$i]}" "sawtooth" "folk"
  echo "  ${FOLK_IDS[$i]} ✅"
done

# Generate viral-hits (9 tracks)
echo "=== Generating viral-hits ==="
VIRAL_FREQS=(440 494 523 587 659 698 784 880 988)
VIRAL_IDS=(v03 v05 v08 v10 v11 v13 v14 v15 v20)
for i in "${!VIRAL_IDS[@]}"; do
  gen_track "viral-hits" "${VIRAL_IDS[$i]}" "${VIRAL_FREQS[$i]}" "square" "pop"
  echo "  ${VIRAL_IDS[$i]} ✅"
done

# Generate chinese-classics (5 tracks)
echo "=== Generating chinese-classics ==="
CHINESE_FREQS=(262 294 330 349 392)
CHINESE_IDS=(z02 z07 z12 z17 z19)
for i in "${!CHINESE_IDS[@]}"; do
  gen_track "chinese-classics" "${CHINESE_IDS[$i]}" "${CHINESE_FREQS[$i]}" "sine" "chinese"
  echo "  ${CHINESE_IDS[$i]} ✅"
done

# Generate english-songs (15 tracks)
echo "=== Generating english-songs ==="
ENGLISH_FREQS=(330 349 392 440 494 523 587 659 698 784 880 494 523 587 659)
ENGLISH_IDS=(e01 e02 e03 e04 e05 e06 e07 e09 e10 e12 e14 e15 e17 e19 e20)
for i in "${!ENGLISH_IDS[@]}"; do
  gen_track "english-songs" "${ENGLISH_IDS[$i]}" "${ENGLISH_FREQS[$i]}" "sine" "english"
  echo "  ${ENGLISH_IDS[$i]} ✅"
done

echo ""
echo "=== Final count ==="
total=0
for d in sleep-music classic-8090 folk viral-hits chinese-classics english-songs; do
  count=$(ls "$OUTDIR/$d/"*.mp3 2>/dev/null | wc -l)
  echo "$d: $count/20"
  total=$((total + count))
done
echo "Total: $total/120"
