# オウチエイゴ：画像の追加・更新

このフォルダーがWebアプリの本体です。公開画面は `index.html` です。

## 画像を追加・差し替える手順

1. 元のPNG/JPGを、このMacの `source-images/` に入れます。既存画像の差し替えは同じファイル名で保存します。元画像はGitHubへ公開されません。
2. ターミナルで下の2行をそのまま実行します。

```bash
cd "/Users/y.komon/Documents/Codex/2026-09-14/referenced-chatgpt-conversation-this-is-an/outputs/everyday-english-kids-v10"
./scripts/optimize-images.sh
```

変換は2行目の**1コマンド**で完了します。初回は公式WebP変換ツールを `./.tools/` に自動取得します。`curl`、`tar`、`sips` はmacOS標準のものを使います。すでに `cwebp` をインストールしている場合はそれを使います。手動で用意したい場合は、[Homebrew](https://brew.sh/)を導入した後、`brew install webp` を実行してください。

元画像のファイル名に `.webp` を付けたファイルがこのフォルダーの直下に出力されます。例：`living-item-book-v1.png` → `living-item-book-v1.png.webp`。新規画像は `index.html` の参照もこのWebP名に合わせます。元のPNG/JPGをアプリから直接参照しないでください。

スクリプトの固定値は、背景900×1200px以内、アイテム・届け先は長辺512px以内、Action Match絵は長辺800px以内、WebP画質84です。新しい種類の画像や上限値の変更が必要なら、先に所有者へ相談してください。既存のスプライトやマスコットなど、未分類の画像を差し替える場合も相談が必要です。

スクリプトは各画像の変換前後サイズ、全画像の合計、HTMLとWebPの合計を表示します。配布用アプリ本体が10MiBを超えるとエラーで止まります。画像を追加・変更したら、この数値を作業報告に含めてください。

## 元画像の保管

`source-images/` は `.gitignore` によりGitHubの現在の公開版から除外されています。元画像はこのMacに残るため、**Time Machine** または暗号化した外付けドライブにも定期的にバックアップしてください。今後のGitHub更新で `git add -A` を実行しても元画像は追加されません。

過去に公開したGitの履歴には元画像が残っています。公開済みデータを履歴からも除去するには、別途、履歴の書き換えと強制更新が必要です。履歴書き換えは共同作業者や既存のコピーにも影響するため、作業前に相談してください。

## 未使用画像

現在のアプリで参照されていないWebPの一覧は [UNUSED-IMAGES.md](UNUSED-IMAGES.md) にあります。所有者が判断するまで削除しません。
