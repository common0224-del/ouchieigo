# 人物画像の生成プロンプトテンプレート

人物が登場する画像では必ずこのテンプレートを使う。`docs/characters.md` の確定設定と `docs/characters/` の基準画像を正とする。以下の英語ブロックは、選んだ人物の `[CHARACTERS]` 行を含めて**そのままコピー**する。毎回書き換えるのは `[SCENE]` の値だけで、`[TECHNICAL]` は用途に合う A または B を一つ選ぶ。固定ブロックの変更は理由を添えて所有者に提案し、承認前に行わない。

## コピー用ブロック

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot.
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.
DAD: man around his 30s, calm face, light skin, short near-black dark-brown hair parted to the side, clean-shaven. Current standard outfit for both day and night: light-blue collared pajamas.
MOM: woman around her 30s, gentle face, light skin, dark-brown hair gathered and tied low at the back. Default outfit: cream top and long green skirt. Approved variation: a yellow cardigan over the cream top.

[SCENE]
Who: (characters appearing in this image; specify the chosen approved outfit variation, if any)
Action: (what happens; describe each panel separately for a two- or three-panel image)
Expression: (facial expression)
Objects: (objects in the scene; also attach the existing item image when there is one)
Composition: (position, size, and facing direction of each character; for Action Match, arrange panels from left to right at equal widths, and keep faces, hands, and important action objects clear of every panel boundary; state the position and display size of any app-rendered overlays before generation)

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[TECHNICAL B — room background: Listen & Do, etc.]
Portrait composition for a 900x1200 image. Leave enough empty floor and table space for items to be placed. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

使うときは `[CHARACTERS]` から**登場する人物の行だけ**残し、`[TECHNICAL A]` と `[TECHNICAL B]` の一方だけを残す。説明用の丸括弧は `[SCENE]` で具体的な内容に置き換える。猫など人物以外を描く場合も、既存の基準画像があれば添付し、`[SCENE]` で必要な対象として明記する。固定ブロックは画像ごとに言い換えない。

## アプリ側の重ね表示と画像の構図

1. 画像を制作する前に、アプリがその画像の上に重ねる三角、枠線、ボタン、ラベル、吹き出し枠などの有無を確認する。重なる位置に顔・手・動作の対象物など重要なものを置かない。Think & Say の吹き出し内の絵とカードも同様に確認する。
2. 重ね表示がある場合は、その**位置と画面上の大きさ**を具体的に `[SCENE]` の `Composition` に書いてから生成する。Action Match のコマ送り三角は直径31 CSS pxで各境界の上下中央に重なる。画像を作り直す際はコマを等幅にし、境界周囲に重要な絵を置かない。現行の非等幅画像の位置指定は移行中の例外とする。
3. 新しい画面や新しい種類の画像では、制作前に「この画像の上にアプリ側が重ねるものはあるか」を確認し、ない場合もその旨を報告する。
4. アプリ側の重ね表示を新たに追加・変更するときは、既存画像の顔・手・重要な物と衝突しないか、実際のカードや画面で確認してから適用する。重なる場合は画像の構図を見直し、単に重ね表示の位置を動かして済ませない。

## 服の運用と未確定のバリエーション

上の `Default outfit` と `Current standard outfit` は、`docs/characters.md` に反映済みの現行基準。男の子は青い星柄パジャマ・裸足、女の子はピンクの星柄パジャマ・室内で裸足、ママは生成りの上衣＋緑のロングスカート（黄色いカーディガンを重ねてもよい）、パパは当面、昼夜とも水色の襟付きパジャマを使う。ママのカーディガンを選ぶ場合は `[SCENE]` の Who に明記する。

男の子・女の子の日中の普段着、パパの昼服、ママのその他の部屋着は**色・形が未確定**。必要な場面が出たら基準画像を踏まえて候補を先に提示し、所有者の承認後にこのテンプレートを更新する。今回の基本服からその場で推測して変更しない。髪・顔など固定特徴は服が変わっても維持する。

## 作業・記録の手順

1. 画像の用途・人物・小道具を決め、登場人物の基準画像を `docs/characters/` から**必ず添付**する。男の子は `bathroom-stage-v5.jpg.webp` と `word-target-boy-v1.png.webp`、女の子は `breakfast-stage-v7.jpg.webp` と正面全身の `word-target-girl-v2.png.webp`、ママは `living-stage-v2.png.webp`（`word-target-mom-v1.png.webp` は補助資料）、パパは `bedroom-stage-v2.png.webp` と `word-target-dad-v1.png.webp`。小道具に既存のアイテム画像があれば、それも添付する。
2. `[STYLE]`、該当する `[CHARACTERS]`、具体化した `[SCENE]`、用途に合う `[TECHNICAL]`、`[DO NOT]` の順に一つのプロンプトを組み立てる。完成した**実際のプロンプト全文**と、添付した基準画像のファイル名を、採用した画像ごとに `docs/image-log.md` に残す。画像を生成しただけで未採用の候補は、その旨を区別して記録する。
3. 生成結果を基準画像と並べた比較画像を作る。髪型・髪色・顔立ち・年齢感・服・柄・絵のタッチを拡大確認し、比較画像を報告に含める。実際のカードや場面で表示した画像も報告する。Action Match では重要な手・物・動作を画像の上側80%に収める。
4. A の画像は生成した緑背景を `scripts/chroma-key-green.py` で透過し、輪郭の緑の縁を拡大確認する。`scripts/optimize-images.sh` で WebP に変換し、`tests/check-image-alpha.mjs` で透過を確認する。WebP quality 84、既存カテゴリの上限（背景900×1200、アイテム・届け先長辺512、Action Match長辺800）に従う。Action Match は書き出し後に **800×450px（16:9）** であることも検査し、縦横比が違う原稿は絵を引き伸ばさず透明余白で調整する。Think & Say など**新しい種類**の画像の上限は決め打ちせず、制作前に所有者に確認する。
5. 髪・服・タッチなどに繰り返しずれが出たら、具体的な再発防止文を `[DO NOT]` に追加する案を提案する。承認されるまで固定ブロックを変えない。

## 基準画像の構図上の不足

`docs/characters/` を目視確認した結果、男の子は `word-target-boy-v1.png.webp` に正面に近い立ち姿の全身が見える。女の子は承認済みの `word-target-girl-v2.png.webp` が正面全身の基準である。ママの `living-stage-v2.png.webp` は座り姿、`word-target-mom-v1.png.webp` も座り姿で、立った正面全身の基準がない。パパの `bedroom-stage-v2.png.webp` と `word-target-dad-v1.png.webp` はどちらも座り姿で、立った正面全身の基準がない。ママ・パパの立ち姿の基準を新たに作るかは所有者が判断する。
