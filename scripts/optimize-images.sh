#!/bin/bash
set -euo pipefail

# Project image standard. Change only after the owner explicitly approves new limits.
QUALITY=84
BACKGROUND_WIDTH=900
BACKGROUND_HEIGHT=1200
ITEM_LONG_EDGE=512
ACTION_LONG_EDGE=800
MAX_APP_BYTES=10485760

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_DIR="$PROJECT_DIR/source-images"
TOOL_DIR="$PROJECT_DIR/.tools"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "source-images/ が見つかりません。元画像をそこに置いてください。" >&2
  exit 1
fi

if command -v cwebp >/dev/null 2>&1; then
  CWEBP="$(command -v cwebp)"
else
  case "$(uname -m)" in
    arm64) ARCHIVE_ARCH=arm64 ;;
    x86_64) ARCHIVE_ARCH=x86-64 ;;
    *) echo "未対応のMacです。cwebpを手動でインストールしてください。" >&2; exit 1 ;;
  esac
  CWEBP="$TOOL_DIR/libwebp-1.4.0-mac-$ARCHIVE_ARCH/bin/cwebp"
  if [ ! -x "$CWEBP" ]; then
    mkdir -p "$TOOL_DIR"
    ARCHIVE="$TOOL_DIR/libwebp-1.4.0-mac-$ARCHIVE_ARCH.tar.gz"
    echo "公式のWebP変換ツールをダウンロードします。"
    curl --fail --location --silent --show-error \
      "https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.4.0-mac-$ARCHIVE_ARCH.tar.gz" \
      --output "$ARCHIVE"
    tar -xzf "$ARCHIVE" -C "$TOOL_DIR"
  fi
fi

total_old=0
total_new=0
converted=0
printf '%-46s %12s %12s %10s\n' '元画像' '変換前' 'WebP後' '削減率'

while IFS= read -r -d '' source; do
  name="$(basename "$source")"
  output="$PROJECT_DIR/$name.webp"
  case "$name" in
    *-stage-*.png|*-stage-*.jpg|*-stage-*.jpeg)
      category=background ;;
    action-*.png|action-*.jpg|action-*.jpeg)
      category=action ;;
    *-item-*.png|*-item-*.jpg|*-item-*.jpeg|word-target-*.png|word-target-*.jpg|word-target-*.jpeg)
      category=item ;;
    *)
      if [ -f "$output" ] && [ ! "$source" -nt "$output" ]; then
        continue  # Existing legacy asset; its present WebP is retained unchanged.
      fi
      echo "未分類の画像: $name。新しい種類の上限値は所有者に確認してください。" >&2
      exit 1 ;;
  esac

  dimensions="$(sips -g pixelWidth -g pixelHeight "$source" 2>/dev/null | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w, h}')"
  read -r width height <<< "$dimensions"
  if [ -z "${width:-}" ] || [ -z "${height:-}" ]; then
    echo "画像サイズを読めません: $name" >&2
    exit 1
  fi
  if [ "$category" = background ]; then
    resized="$(awk -v w="$width" -v h="$height" -v mw="$BACKGROUND_WIDTH" -v mh="$BACKGROUND_HEIGHT" 'BEGIN{s=mw/w; if(mh/h<s)s=mh/h; if(s>1)s=1; printf "%d %d",w*s+.5,h*s+.5}')"
  else
    if [ "$category" = action ]; then limit=$ACTION_LONG_EDGE; else limit=$ITEM_LONG_EDGE; fi
    resized="$(awk -v w="$width" -v h="$height" -v m="$limit" 'BEGIN{long=w>h?w:h; s=m/long; if(s>1)s=1; printf "%d %d",w*s+.5,h*s+.5}')"
  fi
  read -r new_width new_height <<< "$resized"
  "$CWEBP" -quiet -q "$QUALITY" -resize "$new_width" "$new_height" "$source" -o "$output"
  old_bytes="$(stat -f '%z' "$source")"
  new_bytes="$(stat -f '%z' "$output")"
  total_old=$((total_old + old_bytes))
  total_new=$((total_new + new_bytes))
  converted=$((converted + 1))
  awk -v n="$name" -v a="$old_bytes" -v b="$new_bytes" 'BEGIN{printf "%-46s %9.1f KB %9.1f KB %9.1f%%\n",n,a/1024,b/1024,100*(a-b)/a}'
done < <(find "$SOURCE_DIR" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

if [ "$converted" -gt 0 ]; then
  awk -v a="$total_old" -v b="$total_new" 'BEGIN{printf "変換合計: %.2f MiB → %.2f MiB（%.1f%%削減）\n",a/1048576,b/1048576,100*(a-b)/a}'
fi

image_bytes=0
app_bytes=0
while IFS= read -r -d '' asset; do
  size="$(stat -f '%z' "$asset")"
  image_bytes=$((image_bytes + size))
  app_bytes=$((app_bytes + size))
done < <(find "$PROJECT_DIR" -maxdepth 1 -type f -name '*.webp' -print0)
for page in "$PROJECT_DIR/index.html" "$PROJECT_DIR/speech-test.html"; do
  if [ -f "$page" ]; then app_bytes=$((app_bytes + $(stat -f '%z' "$page"))); fi
done
awk -v i="$image_bytes" -v a="$app_bytes" 'BEGIN{printf "全画像: %.2f MiB / 配布用アプリ本体: %.2f MiB\n",i/1048576,a/1048576}'
if [ "$app_bytes" -gt "$MAX_APP_BYTES" ]; then
  echo "配布用アプリ本体が10MiBを超えました。追加を公開する前に所有者へ相談してください。" >&2
  exit 1
fi
