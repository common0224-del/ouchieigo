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

`source-images/` は `.gitignore` によりGitHubへ公開されません。元画像はこのMacに102枚あります。うち現在使わない42枚は `source-images/unused/` に置いてあり、最適化コマンドを実行しても公開用画像が再生成されないようにしています。再利用する際は該当する元画像を `source-images/` 直下へ戻し、HTMLの参照を設定してから変換してください。

バックアップは次のように行ってください。

1. **Time Machineを使っている場合：** 外付けバックアップディスクを接続し、Macのメニューバーまたは「システム設定 → 一般 → Time Machine」で「今すぐバックアップ」を実行します。完了時刻を確認してください。
2. **Time Machineを使っていない場合：** 空き容量のある外付けSSD/USBメモリーを接続します。Finderでこのフォルダー内の `source-images` を選び、`command + C` でコピーし、外付けドライブ上で `command + V` で貼り付けます。公開・配布するファイルではないため、可能なら「ディスクユーティリティ」で暗号化したAPFSドライブを使ってください。
3. コピー先の `source-images` を開き、`unused` フォルダーを含むことを確認します。ターミナルで確認する場合は、コピー先のパスに合わせて `find "/Volumes/外付けドライブ名/source-images" -type f | wc -l` を実行し、**102** と表示されることを確認してください。元フォルダーを消さずに、外付けドライブを安全に取り出します。

この作業に先立ち、リポジトリ全体の作業前バックアップもこのアプリの2階層上にある `backups/ouchieigo-pre-history-rewrite-20260920/` に保存しました。ただし同じMac内なので、故障対策として上記の外付けバックアップも作成してください。`git add -A` を実行しても `source-images/` は追加されません。

2026-09-20に公開リポジトリの履歴を書き換え、現在の `main` の履歴から元画像を除去しました。ただしGitHubの旧コミットIDを直接指定したURLは、書き換え直後も元画像を返しました。**現在の履歴から辿れないことと、過去のURLが無効になったことは別です。**完全な非公開化を保証できないため、旧URLの扱いはGitHub Supportへの相談が必要です。GitHubの[公式説明](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)では、非機密データのキャッシュ削除依頼は対応対象外となる可能性があることにも注意してください。

## 未使用画像

所有者の確認後に削除した42枚の記録は [UNUSED-IMAGES.md](UNUSED-IMAGES.md) にあります。元画像は `source-images/unused/` に残っています。

## ChromeでSlow 3Gの表示確認

1. Chromeの通常タブで公開アプリを開きます。Macでは `command + option + I` でDevToolsを開きます（または画面を右クリックして「検証」）。DevToolsの幅を広げすぎず、スマホ表示を確認するなら左上の端末アイコンを押して iPhone 相当の幅（例：390px）を選びます。
2. DevToolsの **Network** タブを開き、上部の **Disable cache** にチェックを入れます。DevToolsを開いている間だけ有効です。速度メニュー（通常は **No throttling**）から **Slow 3G** を選びます。現在のChromeで名称が **3G** の場合はそれを選びます。見えない場合はNetwork上部の `»` やメニューを確認してください。操作画面は[Chrome公式手順](https://developer.chrome.com/docs/devtools/network/reference/)も参照できます。
3. アプリを再読み込みします。洗面所・朝ごはん・リビング・寝室をそれぞれ開き、画像が出る前と出た後をスクリーンショットで比べてください。初回画面だけでなく、各場面へ入るたびにNetworkの転送と画面を見ます。
4. 各場面では、背景の長方形・下のトレー・字幕の位置を見ます。画像待ちの間は同じ大きさの「Loading...」表示になり、画像が出ても**背景の上下端、トレーの上端、字幕の枠が動かない**のが正常です。数百pxの空白が突然現れる／消える、トレーが下へ飛ぶ・切れる、字幕がずれる場合は問題です。木目の背景が画面下まで続くことも確認してください。
5. 問題があったら、**場面名・Chromeのバージョン・端末表示幅・Slow 3GとDisable cacheの設定が見えるDevToolsのスクリーンショット・画像読み込み前後のスクリーンショット・およその待ち時間**を教えてください。可能ならNetworkタブで失敗した画像の名前とHTTPステータス、Consoleの赤いエラーも添えてください。

確認後は速度メニューを **No throttling** に戻し、必要なら **Disable cache** を外してください。
