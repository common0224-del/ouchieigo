# 登場人物・猫の画像棚卸しと統一案（提案のみ）

2026-09-22時点の公開用WebPを目視確認した。ここでは画像の生成・差し替えは行わない。人形・本の表紙・壁の絵など、家族本人ではない図像は含めない。

| ファイル | 使用画面 | 人物 | 髪・服装・年齢感 |
|---|---|---|---|
| `bathroom-stage-v4.jpg.webp` | Listen & Do 場所選択の洗面所カード | 男の子 | 茶色の横流し短髪、大きな目、青い星柄パジャマ、裸足。幼児。 |
| `bathroom-stage-v5.jpg.webp` | 洗面所 | 男の子 | v4とほぼ同じ外観。青い星柄パジャマ、裸足。幼児。 |
| `breakfast-stage-v7.jpg.webp` | 朝ごはん／場所選択 | 女の子 | 濃い茶髪を青いリボンで高いお団子、ピンクの星柄パジャマ。幼児。 |
| `living-stage-v2.png.webp` | リビング／場所選択 | ママ | 茶色の髪を低い位置でまとめる。生成りの上衣、緑のロングスカート。若い成人。 |
| `bedroom-stage-v2.png.webp` | 寝室／場所選択 | パパ、男の子 | パパは黒に近い短髪・無精ひげなし・水色のパジャマ、若い成人。男の子は茶髪・青い星柄パジャマ。 |
| `word-target-boy-v1.png.webp` | Item Match | 男の子 | 茶色の横流し短髪、青い星柄パジャマ、裸足。背景の男の子と近い。 |
| `word-target-girl-v1.png.webp` | Item Match | 女の子 | 黒に近い茶髪を左右ツインテール、ピンクの星柄パジャマ。朝ごはんの女の子とは髪型が違う。 |
| `word-target-mom-v1.png.webp` | Item Match | ママ | 茶色の低いまとめ髪、黄色いカーディガン、生成りの上衣、緑のスカート。リビングのママに近い。 |
| `word-target-dad-v1.png.webp` | Item Match | パパ | 濃い茶色のややウェーブした短髪・ひげなし・水色のパジャマ。寝室のパパに近い。 |
| `action-put-boy-v3.png.webp` | Action Match | 男の子 | 明るい茶色のふわっとした短髪、青い星柄パジャマ。背景より髪が明るく丸い。 |
| `action-get-boy-v2.png.webp` | Action Match | 男の子 | 上と同じ外観。 |
| `action-bring-boy-v2.png.webp` | Action Match | 男の子、ママ | 男の子は上と同じ。ママは茶色の長いウェーブ髪を下ろし、生成りの上衣と青いジーンズ。リビングのママと髪型・服が違う。 |
| `action-throw-boy-v2.png.webp` | Action Match | 男の子 | 上と同じ外観。 |
| `action-put-girl-v3.png.webp` | Action Match | 女の子 | 明るい茶色の高いポニーテール、ピンクの髪留め、ピンクの星柄パジャマ。 |
| `action-get-girl-v2.png.webp` | Action Match | 女の子 | 上と同じ外観。 |
| `action-bring-girl-v2.png.webp` | Action Match | 女の子、パパ | 女の子は上と同じ。パパは明るい茶色の短髪・ひげ・緑のセーター・ジーンズ。寝室のパパとは別人に見える。 |
| `action-throw-girl-v2.png.webp` | Action Match | 女の子 | 上と同じ外観。 |

| ファイル | 使用画面 | 猫の特徴 |
|---|---|---|
| `cat-mascot-v2-small.png.webp` | ヘッダー・ホーム・完了演出など | 黒白の顔、黄緑の大きな目、右上の黄色い星。顔中心のデフォルメ。 |
| `bathroom-stage-v4.jpg.webp`, `bathroom-stage-v5.jpg.webp` | 場所選択・洗面所 | 黒白の全身、黄緑の目。顔の黒白模様はマスコットとおおむね近い。 |
| `breakfast-stage-v7.jpg.webp` | 朝ごはん | 黒白の全身、黄緑の目。小さく描かれ、顔の模様の細部は判別しにくい。 |
| `living-stage-v2.png.webp` | リビング | 黒白の全身。目が黄緑より黄褐色に見え、顔の白い部分も異なる。 |
| `bedroom-stage-v2.png.webp` | 寝室 | ベッド上に黒白の猫。寝姿のため顔が不明瞭で、マスコットとの同一性は弱い。 |

## キャラクター設定の提案

| 人物 | 固定する特徴 | 場面で変えてよい特徴 | 正とする既存素材 |
|---|---|---|---|
| 男の子 | 4〜6歳、丸い顔・大きな茶色い目、茶色の短髪を右へ流す、明るい肌、小柄 | 朝夜の青い星柄パジャマ、日中の普段着、靴の有無 | `bathroom-stage-v5.jpg.webp` と `word-target-boy-v1.png.webp` |
| 女の子 | 4〜6歳、丸い顔・大きな茶色い目、濃い茶髪を青いリボンで高いお団子、明るい肌、小柄 | ピンクの星柄パジャマと日中の普段着 | `breakfast-stage-v7.jpg.webp` |
| ママ | 30代前後、柔らかい顔立ち、濃い茶色の低いまとめ髪、明るい肌、成人の体格 | 生成りの上衣と緑のスカートを基本に、時間帯に応じた羽織り・部屋着 | `living-stage-v2.png.webp`（`word-target-mom-v1.png.webp` は近い参考） |
| パパ | 30代前後、落ち着いた顔立ち、黒に近い短い茶髪を横分け、ひげなし、明るい肌、成人の体格 | 夜の水色パジャマ、日中の普段着 | `bedroom-stage-v2.png.webp` と `word-target-dad-v1.png.webp` |
| 猫 | 黒白の模様、黄緑の目、丸い顔とピンクの鼻、同じ耳の形 | 全身・顔アップ・寝姿、表情とポーズ | `cat-mascot-v2-small.png.webp` の顔と模様 |

優先順位案は、まず Action Match のパパと女の子、次に同画面のママと男の子、最後に Word Match の女の子と背景の猫を整える。Action Match は複数コマの連続した動作なので、人物だけでなく小道具とコマ境界も一緒に再確認する。いずれも現段階では提案であり、所有者の承認前に素材の生成・差し替えはしない。
