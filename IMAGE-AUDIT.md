# 画像棚卸し（WebP変換前後）

この一覧はタスク1・2の変換時に採取した102件の画像記録です。元画像は `source-images/` に保管し、アプリ本体は同名に `.webp` を付けた最適化版を参照します。

## 実際の画面上の表示サイズ

アプリ本体の表示幅は最大430 CSS pxです。4場面の主背景は通常 **430×573 CSS px**（幅430px、`aspect-ratio: .75`）で表示されます。ホームの背景サムネイルはおよそ **165×136 CSS px**、トレーのアイテムは **48×54 CSS px**（一部の絵は最大58×58px）、Word Matchの各カード内の絵は最大およそ **113×150 CSS px**、Action Matchの絵は画面高に応じて最大 **約402×185 CSS px**です。

そのため、主背景は高密度ディスプレイ用に900×1200px、Action Match絵は長辺800px、アイテム・届け先・マスコットは長辺512px、スプライトは768×512pxへ縮小しています。いずれも表示サイズを大きく上回り、元の1086×1448px背景や1024〜1536pxのアイテム画像は過剰でした。

| ファイル | 元形式 | 元のピクセル | WebP後ピクセル | 実際の表示 | 変換前 | WebP後 | 削減率 |
|---|---:|---:|---:|---|---:|---:|---:|
| `action-bring-boy-v1.png` | PNG | 1086x1448 | 600x800 | 現在未参照 | 1265.0 KB | 38.6 KB | 96.9% |
| `action-bring-boy-v2.png` | PNG | 1672x941 | 800x450 | Action: 最大約402×185 CSS px | 1475.9 KB | 82.1 KB | 94.4% |
| `action-bring-girl-v1.png` | PNG | 1086x1448 | 600x800 | 現在未参照 | 1406.0 KB | 39.6 KB | 97.2% |
| `action-bring-girl-v2.png` | PNG | 1672x941 | 800x450 | Action: 最大約402×185 CSS px | 1550.1 KB | 89.7 KB | 94.2% |
| `action-get-boy-v1.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 2112.4 KB | 78.0 KB | 96.3% |
| `action-get-boy-v2.png` | PNG | 1672x941 | 800x450 | Action: 最大約402×185 CSS px | 1291.0 KB | 70.7 KB | 94.5% |
| `action-get-girl-v1.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 1761.0 KB | 62.1 KB | 96.5% |
| `action-get-girl-v2.png` | PNG | 1672x940 | 800x450 | Action: 最大約402×185 CSS px | 1438.0 KB | 76.8 KB | 94.7% |
| `action-put-boy-v2.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 1969.0 KB | 76.0 KB | 96.1% |
| `action-put-boy-v3.png` | PNG | 1672x941 | 800x450 | Action: 最大約402×185 CSS px | 1098.6 KB | 70.6 KB | 93.6% |
| `action-put-girl-v2.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 1958.8 KB | 80.4 KB | 95.9% |
| `action-put-girl-v3.png` | PNG | 1672x941 | 800x450 | Action: 最大約402×185 CSS px | 1261.7 KB | 81.1 KB | 93.6% |
| `action-put-v1.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 1628.7 KB | 54.7 KB | 96.6% |
| `action-put-v2.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 1846.0 KB | 62.6 KB | 96.6% |
| `action-put-v3.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 1876.5 KB | 64.8 KB | 96.5% |
| `action-put-v4.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 1909.3 KB | 68.0 KB | 96.4% |
| `action-throw-boy-v1.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 2061.2 KB | 89.6 KB | 95.7% |
| `action-throw-boy-v2.png` | PNG | 1672x941 | 800x450 | Action: 最大約402×185 CSS px | 1503.3 KB | 93.6 KB | 93.8% |
| `action-throw-girl-v1.png` | PNG | 1536x1024 | 800x533 | 現在未参照 | 2107.9 KB | 94.5 KB | 95.5% |
| `action-throw-girl-v2.png` | PNG | 1672x941 | 800x450 | Action: 最大約402×185 CSS px | 1455.9 KB | 96.3 KB | 93.4% |
| `bathroom-cute-v2.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 1954.7 KB | 80.4 KB | 95.9% |
| `bathroom-item-comb-v4.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1560.4 KB | 24.9 KB | 98.4% |
| `bathroom-item-cup-v4.png` | PNG | 1323x1189 | 512x460 | 現在未参照 | 806.8 KB | 16.9 KB | 97.9% |
| `bathroom-item-cup-v5.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 724.4 KB | 17.7 KB | 97.6% |
| `bathroom-item-soap-v4.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1497.2 KB | 15.1 KB | 99.0% |
| `bathroom-item-toothbrush-v4.png` | PNG | 1024x1536 | 341x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1337.9 KB | 15.9 KB | 98.8% |
| `bathroom-item-toothpaste-v4.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1546.9 KB | 18.4 KB | 98.8% |
| `bathroom-item-towel-v4.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1685.5 KB | 24.3 KB | 98.6% |
| `bathroom-items-v3.png` | PNG | 1536x1024 | 512x341 | 現在未参照 | 2000.4 KB | 36.2 KB | 98.2% |
| `bathroom-stage-v3.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2195.8 KB | 124.9 KB | 94.3% |
| `bathroom-stage-v4.jpg` | JPG | 1086x1448 | 900x1200 | 主背景: 430×573 CSS px | 400.5 KB | 107.7 KB | 73.1% |
| `bathroom-stage-v4.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2174.1 KB | 109.5 KB | 95.0% |
| `bathroom-stage-v5.jpg` | JPG | 1086x1448 | 900x1200 | 主背景: 430×573 CSS px | 372.2 KB | 98.8 KB | 73.5% |
| `bathroom-stage-v5.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2079.2 KB | 101.3 KB | 95.1% |
| `bedroom-item-alarm-clock-v1.png` | PNG | 1312x1199 | 512x468 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1602.2 KB | 41.1 KB | 97.4% |
| `bedroom-item-nightcap-v1.png` | PNG | 1374x1145 | 512x427 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1574.5 KB | 34.6 KB | 97.8% |
| `bedroom-item-pajamas-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1368.9 KB | 30.6 KB | 97.8% |
| `bedroom-item-pillow-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1661.5 KB | 41.9 KB | 97.5% |
| `bedroom-item-socks-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1266.9 KB | 28.2 KB | 97.8% |
| `bedroom-stage-v1.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 1935.8 KB | 100.2 KB | 94.8% |
| `bedroom-stage-v2.png` | PNG | 1086x1448 | 900x1200 | 主背景: 430×573 CSS px | 1985.1 KB | 109.8 KB | 94.5% |
| `breakfast-cute-v1.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 1929.2 KB | 106.2 KB | 94.5% |
| `breakfast-cute-v2.png` | PNG | 1087x1447 | 901x1200 | 現在未参照 | 2319.4 KB | 129.4 KB | 94.4% |
| `breakfast-item-apple-v1.png` | PNG | 1312x1199 | 512x468 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1392.5 KB | 40.8 KB | 97.1% |
| `breakfast-item-chopsticks-v1.png` | PNG | 1374x1145 | 512x427 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 521.3 KB | 18.7 KB | 96.4% |
| `breakfast-item-fork-v1.png` | PNG | 1374x1145 | 512x427 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 665.2 KB | 22.4 KB | 96.6% |
| `breakfast-item-mug-v1.png` | PNG | 1324x1188 | 512x459 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1087.8 KB | 26.1 KB | 97.6% |
| `breakfast-item-plate-v1.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1439.7 KB | 14.7 KB | 99.0% |
| `breakfast-items-cute-v1.png` | PNG | 1254x1254 | 1200x1200 | 現在未参照 | 1125.7 KB | 179.2 KB | 84.1% |
| `breakfast-items-v2.png` | PNG | 1536x1024 | 768x512 | スプライト1区画: 48×54 CSS px | 2177.7 KB | 75.1 KB | 96.6% |
| `breakfast-stage-v3.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2329.2 KB | 142.2 KB | 93.9% |
| `breakfast-stage-v4.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2250.7 KB | 142.3 KB | 93.7% |
| `breakfast-stage-v5.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2102.5 KB | 126.5 KB | 94.0% |
| `breakfast-stage-v6.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 1912.7 KB | 104.5 KB | 94.5% |
| `breakfast-stage-v7.jpg` | JPG | 1086x1448 | 900x1200 | 主背景: 430×573 CSS px | 379.0 KB | 109.4 KB | 71.1% |
| `breakfast-stage-v7.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2003.9 KB | 113.4 KB | 94.3% |
| `cat-expression-sheet-v1.png` | PNG | 1536x1024 | 512x341 | 現在未参照 | 1735.2 KB | 59.2 KB | 96.6% |
| `cat-mascot-v1.png` | PNG | 1247x1261 | 506x512 | 現在未参照 | 1435.7 KB | 50.4 KB | 96.5% |
| `cat-mascot-v2-small.png` | PNG | 512x517 | 507x512 | プロフィール: 52×52 / トースト: 46×46 CSS px | 331.7 KB | 50.8 KB | 84.7% |
| `cat-mascot-v2.png` | PNG | 1247x1261 | 506x512 | 現在未参照 | 1516.5 KB | 54.5 KB | 96.4% |
| `cat-walking-v1.png` | PNG | 1536x1024 | 512x341 | 現在未参照 | 1888.9 KB | 40.4 KB | 97.9% |
| `home-mascot-v1.png` | PNG | 1254x1254 | 512x512 | 現在未参照 | 978.6 KB | 33.9 KB | 96.5% |
| `items-cute-v2.png` | PNG | 1536x1024 | 1200x800 | 現在未参照 | 1943.8 KB | 127.0 KB | 93.5% |
| `living-item-blanket-v1.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1835.8 KB | 22.3 KB | 98.8% |
| `living-item-blocks-v1.png` | PNG | 1230x1278 | 493x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1126.1 KB | 22.3 KB | 98.0% |
| `living-item-book-v1.png` | PNG | 1374x1145 | 512x427 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1227.6 KB | 24.7 KB | 98.0% |
| `living-item-cat-drawing-v1.png` | PNG | 1245x1263 | 505x512 | 現在未参照 | 1758.7 KB | 48.0 KB | 97.3% |
| `living-item-cat-drawing-v2.png` | PNG | 1240x1269 | 500x512 | 現在未参照 | 2140.5 KB | 68.0 KB | 96.8% |
| `living-item-cat-drawing-v3.png` | PNG | 1240x1269 | 500x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1540.8 KB | 45.6 KB | 97.0% |
| `living-item-cookie-wrapper-v1.png` | PNG | 1374x1145 | 512x427 | 現在未参照 | 1425.3 KB | 42.3 KB | 97.0% |
| `living-item-cookie-wrapper-v2.png` | PNG | 1536x1024 | 512x341 | 現在未参照 | 1952.6 KB | 51.9 KB | 97.3% |
| `living-item-cookie-wrapper-v3.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1925.5 KB | 33.7 KB | 98.2% |
| `living-item-crayons-v1.png` | PNG | 1312x1199 | 512x468 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1565.9 KB | 33.5 KB | 97.9% |
| `living-item-cup-v1.png` | PNG | 1402x1122 | 512x410 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 857.7 KB | 19.5 KB | 97.7% |
| `living-item-doll-and-teddy-v1.png` | PNG | 1536x1024 | 512x341 | 現在未参照 | 2479.2 KB | 45.4 KB | 98.2% |
| `living-item-doll-and-teddy-v2.png` | PNG | 1536x1536 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1968.5 KB | 44.8 KB | 97.7% |
| `living-item-doll-v1.png` | PNG | 1024x1536 | 341x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 2420.0 KB | 33.3 KB | 98.6% |
| `living-item-remote-v1.png` | PNG | 1145x1374 | 427x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 885.5 KB | 21.2 KB | 97.6% |
| `living-item-tissue-v1.png` | PNG | 1536x1024 | 512x341 | 現在未参照 | 1270.8 KB | 13.9 KB | 98.9% |
| `living-item-tissue-v2.png` | PNG | 1536x1024 | 512x341 | 現在未参照 | 1754.3 KB | 44.5 KB | 97.5% |
| `living-item-tissue-v3.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1305.2 KB | 19.8 KB | 98.5% |
| `living-item-toy-car-v1.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1513.6 KB | 17.8 KB | 98.8% |
| `living-stage-v1.png` | PNG | 1086x1448 | 900x1200 | 現在未参照 | 2180.9 KB | 123.9 KB | 94.3% |
| `living-stage-v2.png` | PNG | 1086x1448 | 900x1200 | 主背景: 430×573 CSS px | 2099.0 KB | 114.6 KB | 94.5% |
| `word-item-bowl-v1.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1324.5 KB | 12.0 KB | 99.1% |
| `word-item-teddy-bear-v1.png` | PNG | 1214x1295 | 480x512 | 現在未参照 | 1621.9 KB | 46.1 KB | 97.2% |
| `word-target-basket-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1739.4 KB | 52.3 KB | 97.0% |
| `word-target-bed-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1499.8 KB | 38.0 KB | 97.5% |
| `word-target-bin-v1.png` | PNG | 1289x1220 | 512x485 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 858.7 KB | 15.9 KB | 98.2% |
| `word-target-bookshelf-v1.png` | PNG | 1224x1285 | 488x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1565.0 KB | 40.9 KB | 97.4% |
| `word-target-boy-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 975.1 KB | 37.0 KB | 96.2% |
| `word-target-dad-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1591.7 KB | 46.2 KB | 97.1% |
| `word-target-drawer-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1859.9 KB | 38.3 KB | 97.9% |
| `word-target-girl-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1279.2 KB | 45.2 KB | 96.5% |
| `word-target-mom-v1.png` | PNG | 1024x1536 | 341x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1935.7 KB | 24.6 KB | 98.7% |
| `word-target-night-table-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 847.6 KB | 25.6 KB | 97.0% |
| `word-target-rack-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1146.3 KB | 38.7 KB | 96.6% |
| `word-target-sink-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1122.1 KB | 30.2 KB | 97.3% |
| `word-target-sofa-v1.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 2265.6 KB | 26.3 KB | 98.8% |
| `word-target-table-v1.png` | PNG | 1254x1254 | 512x512 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 666.2 KB | 23.6 KB | 96.5% |
| `word-target-toybox-v1.png` | PNG | 1305x1206 | 512x473 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1611.2 KB | 43.6 KB | 97.3% |
| `word-target-tray-v1.png` | PNG | 1536x1024 | 512x341 | トレー: 最大58×58 / Word: 最大約113×150 CSS px | 1453.6 KB | 19.5 KB | 98.7% |

