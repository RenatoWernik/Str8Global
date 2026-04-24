#!/usr/bin/env bash
set -euo pipefail

FF="/c/Users/renat/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg"
ROOT="/c/Users/renat/Desktop/Str8Global/web-app"
LOG="$ROOT/scripts/optimize-videos.log"

HOME_DIR="$ROOT/public/videos/portfolio"
MARTA_DIR="$ROOT/public/images/portfolio/marta"

TMP_HOME="$HOME_DIR/_optimized"
TMP_MARTA="$MARTA_DIR/_optimized"
mkdir -p "$TMP_HOME" "$TMP_MARTA"

: > "$LOG"

encode() {
  local IN="$1"
  local OUT="$2"
  local LABEL="$3"
  local START=$SECONDS
  local SIZE_IN=$(stat -c%s "$IN" 2>/dev/null || echo 0)
  echo "[$(date +%H:%M:%S)] START $LABEL ($((SIZE_IN/1024/1024)) MB)" >> "$LOG"
  "$FF" -loglevel error -y -i "$IN" \
    -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    "$OUT" 2>> "$LOG"
  local SIZE_OUT=$(stat -c%s "$OUT" 2>/dev/null || echo 0)
  local ELAPSED=$((SECONDS - START))
  echo "[$(date +%H:%M:%S)] DONE  $LABEL ($((SIZE_IN/1024/1024)) → $((SIZE_OUT/1024/1024)) MB, ${ELAPSED}s)" >> "$LOG"
}

# Home page videos
encode "$HOME_DIR/radio-popular-airfryer.mp4"  "$TMP_HOME/radio-popular-airfryer.mp4"  "home/radio-popular-airfryer"
encode "$HOME_DIR/worten-black-friday.mp4"     "$TMP_HOME/worten-black-friday.mp4"     "home/worten-black-friday"
encode "$HOME_DIR/kuantokusta.mp4"             "$TMP_HOME/kuantokusta.mp4"             "home/kuantokusta"
encode "$HOME_DIR/wowme-cartao-universo.mp4"   "$TMP_HOME/wowme-cartao-universo.mp4"   "home/wowme-cartao-universo"
encode "$HOME_DIR/weekend-of-love.mp4"         "$TMP_HOME/weekend-of-love.mp4"         "home/weekend-of-love"

# Portfolio page videos (marta) — convert .mov → .mp4
encode "$MARTA_DIR/1.mp4" "$TMP_MARTA/1.mp4" "marta/1"
encode "$MARTA_DIR/2.mp4" "$TMP_MARTA/2.mp4" "marta/2"
encode "$MARTA_DIR/3.mov" "$TMP_MARTA/3.mp4" "marta/3"
encode "$MARTA_DIR/4.mov" "$TMP_MARTA/4.mp4" "marta/4"
encode "$MARTA_DIR/5.mov" "$TMP_MARTA/5.mp4" "marta/5"
encode "$MARTA_DIR/6.mov" "$TMP_MARTA/6.mp4" "marta/6"
encode "$MARTA_DIR/7.mov" "$TMP_MARTA/7.mp4" "marta/7"
encode "$MARTA_DIR/8.mov" "$TMP_MARTA/8.mp4" "marta/8"

echo "[$(date +%H:%M:%S)] ALL DONE" >> "$LOG"
echo "--- OUTPUT SIZES ---" >> "$LOG"
ls -la "$TMP_HOME"  >> "$LOG"
ls -la "$TMP_MARTA" >> "$LOG"
