#!/usr/bin/env bash
set -euo pipefail

ROOT="/c/Users/renat/Desktop/Str8Global/web-app"
HOME_DIR="$ROOT/public/videos/portfolio"
MARTA_DIR="$ROOT/public/images/portfolio/marta"
TMP_HOME="$HOME_DIR/_optimized"
TMP_MARTA="$MARTA_DIR/_optimized"

echo "--- Replacing home/portfolio videos ---"
for f in "$TMP_HOME"/*.mp4; do
  base=$(basename "$f")
  mv -f "$f" "$HOME_DIR/$base"
  echo "  $base ($(stat -c%s "$HOME_DIR/$base" | awk '{print int($1/1024/1024) " MB"}'))"
done
rmdir "$TMP_HOME"

echo "--- Replacing marta videos (and converting .mov references) ---"
for f in "$TMP_MARTA"/*.mp4; do
  base=$(basename "$f")
  mv -f "$f" "$MARTA_DIR/$base"
  echo "  $base ($(stat -c%s "$MARTA_DIR/$base" | awk '{print int($1/1024/1024) " MB"}'))"
done
rmdir "$TMP_MARTA"

echo "--- Removing obsolete .mov originals in marta/ ---"
for i in 3 4 5 6 7 8; do
  if [ -f "$MARTA_DIR/$i.mov" ]; then
    rm "$MARTA_DIR/$i.mov"
    echo "  removed $i.mov"
  fi
done

echo "--- Final marta/ contents ---"
ls -la "$MARTA_DIR" | awk '/\.(mp4|mov)$/ {printf "  %-20s %8.1f MB\n", $NF, $5/1024/1024}'

echo "--- Final home/portfolio contents ---"
ls -la "$HOME_DIR" | awk '/\.(mp4|mov)$/ {printf "  %-50s %8.1f MB\n", $NF, $5/1024/1024}'
