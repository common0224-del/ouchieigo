# 人物画像の生成記録

このファイルは `docs/image-prompts.md` に基づく制作の記録。**候補と採用済みを区別する。** 新しい画像を採用した場合は、実際に使ったプロンプト全文、添付した基準画像、透過・サイズ検査、所有者の承認を追記する。

## 2026-10-03 — `think-say-open-milk-dad-v1`〜`v4`（すべて不採用）

- 用途：Think & Say の右の絵「open the milk」。候補は `private-prototypes/think-say-open-milk-dad-v1.png.webp`、`private-prototypes/think-say-open-milk-dad-v2.png.webp`、`private-prototypes/think-say-open-milk-dad-v3.png.webp`、`private-prototypes/think-say-open-milk-dad-v4.png.webp` として非公開保管し、本体には組み込まない。
- 不採用の理由：日本の一般的な紙パックの開け口を何度修正しても正確な形で描けず、屋根の稜線、片端だけを引き出す注ぎ口、閉じた反対側の関係が崩れた。小さな表示でも開ける動作を確実に伝えられる候補には至らなかった。
- `open the milk` は描き方が見つかるまで最初のリリースから保留し、操作確認用プロトタイプの3問目も `Can you get the towel?` に変更した。過去の確認用ファイルは採用画像・公開画像と区別して残す。

## 2026-09-22 — `word-target-girl-v2-candidate`（承認済み・公開用へ反映）

- 用途：Item Match の女の子。承認後、公開用 `word-target-girl-v2.png.webp` と全身基準画像 `docs/characters/word-target-girl-v2.png.webp` に採用。旧v1は `source-images/legacy/` に保管。
- 生成：組み込み imagegen。朝ごはん背景は女の子の顔・髪・服の基準、男の子の単体画像は立ち姿の比率と画風のみの補助資料。
- 添付した基準画像：`docs/characters/breakfast-stage-v7.jpg.webp`、`docs/characters/word-target-boy-v1.png.webp`。
- 元の緑背景：Mac 上の `source-images/generation-inputs/word-target-girl-v2-green.png`（Git と公開サイトの対象外）。
- 透過候補：`private-prototypes/word-target-girl-v2-candidate.png.webp`（Git と公開サイトの対象外）。341×512px、WebP quality 84。
- 確認：`tests/check-image-alpha.mjs` で四隅0/0/0/0、透明領域1%以上。淡い青と濃い青に重ねて輪郭を拡大し、目立つ緑色の縁は見当たらない。`private-prototypes/word-target-girl-comparison.png` に基準・現行・候補を並べた。`private-prototypes/word-target-girl-in-card-composite.png` は既存のレイアウトテスト画像へ候補を**オフライン合成**したカード表示イメージであり、実機・実ブラウザの表示確認ではない。
- 判定：所有者が承認済み。公開用と女の子の全身基準画像へ反映済み。生成時プロンプトの `blue ribbon` は当時使った原文の記録として下に保持する。承認後、実際の髪飾りは青いシュシュと確定し、以後の固定ブロックは `docs/image-prompts.md` の `blue scrunchie` を使う。

### 実際に使ったプロンプト全文

```text
Use case: illustration-story
Asset type: Item Match full-body girl character candidate, not a finished UI screen.
Input images: Image 1 (breakfast-stage-v7.jpg.webp) is the authoritative GIRL identity, hair, face, and pink pajama style reference. Image 2 (word-target-boy-v1.png.webp) is ONLY a reference for full-body standing framing, illustration finish, and approximate child proportions; do not transfer the boy's face, hair, sex, or clothing colors to the girl.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue ribbon. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.

[SCENE]
Who: GIRL in her approved default pink star pajamas, barefoot.
Action: Standing alone in a friendly relaxed pose, full body visible from the top of the high bun to the toes; arms naturally open a little so the silhouette reads clearly on a small card.
Expression: Warm happy smile, looking toward the viewer, same facial identity as Image 1.
Objects: None.
Composition: One girl only, front-facing, centered, generously padded within a portrait canvas. Her head, hands, pajama cuffs, and both bare feet are fully inside the frame. Draw her as the same child from Image 1, not a new character. Preserve the precise high-bun shape and blue ribbon.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue ribbon; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-23 — `action-throw-boy-v3-draft`（承認済み・公開用へ反映）

- 用途：Action Match の男の子の `throw away`。所有者が初稿をそのまま承認し、再生成せず公開用 `action-throw-boy-v3.png.webp` に採用した。
- 制作時に確認できる指示：2コマで「ティッシュを持っている → ゴミ箱に捨てた」を表現し、ゴミ箱は両コマで同じ位置、区切り線なし・等幅、境界に重要な物を置かない。後続のゴミ箱と手の位置の修正案は取り下げられ、初稿を採用した。
- 保管元：`source-images/generation-inputs/action-throw-boy-v3-green.png`（緑背景、1672×941px、1,493,639 bytes）。透過処理済みPNGは `private-prototypes/action-throw-boy-v3-cutout.png`。どちらもGit追跡・公開対象外。
- 書き出し：透過PNGから `cwebp -q 84 -resize 800 450` で出力。公開用と承認済み `private-prototypes/action-throw-boy-v3-draft.png.webp` のSHA-256が一致し、絵は変えていない。公開用48,878 bytes、旧v2は95,818 bytes（約49.0%削減）。
- 旧版：元PNGと公開用WebPを `source-images/legacy/` に保管。`index.html` の参照をv3へ切り替え、`data-panels="2"` を設定した。カード表記 `Throw away` と音声 `Throw it away.` は維持。
- 確認：`tests/check-image-alpha.mjs` PASS（800×450px、四隅アルファ0/0/0/0）。`zsh tests/run-all.zsh` は透過と構文チェックがPASSし、ブラウザテストはこの実行環境でChromium・WebKitの起動時にSIGABRTしたため未完了。
- 制作時の実際の画像生成プロンプト全文と添付基準画像の一覧は、現ワークスペース内に記録が見つからない。上記は確認できる制作指示のみであり、生成プロンプトを推測で補っていない。原履歴が確認できたら追記する。

## 2026-09-23 — `action-get-boy-v3-candidate`（承認済み・公開用へ反映）

- 用途：Action Match の `get`（男の子）。所有者の承認後、公開用 `action-get-boy-v3.png.webp` に差し替え、`index.html` も切り替えた。旧v2の元PNGとWebPは `source-images/legacy/` に保管。
- 生成：組み込み imagegen。承認済み `action-put-boy-v4.png.webp` を2コマ構成・区切り線・鮮やかな仕上げの基準とした。
- 添付した基準画像：`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/bathroom-stage-v5.jpg.webp`、`action-put-boy-v4.png.webp`、動作の意味だけを参照する旧 `action-get-boy-v2.png.webp`。
- 元の緑背景：Mac 上の `source-images/legacy/action-get-boy-v3-green.png`（v4公開後に移動。Git と公開サイトの対象外）。1672×941px、1,637,803 bytes。
- 透過候補：`private-prototypes/action-get-boy-v3-candidate.png.webp`（Git と公開サイトの対象外）。800×450px、WebP quality 84、70,914 bytes。
- 確認：`tests/check-image-alpha.mjs` で四隅0/0/0/0、透明領域1%以上。淡色と濃色に重ねた `private-prototypes/action-get-boy-v3-edge-check.png` で、目立つ緑色の縁がないことを確認。`private-prototypes/action-get-boy-v3-comparison.png` に男の子基準・put構成基準・現行get・候補を並べた。`private-prototypes/action-get-boy-v3-card-preview.png` は既存カード寸法を再現した**オフライン合成**であり、実機・実ブラウザの表示確認ではない。
- サイズ：公開用の旧v2は72,358 bytes、新v3は70,914 bytes（1,444 bytes、約2.0%削減）。
- 差し替え直後の `zsh tests/run-all.zsh`：透過と構文の検査はPASS。この実行環境では Chromium / WebKit が起動時に SIGABRT し、ブラウザを使うテストは完走できなかった。所有者のMacでの再実行が必要。

### 実際に使ったプロンプト全文

```text
Use case: illustration-story
Asset type: Action Match “get” two-panel boy illustration candidate, not a finished UI screen.
Input images: Image 1 and Image 2 are authoritative BOY identity, hair, face, and blue pajama references. Image 3 is the authoritative panel layout, bright clean finish, cyan divider line, scale, and composition reference. Match its two-panel construction exactly. Image 4 is ONLY a semantic reference for the action “get a book”; do not copy its watercolor texture, face, hairstyle, muted colors, divider, or composition.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot.

[SCENE]
Who: BOY in his approved blue star pajamas, barefoot.
Action: A clear two-panel sequence for “get the book.” LEFT PANEL: the boy reaches with one hand and clearly takes one closed red picture book from the middle shelf of a small child-height wooden bookshelf. RIGHT PANEL: the same boy stands holding that exact red closed book securely against his chest with both hands; the bookshelf remains beside him but the book is visibly no longer on its shelf.
Expression: Happy, attentive, and easy to read; the same warm smile and facial identity in both panels.
Objects: One small wooden child-height bookshelf with a few simple colorful books, and one distinctive closed red picture book with a small yellow star symbol only (no letters or words).
Composition: Wide 16:9 two-panel composition exactly like Image 3. One equal-width left panel and one equal-width right panel, separated by one thick bright cyan vertical rounded divider. Keep the boy large and consistent in scale across both panels. The reaching hand, red book, shelf gap, and held book must all read clearly at small card size. Keep all heads, hands, feet, furniture, and objects fully inside the frame. Place the important action and objects within the upper 80% while retaining both bare feet.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
Do not use a transparent or checkerboard background. Do not use watercolor texture or muted pastel colors. Do not add a third panel. Do not duplicate the boy within a panel. Do not draw an open book or readable text. Do not crop feet, hair, hands, bookshelf, or divider.
```

## 2026-09-23 — `action-bring-boy-v3-candidate`（承認済み・公開用へ反映）

- 用途：Action Match の `bring`（男の子とママ）。所有者の承認後、公開用 `action-bring-boy-v3.png.webp` に差し替え、`index.html` を切り替えた。旧v2の元PNGとWebPは `source-images/legacy/` に保管。
- 生成：組み込み imagegen。初稿では中央の余白が不足したため、同じ画像を対象に構図だけを再調整して最終候補とした。
- 最終調整時の添付画像：初稿の緑背景画像、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/living-stage-v2.png.webp`、`action-put-boy-v4.png.webp`、`living-item-book-v1.png.webp`。ママの追加参考として初稿生成時には `docs/characters/word-target-mom-v1.png.webp` も参照した。
- 元の緑背景：Mac上の `source-images/generation-inputs/action-bring-boy-v3-green.png`（Git と公開サイトの対象外）。1672×941px、1,414,421 bytes。
- 透過PNG：`private-prototypes/action-bring-boy-v3-cutout.png`。`scripts/chroma-key-green.py` で処理。
- 候補WebP：`private-prototypes/action-bring-boy-v3-candidate.png.webp`（Git と公開サイトの対象外）。800×450px、WebP quality 84、50,656 bytes。候補段階なので公開画像を再生成する `scripts/optimize-images.sh` は使用せず、同じqualityと上限を指定して `cwebp` で書き出した。
- 確認：四隅のアルファはすべて0、中央 x=370〜429px の縦帯は全域でアルファ0。淡色・濃色の背景に重ねた `private-prototypes/action-bring-boy-v3-edge-check.png` の拡大確認で、目立つ緑の縁は見当たらない。`private-prototypes/action-bring-boy-v3-comparison.png` に人物基準・旧画像・候補を並べた。`private-prototypes/action-bring-boy-v3-card-preview.png` は三角を重ねた**オフライン合成**であり、実機・実ブラウザの表示確認ではない。公開用の透過検査はPASS（800×450px、四隅0/0/0/0）。`data-panels="2"` のためアプリ側の三角が1つ表示される対象。
- サイズ：旧v2は84,042 bytes、新v3は50,656 bytes（33,386 bytes、約39.7%削減）。
- 判定：所有者が承認済み。区切り線は描いていない。棚・椅子・ママを左右のコマで同じ位置に置き、男の子と赤い本を棚側からママ側へ移した。
- 差し替え直後の `zsh tests/run-all.zsh`：透過と構文の検査はPASS。この実行環境では Chromium / WebKit が起動時に SIGABRT し、ブラウザを使うテストは完走できなかった。所有者のMacでの再実行が必要。

### 最終候補の生成に使ったプロンプト全文

```text
Use case: illustration-story
Asset type: Action Match “bring” two-panel boy-and-mom illustration candidate, not a finished UI screen.
Input images: Image 1 is the EDIT TARGET generated two-panel bring image; preserve its characters, outfit, facial identity, book, story, 16:9 frame, and green background. ONLY adjust composition to enforce the wider empty center gutter. Image 2 (word-target-boy-v1.png.webp) is the BOY identity reference. Image 3 (living-stage-v2.png.webp) is the MOM identity and approved outfit reference. Image 4 (action-put-boy-v4.png.webp) is the vivid finish reference, not a divider reference. Image 5 (living-item-book-v1.png.webp) is the red book reference.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot.
MOM: woman around her 30s, gentle face, light skin, dark-brown hair gathered and tied low at the back. Default outfit: cream top and long green skirt. Approved variation: a yellow cardigan over the cream top.

[SCENE]
Who: BOY in his approved blue star pajamas, barefoot; MOM in her approved default cream top and long green skirt, no cardigan, dark-brown hair tied low.
Action: A clear two-panel LEFT-TO-RIGHT sequence for “bring the book to Mom.” LEFT PANEL: the red star-cover book sits on a child-height bookshelf at the far left; the boy stands beside the shelf and reaches to take the book. Mom sits on a simple chair at the far right, noticeably away from the shelf, watching the boy. No handoff yet. RIGHT PANEL: the very same shelf remains at the far left with the book now gone; the same Mom remains seated on the same chair at the far right in the same position; the boy has WALKED across the room from the shelf to Mom and now hands her the SAME red star-cover book. The boy and book change positions; the bookshelf, chair, and Mom do not change positions between panels.
Expression: Both are friendly and attentive; Mom warmly watches him, the boy happily brings the book.
Objects: One small wooden child-height bookshelf, one simple chair, one red closed book with a yellow star on its cover matching Image 5. Do not add other books or objects that could confuse which book moves.
Composition: A wide 16:9 canvas with TWO EQUAL-WIDTH panels, one left half and one right half. Each half repeats the same fixed arrangement: shelf at its far left and seated Mom at its far right, with clear visible distance between them. In the left half the boy is at the shelf; in the right half the boy is beside Mom. Keep all heads, hands, book, chair, and bookshelf fully inside each half. Keep their visual scale consistent between halves. Reserve a completely EMPTY pure-green vertical gutter around the exact 50% center boundary, at least 12% of the TOTAL image width (6% blank space on each side of the center). Every part of every object, including the chair and shelf legs, must remain OUTSIDE that gutter. Put the whole left scene slightly farther left and the whole right scene slightly farther right while keeping the same furniture layout and Mom position relative to each panel. The app renders a circular right-facing triangle of 31 CSS px at that center boundary and the artwork must not collide with it. All important actions and objects should read within the upper 80% of the image. No divider, no arrow, no line between panels.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-27 — 男の子の昼服 `boy-daywear-v2.png.webp`（承認済み・基準画像に採用）

- 採用した候補：`private-prototypes/boy-daywear-v2.png.webp`。同一ファイルを `docs/characters/boy-daywear-v2.png.webp` に配置。512×512px、WebP quality 84、透過。候補と採用画像の SHA-256 は一致する。
- 添付した基準画像：`docs/characters/word-target-boy-v1.png.webp`（顔・髪・年齢感・絵のタッチ）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の猫の顔）。
- 緑背景で生成後、`scripts/chroma-key-green.py --edge-shrink 1` で透過。髪の縁を拡大確認し、`tests/check-image-alpha.mjs` で四隅の透過を確認。比較画像は `private-prototypes/` に保管。

### 実際に使ったプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy only, daytime indoors, wearing the approved daytime outfit and barefoot. Reference image 1 is the same boy in pajamas and fixes his face, hairstyle, hair color, age, proportions, and illustration style. Reference image 2 fixes the cat face used for the tiny chest emblem.
Action: Standing naturally, facing almost straight forward, both hands visible and relaxed; no other action.
Expression: Cheerful, friendly open smile like the reference boy, with the same large brown eyes and rosy cheeks.
Objects: Only a tiny, simplified black-and-white face of the reference cat as a flat emblem on the T-shirt chest. Keep it simple at this scale; no separate cat, star, or other object.
Composition: Single full-body standing character, centered and large but fully inside the square frame, head, both hands, and bare feet visible with clear margins. No app-rendered overlays will cover this reference image. Keep the background uniformly pure #00FF00, not transparent; leave clean separation at every hair edge for chroma key.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-27 — 女の子の昼服 `girl-daywear-v1.png.webp`（承認済み・基準画像に採用）

- 採用した候補：`private-prototypes/girl-daywear-v1.png.webp`。同一ファイルを `docs/characters/girl-daywear-v1.png.webp` に配置。512×512px、WebP quality 84、透過。候補と採用画像の SHA-256 は一致する。
- 添付した基準画像：`docs/characters/word-target-girl-v2.png.webp`（顔・髪・年齢感・絵のタッチ）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の猫の顔）、`docs/characters/boy-daywear-v2.png.webp`（昼服の布の質感と猫のワンポイントの大きさ・位置のみ）。
- 緑背景で生成後、`scripts/chroma-key-green.py --edge-shrink 2` で透過。お団子・シュシュ・髪の縁を拡大確認し、`tests/check-image-alpha.mjs` で四隅の透過を確認。比較画像は `private-prototypes/` に保管。

### 実際に使ったプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One GIRL only, daytime indoors, wearing the approved plain pink short-sleeved dress and barefoot. Reference image 1 (word-target-girl-v2.png.webp) is authoritative for her face, high dark-brown bun, blue scrunchie, age, proportions, and illustration style. Reference image 2 (cat-mascot-v2-small.png.webp) is authoritative for the black-and-white cat face on the chest. Reference image 3 (boy-daywear-v2.png.webp) is for the daytime clothing illustration treatment, fabric texture, and size and position of the tiny cat-face chest emblem ONLY. Do not copy the boy's face, hairstyle, hair color, body, gender, or clothing shape.
Action: Standing naturally, facing almost straight forward, both hands visible and relaxed; no other action.
Expression: Cheerful, friendly open smile like the reference girl, with the same large brown eyes and rosy cheeks.
Objects: Only a tiny, simplified black-and-white face of the reference cat as a flat emblem on the upper chest of the dress. Keep it simple at this scale; no separate cat, star, or other object.
Composition: Single full-body standing GIRL, centered and large but fully inside a square frame, with high bun, blue scrunchie, head, both hands, the whole plain pink dress, legs, and bare feet visible with clear margins. The dress is plain without pajama stars or a pajama collar. No app-rendered overlays will cover this reference image. Final asset will be 512x512 pixels without stretching. Keep the generation background uniformly pure #00FF00, not transparent; leave clean separation at every hair and scrunchie edge for chroma key.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-23 — `action-put-girl-v4-candidate`（承認済み・公開用へ反映）

- 用途：Action Match の `put`、女の子版。所有者の承認後、公開用 `action-put-girl-v4.png.webp` と `index.html` の参照を切り替えた。旧v3のPNGとWebPは `source-images/legacy/` に保管。候補は `private-prototypes/action-put-girl-v4-candidate.png.webp` にも保存。
- 生成：組み込み imagegen。添付した基準画像は `docs/characters/word-target-girl-v2.png.webp`（正面全身）、`docs/characters/breakfast-stage-v7.jpg.webp`（顔・髪・服）、`action-put-boy-v4.png.webp`（承認済みの2コマ構成と小道具・画風）。
- 緑背景原稿：`source-images/generation-inputs/action-put-girl-v4-green.png`、1672×941px、1,530,516 bytes。透過処理：`scripts/chroma-key-green.py` → `private-prototypes/action-put-girl-v4-cutout.png`。書き出し：`cwebp -q 84 -resize 800 450`、候補WebP 58,406 bytes（元PNG比約96.2%削減）。
- 検査：`tests/check-image-alpha.mjs` PASS（800×450px、四隅アルファ0/0/0/0）。淡い青と濃い青の背景に重ねた `private-prototypes/action-put-girl-v4-edge-check.png` で、目立つ緑の縁は見られない。`private-prototypes/action-put-girl-v4-comparison.png` は基準・男の子版・旧女の子版・新候補を比較。`private-prototypes/action-put-girl-v4-card-preview.png` は現行カード寸法と二重矢印を模した**オフライン合成**で、実ブラウザのスクリーンショットではない。
- 判定：女の子の高いお団子・青いシュシュ・ピンクの星柄パジャマ・裸足、等幅2コマ、中央余白、区切り線なしを確認。所有者承認済み。`data-panels="2"` のままなのでアプリ側の矢印が表示される対象。
- 差し替え後の `zsh tests/run-all.zsh`：公開用画像を含む透過55枚と `index.html` の構文チェックはPASS。ChromiumとWebKitはこの実行環境で起動時SIGABRTとなり、ブラウザ検査は未完了。所有者のMacで再実行が必要。

### 実際に使ったプロンプト全文

```text
Use case: illustration-story
Asset type: Action Match “put” two-panel GIRL illustration candidate, not a finished UI screen.
Input images: Image 1 (word-target-girl-v2.png.webp) is the authoritative GIRL full-body identity, hairstyle, blue scrunchie, face, pink star pajamas and bare feet reference. Image 2 (breakfast-stage-v7.jpg.webp) is the authoritative GIRL identity reference in a room. Image 3 (action-put-boy-v4.png.webp) is the approved Action Match composition, vivid clean illustration finish, identical red cube and blue round stool reference. Transfer its action sequence and object design, but use Image 1 and 2 for the GIRL and do NOT copy its drawn cyan divider. The finished image must contain only the girl, the cube and the stool, in two separate equal-width panels.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.

[SCENE]
Who: GIRL in her approved pink collared pajamas with white stars, high dark-brown bun tied by a visibly blue scrunchie, barefoot. The SAME girl appears once in each panel.
Action: Two-frame LEFT-TO-RIGHT action sequence for “put.” LEFT PANEL: the girl is holding one small bright red cube in her hand, next to an empty small round blue stool. RIGHT PANEL: she has put that SAME red cube on top of the stool; her hands are away from the cube. The stool remains in the SAME position and at the SAME size in its respective panel; only the cube and the girl's arms/pose change.
Expression: Cheerful, focused on the cube, large expressive eyes; the same face and hair in both panels.
Objects: One simple bright red toy cube and one round blue child-size stool in each panel, matching Image 3's object style. No other props.
Composition: Wide 16:9 canvas, TWO EQUAL-WIDTH panels, each occupying exactly half the width, with no drawn frame, divider, arrow or line. The girl is large on the left side of each panel, the blue stool on the right side of each panel. Match Image 3's scale and two-frame story. Reserve an EMPTY pure-green center gutter around the exact 50% panel boundary, at least 10% of the total canvas width, with no face, hand, hair, cube, stool, or other important object touching it. The app overlays a pair of small red arrows with white outlines at that center boundary, approximately 38×22 CSS px on a card, vertically centered. All heads, hands, feet, cube and stool must be fully inside their own panel. Put all important actions and objects within the upper 80% of the image, while retaining both bare feet inside the frame. Same camera angle, stool position, stool size, girl size and visual proportions across both panels.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-23 — `action-put-boy-v5-noline-candidate`（承認済み・公開用へ反映）

- 用途：Action Match の承認済み `put-boy-v4` から画像内の水色の区切り線を除いた候補。所有者の承認後、公開用 `action-put-boy-v5.png.webp` に差し替え、`index.html` の参照も切り替えた。旧v4の元PNGとWebPは `source-images/legacy/` に保管。
- 確認できた記録：`docs/image-log.md` には **v4制作時の元プロンプト全文は存在しない**。元原稿 `source-images/drafts/action-put-boy-v4-green.png` と公開済みv4が残っていたため、これを編集対象にした。存在しない元プロンプトを推測で再現したとは記さない。
- 生成：組み込み imagegen の既存画像編集。添付画像は Image 1：上記v4緑背景原稿（編集対象）、Image 2：`action-put-boy-v4.png.webp`（承認済み公開版）、Image 3：`docs/characters/word-target-boy-v1.png.webp`、Image 4：`docs/characters/bathroom-stage-v5.jpg.webp`（人物基準）。水色線のみを周囲の緑背景で置き換えるよう指定した。
- 候補の緑背景PNG：`source-images/drafts/action-put-boy-v5-noline-green.png`、1672×941px、1,509,056 bytes。透過：`scripts/chroma-key-green.py` → `private-prototypes/action-put-boy-v5-noline-cutout.png`。WebP quality 84、800×450pxの候補：`private-prototypes/action-put-boy-v5-noline-candidate.png.webp`、55,026 bytes（緑背景PNG比約96.4%削減、旧公開WebP 57,290 bytes比約4.0%削減）。
- 検査：`tests/check-image-alpha.mjs` PASS（四隅アルファ0/0/0/0）。`private-prototypes/action-put-boy-v5-noline-edge-check.png` の淡色・濃色背景で目立つ緑の縁なし。現行版との並列比較は `private-prototypes/action-put-boy-v5-noline-comparison.png`、カード寸法と二重矢印を模したオフライン合成は `private-prototypes/action-put-boy-v5-noline-card-preview.png`（実ブラウザのスクリーンショットではない）。
- 目視では、男の子・積み木・台の構図と位置は維持され、水色線だけが消えた。画像生成による微細な再描画はあるため、完全なピクセル一致ではない。元の緑背景画像との比較では中央70px帯を除いた画素の平均絶対差は3.85/255、30階調超の差がある画素は0.67%。所有者承認済み。
- 差し替え後の `zsh tests/run-all.zsh`：公開画像を含む透過55枚と `index.html` 構文はPASS。ChromiumとWebKitはこの実行環境で起動時SIGABRTとなり、ブラウザテストは未完了。所有者のMacで再実行が必要。

### この候補に実際に使った画像編集プロンプト全文

```text
Use case: precise-object-edit
Asset type: Action Match “put” two-panel BOY illustration, unpublished no-divider candidate.
Primary request: EDIT Image 1 with the smallest possible change: REMOVE ONLY the vertical cyan/light-blue divider line in the exact center (about x=836 of the 1672 px-wide image) and replace its pixels with the same uniform pure chroma green (#00FF00) as the surrounding empty background. Keep the existing clear center gap for the app-rendered red double arrows. Do not regenerate or redraw any other region. Keep the exact 16:9 canvas, panel positions, boy identity, facial features, hair strands, hands, bare feet, blue star pajamas, red cube, blue round stool, every object edge, colors, lighting and shadows exactly as Image 1. Output the edited result on a plain solid pure-green backdrop, NOT a transparent or checkerboard background.
Input images: Image 1 is the EDIT TARGET, the original approved green-background action-put-boy-v4 artwork with its cyan center divider. Image 2 is the approved published WebP reference showing the exact final picture after cutout; preserve everything except the line. Image 3 (word-target-boy-v1.png.webp) and Image 4 (bathroom-stage-v5.jpg.webp) are authoritative BOY identity references. Do not borrow unrelated room elements from them.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot.

[SCENE]
Who: The same approved boy appears once in each equal-width panel, unchanged from Image 1.
Action: LEFT: boy holding the small red cube beside an empty blue round stool. RIGHT: the same red cube now on top of the identical blue stool, boy's hands away. Preserve both poses exactly as Image 1.
Expression: Preserve the boy's exact cheerful facial expression in each panel.
Objects: Preserve the exact small red cube and blue round stool in both panels. Add nothing.
Composition: Preserve the exact two equal-width halves and EVERY existing position and scale from Image 1. The only edit is removal of the cyan center divider, leaving pure green in its place. Keep the existing gap around the exact 50% border clear of all faces, hands and objects. The app overlays two red arrows with white outlines, together about 38x22 CSS px, centered on this boundary. Do not shift the boy, cube, stool or frame crop. Keep all important action and objects in the upper 80% while retaining the existing visible feet.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Invariants repeated: IMAGE 1 IS AN EDIT TARGET. Change only the cyan center divider pixels into the surrounding pure green. Preserve every other visible pixel as closely as possible. No new art, no moved or enlarged objects, no altered character.
```

## 2026-09-23 — `action-get-boy-v4-noline-candidate`（承認済み・公開用へ反映）

- 用途：承認済み `action-get-boy-v3` の水色の区切り線だけを取り除いた版。所有者の承認後、公開用 `action-get-boy-v4.png.webp` と `index.html` の参照を切り替えた。旧v3の公開WebPと緑背景原稿を `source-images/legacy/` に保管。
- 編集対象：現在は `source-images/legacy/action-get-boy-v3-green.png` に保管。添付画像は Image 1：この緑背景の原稿、Image 2：当時公開されていた `action-get-boy-v3.png.webp`（現在は `source-images/legacy/`）、Image 3：`docs/characters/word-target-boy-v1.png.webp`、Image 4：`docs/characters/bathroom-stage-v5.jpg.webp`（男の子の人物基準）。
- 今回の緑背景出力：`source-images/drafts/action-get-boy-v4-noline-green.png`、1672×941px、1,592,430 bytes。透過処理：`scripts/chroma-key-green.py` → `private-prototypes/action-get-boy-v4-noline-cutout.png`。WebP quality 84、800×450pxの候補：`private-prototypes/action-get-boy-v4-noline-candidate.png.webp`、68,086 bytes（緑背景PNG比約95.7%削減、現行WebP 70,914 bytes比約4.0%削減）。
- 検査：`tests/check-image-alpha.mjs` PASS（四隅アルファ0/0/0/0）。`private-prototypes/action-get-boy-v4-noline-edge-check.png` を淡色・濃色背景で目視し、目立つ緑のふちなし。公開版との比較は `private-prototypes/action-get-boy-v4-noline-comparison.png`、カード寸法・二重矢印のプレビューは `private-prototypes/action-get-boy-v4-noline-card-preview.png`（オフライン合成、ブラウザのスクリーンショットではない）。
- 男の子、本棚、本の構図と位置は見た目上維持され、区切り線が消えた。画像編集モデルによる微細な再描画はあるので完全なピクセル一致ではない。元原稿との比較で中央80px帯以外の平均絶対差は4.11/255、30階調超の差がある画素は0.78%。所有者承認済み。
- 差し替え後の `zsh tests/run-all.zsh`：公開用画像を含む透過55枚と `index.html` の構文チェックはPASS。ChromiumとWebKitはこの実行環境で起動時SIGABRTとなり、ブラウザ検査は未完了。所有者のMacで再実行が必要。

### この候補に実際に使った画像編集プロンプト全文

```text
Use case: precise-object-edit
Asset type: Action Match “get” two-panel BOY illustration, unpublished no-divider candidate.
Primary request: EDIT Image 1 with the smallest possible change: REMOVE ONLY the vertical cyan/light-blue divider line in the exact center (around x=836 of the 1672 px-wide image) and replace ONLY those line pixels with uniform pure chroma green (#00FF00), matching the surrounding empty background. Preserve the center gap for the app-rendered red double arrows. Do not regenerate, redraw, reposition, crop, recolor, or resize any other region. The bookshelf, all the books, boy's hands and feet, and both poses must remain the same as Image 1. Output the edited result on a plain solid pure-green backdrop, NOT a transparent or checkerboard background.
Input images: Image 1 is the EDIT TARGET, the approved original green-background action-get-boy-v3 artwork with its cyan center divider. Image 2 is its approved published WebP, showing the exact final art after cutout. Images 3 and 4 are the authoritative BOY identity references; do not borrow room elements from them.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot.

[SCENE]
Who: The same approved boy appears once in each equal-width panel, unchanged from Image 1.
Action: LEFT: the boy reaches with one hand and takes the closed red star book from the middle shelf of the child-height wooden bookshelf. RIGHT: the same boy stands holding that exact red closed book securely against his chest with both hands; the bookshelf beside him no longer has that red book. Preserve both poses and all book positions exactly as Image 1.
Expression: Preserve his exact cheerful facial expression in each panel.
Objects: Preserve the exact wooden bookshelf, all its books, and the red book with yellow star. Add nothing.
Composition: Preserve the exact two equal-width halves and EVERY existing object position and scale from Image 1. The only edit is removing the cyan center divider, leaving pure green in its place. Keep the existing gap at the exact 50% boundary clear of faces, hands, and objects. The app overlays two red arrows with white outlines, together about 38x22 CSS px, centered on this boundary. Do not shift the boy, book, bookshelf, or frame crop. Keep all important actions and objects in the upper 80% while retaining the existing visible feet.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Invariants repeated: IMAGE 1 IS AN EDIT TARGET. Change only the cyan center divider pixels into surrounding pure green. Preserve every other visible pixel as closely as possible. No new art, no moved or enlarged objects, no altered character.
```

## 2026-09-23 — `action-get-girl-v3-candidate`（承認済み・公開用へ反映）

- 用途：Action Match の `get`（女の子）。所有者の承認後、公開用 `action-get-girl-v3.png.webp` と `index.html` の参照を切り替えた。旧v2の元PNGとWebPは `source-images/legacy/` に保管。カードの `data-panels="2"` を確認済み。
- 生成：組み込み imagegen。添付画像は Image 1：`docs/characters/word-target-girl-v2.png.webp`（全身の人物基準）、Image 2：`docs/characters/breakfast-stage-v7.jpg.webp`（顔・髪）、Image 3：`action-get-boy-v4.png.webp`（同じ赤い星の本・棚・動作の構図）、Image 4：`action-put-girl-v4.png.webp`（女の子Action Matchの画風）、Image 5：`living-item-book-v1.png.webp`（既存の本の参考）。取る物は男の子版と同じ赤い星の本を採用。
- 緑背景原稿：`source-images/generation-inputs/action-get-girl-v3-green.png`、1672×941px、1,587,197 bytes。透過：`scripts/chroma-key-green.py` → `private-prototypes/action-get-girl-v3-cutout.png`。WebP quality 84、800×450pxの候補：`private-prototypes/action-get-girl-v3-candidate.png.webp`、64,154 bytes（原稿比約96.0%削減、旧公開v2 78,642 bytes比約18.4%削減）。
- 確認：`tests/check-image-alpha.mjs` PASS（四隅0/0/0/0）。`private-prototypes/action-get-girl-v3-edge-check.png` で淡色・濃色背景とも目立つ緑のふちなし。基準・旧版・候補の並列比較：`private-prototypes/action-get-girl-v3-comparison.png`。カード寸法と二重矢印を模した `private-prototypes/action-get-girl-v3-card-preview.png` は**オフライン合成**で、ブラウザのスクリーンショットではない。
- 所見：棚は両コマで同じ位置と大きさ、その他の本の配置も維持され、赤い星の本だけが棚から女の子の手元へ移る。女の子は棚のそばに留まる。中央の矢印用の余白があり、線は描かれていない。所有者承認済み。
- 差し替え後の `zsh tests/run-all.zsh`：公開用画像を含む透過55枚と `index.html` の構文チェックはPASS。ChromiumとWebKitはこの実行環境で起動時SIGABRTとなり、ブラウザ検査は未完了。所有者のMacで再実行が必要。

### 実際に使ったプロンプト全文

```text
Use case: illustration-story
Asset type: Action Match “get” two-panel GIRL illustration candidate, not a finished UI screen.
Input images: Image 1 (word-target-girl-v2.png.webp) is the authoritative GIRL full-body identity, hairstyle, blue scrunchie, face, pink star pajamas and bare feet reference. Image 2 (breakfast-stage-v7.jpg.webp) is the authoritative GIRL identity reference in a room. Image 3 (action-get-boy-v4.png.webp) is the approved Action Match “get” sequence reference: use the SAME wooden bookshelf layout and red closed picture book with yellow star, but replace the BOY with the GIRL; do not reproduce the boy. Image 4 (action-put-girl-v4.png.webp) is the approved GIRL Action Match style, scale, equal-width two-panel construction and pure-green background reference. Image 5 (living-item-book-v1.png.webp) is an existing red star book asset for color and object consistency, but the book in the scene must remain CLOSED and match Image 3's simple star cover.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.

[SCENE]
Who: GIRL, the same approved girl with dark-brown high bun, clearly blue scrunchie, pink star pajamas and bare feet, shown once in each panel.
Action: A simple two-panel sequence for “get the book.” LEFT PANEL: standing immediately beside the bookshelf, she reaches to take the single closed red book with a yellow star from its upper shelf. RIGHT PANEL: still standing immediately beside that same bookshelf (not walking away), she holds that exact red book securely against her chest with both hands. The red book is now absent from its shelf; that is the only change in the bookshelf contents. Every other blue, green, yellow, orange and purple book remains in exactly the SAME shelf slot, arrangement, size and color across both panels.
Expression: Warm happy smile, engaged eyes, the same face, bun and scrunchie in both panels.
Objects: One child-height light wooden bookshelf in EACH panel and the same single closed red picture book with a yellow star. No bear, no extra toys, no other props.
Composition: Wide 16:9 canvas divided into TWO EQUAL-WIDTH halves without any drawn border. In each half, keep the girl on its left side and the bookshelf on its right side, matching Image 3's relative positions, sizes, camera and furniture perspective. The bookshelf stays at the SAME coordinates and scale within BOTH halves. The girl stays beside the bookshelf in both halves; only her reaching/holding arm pose and the location of the red book change. Keep every head, hand, book, shelf and bare foot fully inside its own panel. Leave an EMPTY pure-green gutter at the exact central 50% boundary, with no face, hands, book or shelf in the boundary area. The app overlays red double arrows with white outlines, about 38x22 CSS px overall, centered at this boundary and vertically centered on the card. Important actions and objects must be in the upper 80% of the art, while her feet remain inside the frame.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

No drawn panel divider or arrows. Do not move the girl away from the shelf. Do not change the shelf's position, shape, scale, other books or lighting between panels. Do not duplicate the red star book within a panel. Do not crop hair, feet, book or shelf.
```

## 2026-09-23 — `action-bring-girl-v3`（初稿を承認・公開用へ反映）

- 用途：Action Match の `bring`（女の子とパパ）。所有者が初稿をそのまま承認。公開用 `action-bring-girl-v3.png.webp` と `index.html` の参照を切り替え、旧v2のPNGとWebPを `source-images/legacy/` に保管した。カードの `data-panels="2"` を確認済み。
- 添付した基準画像：Image 1 `docs/characters/word-target-girl-v2.png.webp`、Image 2 `docs/characters/breakfast-stage-v7.jpg.webp`、Image 3 `docs/characters/bedroom-stage-v2.png.webp`、Image 4 `docs/characters/word-target-dad-v1.png.webp`、Image 5 `action-bring-boy-v3.png.webp`。画像生成ツールの添付上限が5枚のため本アイテム画像は添付せず、男の子版に描かれた赤い星の本を参照した。
- 承認された**初稿**の緑背景PNG：`source-images/generation-inputs/action-bring-girl-v3-green.png`、1672×941px、1,493,491 bytes。透過：`scripts/chroma-key-green.py` → `private-prototypes/action-bring-girl-v3-cutout.png`。WebP quality 84、800×450pxの公開用：52,470 bytes（緑背景PNG比約96.5%削減、旧v2 91,818 bytes比約42.9%削減）。四隅アルファ0/0/0/0、透過検査PASS。
- 構図の初稿では左右の棚位置に若干の差があるが、所有者は意味が十分伝わるとして初稿を採用した。位置調整を試した未採用の生成物は公開用にも原稿にも使用していない。公開用WebPと初稿由来の候補WebPのSHA-256は一致する。
- 初稿の人物は基準に沿い、女の子は高いお団子・青いシュシュ・ピンクの星柄パジャマ、パパは黒に近い短髪・ひげなし・水色の襟付きパジャマ。左で本を取り、右でパパの所へ運ぶ。
- 差し替え後の `zsh tests/run-all.zsh`：公開55枚の透過検査と `index.html` の構文チェックはPASS。ChromiumとWebKitはいずれもこの実行環境で起動時SIGABRTとなり、ブラウザ検査は未完了。所有者のMacで再実行が必要。

### 採用した初稿の実際のプロンプト全文

```text
Use case: illustration-story
Asset type: Action Match “bring” two-panel GIRL and DAD illustration candidate, not a finished UI screen.
Input images: Image 1 (word-target-girl-v2.png.webp) is the authoritative GIRL full-body identity: high dark-brown bun, BLUE scrunchie, pink star pajamas, bare feet. Image 2 (breakfast-stage-v7.jpg.webp) supports the GIRL facial identity. Image 3 (bedroom-stage-v2.png.webp) is an authoritative DAD identity and pale-blue pajama reference: short near-black side-parted hair, clean-shaven, no beard. Image 4 (word-target-dad-v1.png.webp) is the authoritative close DAD reference: same near-black side-parted hair, clean-shaven face and light-blue COLLARED pajamas; use him, not a generic father. Image 5 (action-bring-boy-v3.png.webp) is the approved TWO-PANEL “bring” story and vivid Action Match style reference: a child fetches a book from a DISTANT shelf and takes it across the scene to the seated parent. Replace the boy and mom with the canonical GIRL and DAD, while maintaining the semantic journey. The closed red star book in Image 5 is also the object reference. Do not copy irrelevant objects or outfits from reference images.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.
DAD: man around his 30s, calm face, light skin, short near-black dark-brown hair parted to the side, clean-shaven. Current standard outfit for both day and night: light-blue collared pajamas.

[SCENE]
Who: The same canonical GIRL and DAD appear once in each panel. GIRL wears pink collared pajamas with white stars, is barefoot and has dark-brown high bun tied with a bright blue scrunchie. DAD has short near-black side-parted hair, NO beard or stubble, and wears LIGHT-BLUE COLLARED pajamas throughout.
Action: A clear two-frame LEFT-TO-RIGHT sequence for “bring the book to Dad,” NOT just “give.” LEFT PANEL: on the far left, the closed red star book is on a small wooden bookshelf, far from Dad. The girl stands next to that bookshelf reaching to take the book. Dad sits far away on the right in a small cream armchair, watching her and waiting. RIGHT PANEL: Dad remains sitting in the SAME chair at exactly the SAME location, posture, scale and facing direction. The bookshelf is in the SAME far-left position and is now missing only the red book. The girl has CROSSED THE ROOM and is now next to Dad on the right, holding out that same book to Dad; Dad is receiving it. The large horizontal displacement of the girl and the book from left to right must make “bring from over there to Dad here” unmistakable.
Expression: Girl cheerful and purposeful, Dad warmly attentive and smiling, same facial identities across both panels.
Objects: One small wooden bookshelf at far left of each panel, one cream armchair with Dad seated at far right of each panel, one CLOSED red picture book with yellow star that moves from shelf to girl's hands. Keep the shelf, its remaining books, chair and Dad at exactly the same within-panel positions and scale in both panels. No other props.
Composition: Wide 16:9 canvas with exactly TWO EQUAL-WIDTH panels arranged left to right. In each panel the bookshelf occupies the far LEFT and Dad in his cream chair the far RIGHT. Both must fit inside each panel; keep furniture and Dad identical and stationary in local panel coordinates. In the left panel, place the girl right by the distant shelf; in the right panel, place her beside Dad without moving his chair. Do not put the girl directly beside Dad in the left panel. Leave a clean empty pure-green gutter on both sides of the central 50% boundary; do not put a face, hand, book or important furniture across this boundary. The app overlays red double arrows with white outlines at that boundary, approximately 38x22 CSS px overall, vertically centered on the card. Keep all important action in the upper 80% and all hair, hands, book, feet, shelf and chair fully inside their own panel. No drawn divider, no arrow in the image.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Critical negatives: NO bearded Dad, NO brown-haired Dad in a green sweater, NO jeans, NO pink hair tie, NO ponytail, NO line between panels, NO third panel. Dad and chair must not move or change outfits between panels; bookshelf must not move. The journey is from the shelf to Dad, not an immediate handoff in both panels.
```

## 2026-09-24 — `action-throw-girl-v4`（所有者承認・公開用へ反映）

- 用途：Action Match の `throw away`（女の子）。所有者承認後、2コマ候補を公開用 `action-throw-girl-v4.png.webp` へ複写し、`index.html` を切り替え、`data-panels="2"` にした。旧3コマv2のPNGとWebPは `source-images/legacy/` に保管した。公開用と承認候補のSHA-256は一致する。
- 添付基準画像：`docs/characters/word-target-girl-v2.png.webp`、`docs/characters/breakfast-stage-v7.jpg.webp`、`action-throw-boy-v3.png.webp`、`action-put-girl-v4.png.webp`、`living-item-tissue-v3.png.webp`。
- 初稿 `source-images/generation-inputs/action-throw-girl-v3-green.png` から、両コマのゴミ箱の左右位置を揃えるため2回の部分編集を行い、`source-images/generation-inputs/action-throw-girl-v4-green.png`（1,625,984 bytes）を採用。女の子や主な構図は維持。2コマ目で女の子の手はゴミ箱の蓋に近い。所有者承認済み。
- 透過処理：`scripts/chroma-key-green.py --green-cutoff 180`。生成背景が従来よりやや彩度が低く、標準しきい値205では透明域に薄い点が残ったため、オプションでしきい値を下げた。既定値205は変更していない。WebP quality 84、800×450pxの候補：`private-prototypes/action-throw-girl-v4-candidate.png.webp`、55,158 bytes（緑背景原稿比約96.6%削減、旧公開v2 98,586 bytes比約44.1%削減）。
- 透過検査：公開55枚と候補1枚すべてPASS。候補の四隅アルファ0/0/0/0。`private-prototypes/action-throw-girl-v4-edge-check.png` で淡色・濃色背景を目視し、カード寸法で目立つ緑のふちはなし。比較：`private-prototypes/action-throw-girl-v4-comparison.png`。カード表示の**オフライン合成**：`private-prototypes/action-throw-girl-v4-card-preview.png`。実ブラウザのスクリーンショットではない。
- 公開用差し替え後の検査：公開WebP60枚中、透過対象55枚PASS（背景5枚は対象外）。`index.html` 構文チェックPASS。Action Matchの8カードすべて `data-panels="2"`、画像が存在し800×450px、公開WebP60枚はすべて `index.html` に参照されている。`zsh tests/run-all.zsh` はChromium・WebKitともこの実行環境でブラウザ起動時SIGABRTとなり、ブラウザ試験は未完了。所有者のMacで再実行が必要。

### 実際に使った初稿プロンプト全文

```text
Use case: illustration-story
Asset type: Action Match “throw away” two-panel GIRL illustration candidate, not a finished UI screen.
Input images: Image 1 (word-target-girl-v2.png.webp) is the authoritative GIRL full-body identity: high dark-brown bun, BLUE scrunchie, pink star pajamas, bare feet. Image 2 (breakfast-stage-v7.jpg.webp) supports the GIRL face and hairstyle. Image 3 (action-throw-boy-v3.png.webp) is the approved TWO-PANEL throw-away sequence, metal lidded trash bin, white crumpled tissue, composition and vivid art-style reference; replace the BOY with the canonical GIRL, do NOT copy his clothing or hairstyle. Image 4 (action-put-girl-v4.png.webp) is the approved GIRL Action Match art style, proportions, pure-green background, equal-width two-panel spacing and bare feet reference. Image 5 (living-item-tissue-v3.png.webp) shows the existing white crumpled tissue as object reference; do NOT draw its tissue box.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.

[SCENE]
Who: The same canonical GIRL appears exactly once in each of two panels, with high dark-brown bun tied by a visible BLUE scrunchie, pink collared pajamas with WHITE stars, and bare feet.
Action: A simple two-frame LEFT-TO-RIGHT sequence for “throw the tissue away.” LEFT PANEL: the girl stands on the left side, holding ONE small clearly visible crumpled white tissue in her hand; a silver metal trash bin with open dark lid stands to her right and is EMPTY. RIGHT PANEL: she has dropped that same tissue into that same open trash bin; the white tissue is now clearly visible INSIDE the bin and is NO LONGER in her hand. Her hand is lowered after the action and she looks pleased. The girl has NOT moved away from the bin.
Expression: Happy and focused, large expressive eyes, same girl identity in both panels.
Objects: One crumpled white tissue and one simple silver cylindrical pedal trash bin with hinged dark-grey OPEN lid per panel, identical to the approved boy image. The bin's shape, lid angle, size, perspective and exact local panel position are the SAME in both panels. The tissue alone changes position. No extra objects, no tissue box.
Composition: Wide 16:9 TWO EQUAL-WIDTH panels with no drawn divider. Each panel has the girl on its left and the bin on its right. Put the bin at the EXACT SAME x/y coordinates, scale and orientation WITHIN EACH PANEL. The girl's hair, hands, bare feet, tissue and bin fully fit in their own halves. Keep all essential action in the upper 80% of the frame; retain visible bare feet. Leave EMPTY pure-green gutter at the exact 50% panel boundary, clear of face, hands, tissue, bin and lid. The app overlays red double arrows with white outlines about 38x22 CSS px overall at that boundary, vertically centered. No other overlays on the image.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Critical: EXACTLY TWO panels, not three. No divider lines or arrows inside the art. No ponytail, pink scrunchie, shoes or socks. No floating tissue outside the bin in the second panel. No closed lid hiding the tissue. Keep the trash bin stationary in both panels.
```

## 2026-09-25 — `action-put-girl-v5-candidate`（2026-09-26承認・公開へ反映）

- 用途：Action Match の女の子版 `put` を、コップ→机へ変更した。2026-09-26に所有者がv5を承認。候補を公開用 `action-put-girl-v5.png.webp` へ複写して `index.html` を切り替え、旧v4 WebPは `source-images/legacy/` に移した。`data-panels="2"` を確認済み。
- 添付基準画像：`docs/characters/word-target-girl-v2.png.webp`（全身）、`docs/characters/breakfast-stage-v7.jpg.webp`（顔・髪）、`action-put-girl-v4.png.webp`（現行のタッチ・構図）、`living-item-cup-v1.png.webp`（コップ）、`word-target-table-v1.png.webp`（机）。後者2点は参考のみで、画像内に貼り付けていない。
- 組み込み imagegenで初稿生成後、中央の矢印用余白を広げる編集、カード内での人物の大きさを現行に近づける編集を順に実施。最終緑背景原稿は `source-images/generation-inputs/action-put-girl-v5-green.png`（1774×887、1,480,918 bytes）。`scripts/chroma-key-green.py` で透過。当初は `cwebp -q 84 -resize 800 400` で800×400px・48,872 bytesの候補を作成したが、他のAction Match画像と異なる比率だった。
- **2026-09-25のサイズ修正：** 絵を再生成せず、同じ透過原稿を800×400pxへ等比縮小して、上下各25pxの透明余白を追加した。`cwebp -q 84` で `private-prototypes/action-put-girl-v5-candidate.png.webp` を **800×450px（16:9）、61,094 bytes** に更新。旧800×400px版は `private-prototypes/action-put-girl-v5-candidate-800x400.png.webp` に保管。絵の縦横比は変わらず歪みなし。固定サイズのカードでは透明余白の分だけ絵が少し小さく表示される。現行公開v4は58,406 bytes。
- 透過テスト：公開用55枚と**修正後候補**1枚すべてPASS。候補の四隅アルファ0/0/0/0。`private-prototypes/action-put-girl-v5-edge-check.png` で淡色・濃色上の輪郭を確認し、目立つ緑の縁はなし。人物・現行版との比較は `private-prototypes/action-put-girl-v5-comparison.png`、修正後のカード表示の**オフライン合成**は `private-prototypes/action-put-girl-v5-card-preview.png`。ブラウザのスクリーンショットではない。

### 初稿に使ったプロンプト全文

```text
Use case: illustration-story
Asset type: one Action Match game-card illustration, a SINGLE horizontal image containing two equal-width sequential panels.

Input image roles: Image 1 docs/characters/word-target-girl-v2.png.webp is the authoritative full-body GIRL reference. Image 2 docs/characters/breakfast-stage-v7.jpg.webp is her authoritative face, dark-brown high bun and blue scrunchie reference. Image 3 action-put-girl-v4.png.webp is the approved current Action Match rendering, two-panel spacing, girl proportions and action staging reference. Image 4 living-item-cup-v1.png.webp is a pink two-handled cup with white hearts, object appearance reference only: redraw it, do not paste it. Image 5 word-target-table-v1.png.webp is a warm wooden table reference only: redraw it, do not paste it.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.

[SCENE]
Who: The GIRL alone in her approved default pink star pajamas, barefoot.
Action: Left panel: the GIRL is holding the pink cup in her hand beside a wooden table; the tabletop is empty. Right panel: the same GIRL has just placed the very same cup on top of the same wooden table; her hand has released it. The table remains in precisely the same relative location, shape, scale, and viewpoint within each panel. The before/after gesture must clearly communicate PUT, not get or carry.
Expression: Cheerful, concentrated and clearly readable; the same girl's face and hair in both panels.
Objects: Exactly one pink two-handled cup with small white hearts, referenced from Image 4, and one warm wooden table, referenced from Image 5. Redraw these in the approved Action Match illustration style. No extra cups, no other props.
Composition: Two side-by-side equal-width panels, reading left to right. The GIRL stands on the left side and the table sits on the right side WITHIN EACH panel, consistent scale and position. Keep the full girl and table inside their own half. The app overlays a red double-arrow group about 40x22 CSS px at the vertical and horizontal center of the finished card, on the exact 50% boundary. Leave a completely clear vertical gutter around that boundary (approximately x=45%-55% of the full image), with no face, hand, cup, table, or other important object there. Keep all important action and objects within the upper 80% of the image.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Critical output: One continuous wide image containing exactly TWO panels, no drawn panel border, separator, arrows, letters, watermark, shadows or checkerboard in the green backdrop.
```

### 中央余白の調整に使ったプロンプト全文

```text
Use case: precise-object-edit
Input image 1 is the edit target, an approved-style two-panel Action Match illustration. Keep the same girl in both panels, her exact face, high bun, blue scrunchie, pink star pajamas and bare feet; keep the same pink heart cup, same wood table, same actions, exact bright cel-shaded picture-book style, pure #00FF00 backdrop, and equal-width two-panel left-to-right sequence. ONLY improve central spacing: move and modestly reduce the characters and tables WITHIN their respective panels so that the central 15% of the full image (about x=42.5%-57.5% width) is COMPLETELY SOLID GREEN at ALL heights, especially the vertical middle where the app places its double arrow. In each panel, girl remains left, table remains right; table must appear in the identical relative position in both panels, same size and view. The cup is held in left panel and set on table in right panel. Full bodies and table visible. No cut-off. Keep actions and cup in upper 80%. Do not add or change any object or character. No divider, no arrow, no letters, no extra people or props, no green halos, no checkerboard.
```

### 人物・机の大きさの調整に使ったプロンプト全文

```text
Use case: precise-object-edit
Image 1 is the edit target. Preserve the exact two-panel put-the-cup-on-the-table story, girl's canonical face/high dark-brown bun/BLUE scrunchie/pink-white-star pajamas/bare feet, one pink heart cup, one matching wooden table per panel, and vivid children's picture-book cel shading. Preserve the PURE SOLID GREEN #00FF00 background, equal panel widths, and the completely empty central vertical gutter x=42.5%-57.5%; keep all objects away from that gutter. Improve only the scale and vertical placement: enlarge the girl and table in EACH panel about 20% so they use the card height comparably to Image 2, with top of hair near 5% image height and lower table legs/feet near 83% image height; do not crop the full girl or table. Keep the cup and her hand entirely within upper 75% image height. Girl left and table right within each half, table identical shape/position/scale in both halves. No divider, no arrow, no letters, no extra people or props, no green halos, no checkerboard. Image 2 is a size and card-fill reference only; do not copy its red block or blue table.
```

### ゴミ箱の位置調整に使った画像編集プロンプト全文

```text
Precisely edit this existing two-panel children's illustration on pure green (#00FF00) background. Keep the entire image pixel-identical as much as possible. The ONLY change: in the RIGHT panel, move the gray open metal trash bin about 30 pixels LEFT (at the input's 1672 px width), so its position relative to the right panel's left edge exactly matches the bin's position relative to the left panel's left edge. Move the entire right bin including lid and pedal without changing its shape, size, orientation, contents, lighting, or gray color. Keep the tissue inside it. Restore the vacated area to flat pure green #00FF00. Do not move the girl, her arm, feet, hair, pajamas or any other object. Preserve both equal-width panels and the empty center gutter. Do not add divider or arrow. Keep background pure solid green, not transparent or checkerboard.

Make one precise change to Image 1, keep all else exactly unchanged. Canvas 1672x941, two 836px wide panels. The silver trash bin in LEFT panel begins at x≈474 and ends x≈712. The same silver trash bin in RIGHT panel currently begins at global x≈1340 (local x≈504). Move the ENTIRE RIGHT trash bin including its lid, pedal, and tissue 30 px LEFT, so it begins at global x≈1310 (local x≈474), matching the LEFT bin exactly in within-panel position. Fill its vacated old region with pure flat #00FF00. Do not change either girl, the left bin, or any other visible pixel. Preserve pure green background; no transparency or checkerboard. No divider or arrow.
```


## 2026-09-26 — `action-get-girl-v4-candidate`（所有者承認・公開へ反映）

- 用途：Action Match の女の子版 `get` を「棚からタオルを取る」に変更した。所有者承認後、候補を公開用 `action-get-girl-v4.png.webp` に複写して `index.html` を切り替え、旧v3 WebPは `source-images/legacy/` に移した。公開用と候補のSHA-256は一致し、`data-panels="2"` を確認済み。
- 添付基準画像：`docs/characters/word-target-girl-v2.png.webp`、`docs/characters/breakfast-stage-v7.jpg.webp`。その他の参考画像：`action-get-girl-v3.png.webp`、`bathroom-item-towel-v4.png.webp`、`word-target-bookshelf-v1.png.webp`。本棚は形の参考だけとし、本は描いていない。既存素材は貼り付けていない。
- 初稿は青いタオルになったため、画像生成ツールで**タオルの色だけ**既存素材のピンクに修正した。青い原稿は `source-images/generation-inputs/action-get-girl-v4-green.png` に残るが、候補ではない。最終緑背景原稿：`source-images/generation-inputs/action-get-girl-v4-green-final.png`（1672×941px、1,699,564 bytes）。洗面所の公開素材 `bathroom-item-towel-v4.png.webp` もピンクで、最終候補と同色。タオルを水色とした前回の報告・初稿表示が紛らわしかったため、ファイルを直接再確認した。
- 2026-09-26の縁取り修正：`scripts/chroma-key-green.py --green-cutoff 175 --edge-shrink 2` で緑背景を透過し、髪の領域に限って残留した緑色480画素を `private-prototypes/despill-get-girl-hair.py` で透明化した。通常の透過処理の既定値は変えていない。WebP quality 84、最終候補 `private-prototypes/action-get-girl-v4-candidate.png.webp` は800×450px、64,222 bytes（緑背景原稿比約96.2%削減）。旧公開v3は64,154 bytes。修正前候補は `private-prototypes/action-get-girl-v4-before-defringe.png.webp`（68,846 bytes）に保管。
- 透過検査：公開55枚と修正後候補1枚すべてPASS、候補の四隅アルファ0/0/0/0。明色・濃色の背景に重ねた拡大図 `private-prototypes/action-get-girl-v4-edge-check.png` と髪の4倍拡大比較 `private-prototypes/action-get-girl-v4-hair-closeup.png` を目視し、黄緑の縁は修正後に見えなくなった。細い毛束の一部は縮んでいるため、所有者に確認を求める。
- 人物基準と公開旧版との比較：`private-prototypes/action-get-girl-v4-comparison.png`。カード表示の**オフライン合成**：`private-prototypes/action-get-girl-v4-card-preview.png`。実ブラウザのスクリーンショットではない。

### 初稿に使ったプロンプト全文

```text
Use case: illustration-story
Asset type: one Action Match "get" game-card illustration candidate, a SINGLE horizontal image containing exactly two equal-width sequential panels.
Input image roles: Image 1 docs/characters/word-target-girl-v2.png.webp is the authoritative full-body GIRL reference. Image 2 docs/characters/breakfast-stage-v7.jpg.webp is her authoritative face, dark-brown high bun and BLUE scrunchie reference. Image 3 action-get-girl-v3.png.webp is the current approved Action Match girl, rendering style, girl proportions, two-panel pacing, and near-shelf action reference (replace the book with a towel, do not retain books). Image 4 bathroom-item-towel-v4.png.webp is the existing towel shape/color reference only, redraw rather than paste it. Image 5 word-target-bookshelf-v1.png.webp is a shelf shape reference only: make it a simple warm wooden towel shelf, NOT a bookcase; no books.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.

[SCENE]
Who: The same GIRL alone, one full-body appearance in each panel, wearing approved pink pajamas with white stars, high dark-brown bun with clearly BLUE scrunchie, barefoot.
Action: LEFT PANEL: the GIRL stands RIGHT BESIDE a small wooden shelf and reaches one hand toward ONE neatly folded light-blue towel resting on the shelf; the towel is still on the shelf, not yet in her hand. RIGHT PANEL: the same GIRL is STILL RIGHT BESIDE THE SAME SHELF and now holds that same light-blue towel in her hands; its previous spot on the shelf is empty. This is GET: reaching for and taking the towel, not walking away, giving, or putting.
Expression: Cheerful, focused, same face and hairstyle across panels.
Objects: One simple warm wooden towel shelf, identical in position, size, shape, orientation and all remaining contents in both panels. The single light-blue towel is the ONLY object that moves, from its shelf spot to the girl's hands. Keep all other shelf compartments unchanged and simple; no books, extra towels, extra characters, text or room background.
Composition: Exactly TWO EQUAL-WIDTH panels side by side, read left to right. In EACH half, the shelf stays at the LEFT in the same local coordinates and GIRL stays at the RIGHT immediately beside it, same scale. Do not move the girl away from the shelf. All hair, hands, feet, shelf and towel must fit inside their own panels and essential action must be in the upper 80% of the image. The app overlays a white-outlined red double-arrow group about 40x22 CSS px at card center on the 50% panel boundary, vertically centered; leave a completely empty PURE-GREEN vertical gutter x=45%-55% of full canvas, clear of faces, hands, towel and shelf. Equal panel widths, no drawn divider or arrow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Critical: Same shelf and its fixed contents across both panels. Towel alone changes position. Girl remains at shelf. No books. No split line, no arrow, no inset card/UI, no paper-white background, no checkerboard. Green #00FF00 solid backdrop for later chroma-key.
```

### タオル色の修正に使ったプロンプト全文

```text
Use case: precise-object-edit. Image 1 is the edit target: an existing two-panel Action Match children's illustration on flat pure #00FF00 green. Image 2 is the existing pink folded towel color/shape reference. Change ONLY the SINGLE towel in BOTH panels from blue to the SAME soft pink as Image 2, preserving its exact shape, folds, texture, position and size in each panel. In left panel it remains on the shelf; in right panel it remains in the girl's hands. Keep every other pixel and object as close to the input as possible: both identical wooden shelves, plants, baskets, girl identity, high bun, BLUE scrunchie, pink star pajamas, bare feet, expressions, poses, pure-green background, blank central gutter, panel widths. Do not recolor the blue scrunchie. Do not add divider, arrow, words, extra towel, extra objects, or checkerboard. Keep exactly two equal-width panels and 16:9 landscape composition.
```


## 2026-09-26 — `action-bring-girl-v4`（承認・公開用へ反映）

- 用途：Action Match の女の子版 `bring` を「青い雲柄のブランケットを離れた棚からパパへ持っていく」に変更。所有者が棚の左右のずれを許容して v4 候補を承認。公開用 `action-bring-girl-v4.png.webp` へ複写し、`index.html` を切り替えた。旧 v3 は `source-images/legacy/action-bring-girl-v3.png.webp` に移動。`data-panels="2"` を維持。承認候補と公開用の SHA-256 一致を確認した。
- 使用した組み込み画像生成ツールへの添付：`action-bring-girl-v3.png.webp`（編集対象・構図基準）、`docs/characters/word-target-girl-v2.png.webp`（女の子）、`docs/characters/word-target-dad-v1.png.webp` および `docs/characters/bedroom-stage-v2.png.webp`（パパ）、`living-item-blanket-v1.png.webp`（青い雲柄）。5枚上限のため朝ごはん背景は添付せず、女の子の全身基準を優先した。
- 初稿では右の棚に余計な本があり、家具の位置にもずれがあったため、同じ画像生成ツールで右コマの棚上段を空にし、棚・パパの位置を調整した。両コマで家具の大きさ・構成はほぼ揃ったが、棚の左右位置にはわずかな差が残る。候補であることを区別し、所有者の目視確認を求める。
- 最終緑背景原稿：`source-images/generation-inputs/action-bring-girl-v4-green.png`（1672×941px、1,495,423 bytes）。`scripts/chroma-key-green.py --green-cutoff 175 --edge-shrink 1` で透過、WebP quality 84で `private-prototypes/action-bring-girl-v4-candidate.png.webp`（800×450px、51,664 bytes、原稿比約96.5%削減）。旧公開v3は52,470 bytes。
- 透過チェック：公開55枚と候補1枚PASS。候補の四隅アルファ0/0/0/0。淡色・濃色に重ねた拡大図 `private-prototypes/action-bring-girl-v4-edge-check.png` とさらに拡大した `private-prototypes/action-bring-girl-v4-edge-closeup.png` を目視し、目立つ緑の縁は見えなかった。比較：`private-prototypes/action-bring-girl-v4-comparison.png`。カード寸法の**オフライン合成**：`private-prototypes/action-bring-girl-v4-card-preview.png`。実ブラウザのスクリーンショットではない。

### 初稿に使ったプロンプト全文

```text
Use case: precise-object-edit
Asset type: Action Match "bring the blanket to Dad" two-panel GIRL illustration candidate, not a UI screen.
Input image roles: Image 1 action-bring-girl-v3.png.webp is the EDIT TARGET and approved two-panel composition/style to preserve. Image 2 docs/characters/word-target-girl-v2.png.webp is authoritative full-body GIRL identity, face, high bun, blue scrunchie. Image 3 docs/characters/word-target-dad-v1.png.webp is authoritative seated DAD face, near-black side-parted hair, clean shaven and light-blue collared pajamas; Image 4 docs/characters/bedroom-stage-v2.png.webp supports DAD's established identity and pajamas. Image 5 living-item-blanket-v1.png.webp is the folded LIGHT-BLUE BLANKET with WHITE CLOUDS; redraw this exact color and cloud pattern, do not paste the source.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.
DAD: man around his 30s, calm face, light skin, short near-black dark-brown hair parted to the side, clean-shaven. Current standard outfit for both day and night: light-blue collared pajamas.

[SCENE]
Who: One canonical GIRL and one canonical DAD in EACH of two panels. Girl wears her pink white-star pajamas, BLUE scrunchie, barefoot. Dad wears light-blue collared pajamas, has short near-black SIDE-PARTED hair and NO beard or stubble; he sits in the same cream armchair.
Action: Keep the edit target's established journey from distant shelf to Dad, but replace its red book with ONLY ONE folded light-blue cloud-patterned blanket from Image 5. LEFT PANEL: the folded cloud blanket rests on a shelf at the FAR LEFT, the girl stands beside the shelf REACHING FOR IT, and Dad sits at the FAR RIGHT in his armchair watching from a clear distance. RIGHT PANEL: the same girl has traveled to Dad and now holds out that same folded cloud blanket to him; Dad accepts it while seated. The blanket is no longer on the shelf. This is BRING from a distant place, not merely give while already standing beside Dad.
Expression: Girl attentive and happy; Dad calmly encouraging, identical faces in both panels.
Objects: SAME bookshelf and SAME cream armchair as Image 1; same shape, exact within-panel position, size, perspective and contents in BOTH panels. Only girl's position and the single blanket's position change. No red book in her hands, no extra blankets or props.
Composition: ONE 16:9 image with exactly TWO EQUAL-WIDTH panels side by side. Preserve current Action Match scale and spatial structure. In both panels, bookshelf stays at local far LEFT and Dad in his armchair stays at local far RIGHT; do not move or resize either furniture or Dad between panels. In left, girl close to the distant shelf; in right, girl by Dad. Leave clean pure-green space around the 50% panel boundary, especially its vertical center: the app overlays a white-outlined red double-arrow group about 40x22 CSS px at card center. Keep faces, hands, and blanket away from this boundary. Important action and objects in upper 80% of image; both characters fully in their respective panel. No in-image divider, arrows, text or card UI.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Critical: Dad must be identical in both panels, seated in identical chair position. No brown-haired/bearded Dad, green sweater, jeans, shoes on girl, pink hair tie, extra person, third panel, divider, arrow, letters. Blanket must be clearly LIGHT BLUE with WHITE CLOUDS in both panels, and ONLY the blanket and girl move. Replace the image's transparent backdrop with PURE SOLID #00FF00 for the approved chroma-key workflow, not checkerboard.
```

### 継続性の修正に使ったプロンプト全文

```text
Use case: precise-object-edit. Image 1 is the EDIT TARGET, a two-panel bright children's illustration on pure #00FF00 background. Preserve the girl, Dad, their faces/identities/pajamas, the blue cloud-pattern blanket and its movement, bare feet, the exactly TWO equal-width panels, all colors, clear center gutter, pure green background, and the scene's vivid cel-shaded style.

Make ONLY these continuity corrections in the RIGHT panel:
1) REMOVE the small upright turquoise-blue BOOK from the TOP shelf. The left panel's only top-shelf object was the cloud blanket, so after she takes it, the top shelf on the right must be EMPTY. Keep the two lower shelves' books exactly as they are and matching the left panel.
2) The wooden bookshelf in right panel is about 45 pixels too far RIGHT compared with the left panel when measured within its half of this 1672-pixel canvas. Shift the entire right bookshelf approximately 45 pixels LEFT without changing its size/view; fill the vacated region with pure solid #00FF00. It should have the exact same within-panel x/y coordinates as the shelf in the left panel.
3) The seated Dad and cream armchair in right panel are about 35 pixels too far RIGHT relative to their positions in left panel. Shift Dad plus chair together approximately 35 pixels LEFT without changing their size, face, clothing, pose or how he holds the blanket. Maintain the girl's blanket handoff, adjusting only the connecting hands if needed.
Do NOT move the GIRL or blanket. Do not add any other object, person, book, divider, arrow or text. No checkerboard. Preserve flat pure #00FF00 backdrop. The only movable story elements between panels remain the girl and blue cloud blanket; Dad and furniture align.
```

## 2026-09-26 — `action-throw-girl-v5`（承認・公開用へ反映）

- 用途：Action Match の女の子版 `throw away` を、ティッシュから空のお菓子の包み紙へ変更。所有者が候補を承認したため、`action-throw-girl-v5.png.webp` へ複写して `index.html` の参照を切り替えた。旧v4は `source-images/legacy/action-throw-girl-v4.png.webp` へ移動。候補と公開画像のSHA-256は一致し、`data-panels="2"` を確認済み。
- 生成時の添付：`action-throw-girl-v4.png.webp`（編集対象と2コマ構図）、`docs/characters/word-target-girl-v2.png.webp`（女の子全身の基準）、`docs/characters/breakfast-stage-v7.jpg.webp`（女の子の顔・髪）、`action-throw-boy-v3.png.webp`（銀色のゴミ箱）、`living-item-cookie-wrapper-v3.png.webp`（青い包み紙。絵に含まれる食べられるクッキーは候補から除外）。
- 緑背景原稿：`source-images/generation-inputs/action-throw-girl-v5-green.png`（1672×940px）。`scripts/chroma-key-green.py --green-cutoff 125 --edge-shrink 2` で透過後、髪周辺だけに残った緑優勢の輪郭画素を `private-prototypes/despill-throw-girl-v5-hair.py` で除去。WebP quality 84、800×450px の候補：`private-prototypes/action-throw-girl-v5-candidate.png.webp`。顔や服を消さないよう輪郭近傍だけを処理した。
- 透過検査：公開55枚と候補1枚がPASS。候補の四隅のアルファは0/0/0/0。`private-prototypes/action-throw-girl-v5-hair-closeup.png` と `private-prototypes/action-throw-girl-v5-edge-check.png` で濃色・淡色背景上に拡大して確認。カード寸法の**オフライン合成**は `private-prototypes/action-throw-girl-v5-card-preview.png`。基準・現行・候補の比較は `private-prototypes/action-throw-girl-v5-comparison.png`。

### 使用した画像生成プロンプト全文

```text
EDIT Image 1 as the base, preserving its exact two-panel composition, equal panel widths, unchanged girl positions, same silver foot-pedal trash bin position and dimensions across both panels, same cheerful faces and pink star pajamas. Replace only the white tissue prop with an EMPTY blue candy/cookie WRAPPER matching the blue torn package with colorful circles shown in Image 5. LEFT PANEL: the girl visibly holds the EMPTY flattened blue wrapper in her raised hand; the bin is empty. RIGHT PANEL: that SAME empty wrapper is visibly inside the silver trash bin, which is unchanged in position and size; the girl has finished throwing it away. No edible cookie and no food anywhere. Use Images 2 and 3 as authoritative girl identity; Image 4 as authoritative silver bin. Keep the center boundary clear for the app's overlay red double arrow. No painted divider, arrow, text or labels. Replace transparent/checkerboard background with a flat solid pure #00FF00 green backdrop so it can be chroma-keyed later; do not draw a checkerboard.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors.

[SCENE]
Who: GIRL in her default pink star-patterned pajamas, barefoot indoors.
Action: Equal-width left panel shows GIRL holding an empty torn blue candy wrapper before discarding it, with a clearly empty silver bin at her right. Equal-width right panel shows her having discarded the same wrapper: the empty wrapper is visibly inside the silver bin, and her hand is no longer holding it.
Expression: Happy and calm in both panels.
Objects: The silver foot-pedal trash bin from Image 4, fixed in exactly the same position and size in both panels. The EMPTY blue wrapper shape and colorful dots from Image 5, but exclude its edible chocolate chip cookie entirely; use the wrapper only.
Composition: Two equal-width panels, left to right, each with the same girl and bin placement. Keep the girl’s face, hands, the wrapper, and the bin away from the vertical midpoint x=50%, where the app overlays a red double arrow about 31 CSS px across at vertical center. All important actions and objects in the upper 80% of the overall image. No divider line.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-28 — `think-say-wanting-boy-v3.png.webp`（採用、プロトタイプ用）

- 用途：Think & Say の吹き出し左半分に使う、対象物を持たない「欲しがる／ちょうだい」の汎用身ぶり。所有者がv3を承認。画像は当面 `private-prototypes/think-say-wanting-boy-v3.png.webp` に置き、本体には未組み込み。
- 添付した基準画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪型）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪型・絵のタッチ）。v1・v2の候補画像は生成時に添付していない。
- 不採用の候補：`private-prototypes/think-say-wanting-boy-v1.png.webp` は両手を大きく開いた笑顔が「じゃーん」「おいで」に見えるため不採用。`private-prototypes/think-say-wanting-boy-v2.png.webp` はつかもうとする手が「つかまえる」「待って」に見えるため不採用。どちらも公開用には採用しない。
- 生成は純緑背景（#00FF00）で新規に行い、`scripts/chroma-key-green.py` で透過。完成候補は512×512px、WebP quality 84、36,338 bytes。`tests/check-image-alpha.mjs` で四隅のアルファ0/0/0/0を確認し、髪と指の輪郭に目立つ緑の縁がないことを拡大・画素確認した。

### 採用画像に使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, daytime indoors, wearing his approved plain blue short-sleeved T-shirt with the tiny simplified usual cat-face emblem. Reference image 1 (boy-daywear-v2.png.webp) fixes his approved daytime clothing, hair, face, age and art style. Reference image 2 (word-target-boy-v1.png.webp) further fixes his face, hairstyle and illustration style; do not copy its pajamas. Create a NEW illustration from these two references, not an edit or continuation of any previous “wanting” gesture candidate.
Action: A familiar Japanese child's “ちょうだい / please give me” gesture. His torso and face point straight toward the viewer. In front of the center of his chest, bring BOTH hands TOGETHER side by side, touching at the inner edges, then extend them a little toward the viewer. BOTH PALMS FACE THE CEILING and are gently cupped together to make one small empty receiving bowl. Show both broad upward-facing palm surfaces and each individual finger clearly; fingers are slightly curved upward around the empty bowl, not flat and splayed. Make the paired hands visually large and central, readable in a 147 CSS px square display. The hands are EMPTY: he is asking to receive something, not holding, presenting, catching or clapping anything. No prayer hands, folded hands, fists, reaching to the right, open-armed hug or ta-da pose.
Expression: Tilt his head slightly to one side. Give him a small, sweet, coaxing smile and gentle pleading eyes directed toward the viewer, as if softly asking “ちょうだい.” Not a wide open-mouthed grin, surprise, triumph or excitement.
Objects: Nothing in or above the hands. No object, toy, food, furniture, text, letters, icon, speech bubble, extra character or background scene. Retain only the tiny simplified usual cat-face emblem on the approved blue T-shirt.
Composition: Square 512×512 asset; front-facing waist-up or mid-chest-up framing, with face and both cupped hands large in the center. Keep the full hair, both elbows, both palms and every fingertip inside the frame. Leave clear margins above the hair and around the sides; keep important details out of the rounded square's four corners. The hands should sit below the face rather than blocking it. The app displays this artwork at roughly 147–183 CSS px and adds no overlay on top of the illustration; the card slot is below it. Generate against a perfectly uniform pure #00FF00 solid green background, not transparency or a checkerboard, for later chroma key. Do not stretch the figure to make the final square.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-30 — `think-say-want-to-boy-v2.png.webp`（採用、プロトタイプ用）

- 用途：Think & Say の I want to に対応する「やりたい／はーい！」の汎用身ぶり。所有者がv2を承認。画像は `private-prototypes/think-say-want-to-boy-v2.png.webp` に置き、本体には未組み込み。
- 添付した基準画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪型）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪型・絵のタッチ）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の猫の印）、`private-prototypes/think-say-wanting-boy-v3.png.webp`（顔の大きさと位置の参考のみ。ポーズ・表情は写さない）。
- 不採用：`private-prototypes/think-say-want-to-boy-v1.png.webp`。腕を斜めに上げて指を広げた形が手を振る動作に見え、全身構図で顔が小さかった。
- 512×512px、WebP quality 84。純緑背景（#00FF00）から `scripts/chroma-key-green.py` で透過し、髪・指先の輪郭の緑の縁と四隅のアルファを確認。`tests/check-image-alpha.mjs` の透過チェックに合格。

### 採用画像に使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, daytime indoors, in his approved plain blue short-sleeved T-shirt with tiny simplified cat-face emblem. Reference image 1 (boy-daywear-v2.png.webp) defines approved daytime clothing, hair and face. Reference image 2 (word-target-boy-v1.png.webp) reinforces face, hair, age and art style; do NOT copy its pajamas, waving pose or spread fingers. Reference image 3 (cat-mascot-v2-small.png.webp) defines only the tiny simplified cat-face shirt emblem. Reference image 4 (think-say-wanting-boy-v3.png.webp) is a COMPOSITION REFERENCE ONLY for close-up face size, head position and centered figure scale. Do NOT copy its cupped hands, 'please give me' pose, or pleading expression.
Action: The boy volunteers with an unmistakable Japanese preschool 'はーい！ぼくがやりたい！' raised-hand gesture. He faces the viewer straight on, torso upright and stretching upward energetically. Raise ONE arm vertically STRAIGHT UP right next to his ear: upper arm and forearm form one near-vertical line, not an arm angled outward to the side. The raised hand is aligned directly above its shoulder and ear. Keep all five fingers CLOSE TOGETHER, straight and extended upward as one compact vertical shape, not splayed apart; the palm is mostly seen edge-on or slightly forward. The other arm rests naturally low, not held out. This is NOT a hello wave, goodbye wave, greeting, self-pointing, or reaching for an object.
Expression: Same boy's face as the two identity references; bright sparkling eyes, open happy eager smile, excited and ready to DO something. Face toward viewer. No pleading, surprise, or shy look.
Objects: None. No item in the hands, no prop, furniture, symbol, question mark, letter, text or speech bubble. Only the tiny approved cat-face emblem on his shirt.
Composition: A single square illustration intended to finish at 512×512px and appear at about 147×147 CSS px inside a rounded Think & Say picture frame. Crop at the waist or just below it, NOT full body: show the upper body, big face and all of the raised arm with its fingertips safely inside the image. Match the face WIDTH and head POSITION closely to reference image 4, so the two gestures look like the same-sized child side-by-side; make the face and raised hand large and readable at 147px. Use the narrow strip beside the head and the top margin for the vertical arm and fingertips, rather than lowering or shrinking the head excessively. Keep hair and fingertips clear of rounded frame corners. No app-rendered overlay covers this image; the card slot is below. Generate on solid pure #00FF00 green for later chroma-key cutout, NOT on checkerboard or transparent background.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-30 — `think-say-reading-boy-v3.png.webp`（採用、プロトタイプ用）

- 用途：Think & Say の「read the book」を示す右側の絵。吹き出しの中で、男の子が思い浮かべた「本を開いて読んでいる自分」を表す。所有者がv3を採用。画像は `private-prototypes/think-say-reading-boy-v3.png.webp` に置き、本体には未組み込み。
- 添付した基準画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪型）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪型・絵のタッチ）。不採用の読書候補v1・v2は添付していない。
- 不採用：`private-prototypes/think-say-want-to-read-boy-v1.png.webp`（閉じた本を持つだけでは「読みたい」が伝わらない）、`private-prototypes/think-say-reading-boy-v2.png.webp`（小さな表示では青い表紙の外側だけが見え、閉じた本や箱に見えた）。
- 512×512px、WebP quality 84。純緑背景（#00FF00）から `scripts/chroma-key-green.py` で透過し、輪郭の緑の縁と四隅のアルファを確認。`tests/check-image-alpha.mjs` の透過チェックに合格。

### 採用画像に使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, daytime indoors and barefoot, wearing his approved plain blue short-sleeved T-shirt with the tiny simplified usual cat-face emblem and navy knee-length shorts. Reference image 1 (boy-daywear-v2.png.webp) fixes his approved daytime clothing, hair, face, age, and art style. Reference image 2 (word-target-boy-v1.png.webp) reinforces his face, hairstyle, and illustration style, but do not copy its pajamas. Generate a NEW illustration from these two references only.
Action: He sits cross-legged on the floor, quietly READING an already WIDE-OPEN picture book held in BOTH hands just above his lap. The INNER PAGE SURFACES face UP and INWARD TOWARD THE BOY'S FACE, so HE can see and read them. The viewer sees the book from a three-quarter SIDE angle: its clear V-shaped open silhouette, central spine, layered page edges, and a foreshortened glimpse of simple pictures on the inner pages, but NOT a full flat spread facing the viewer. The boy is reading for himself, NOT showing the book to an audience and NOT reading aloud to anyone. Both hands hold the outer edges naturally.
Expression: His head tilts down toward the open pages; his pupils visibly focus on the pages. He has an absorbed, delighted small smile and sparkling eyes, as if engrossed in the story. His face remains visible to the viewer in three-quarter view.
Objects: Exactly ONE open picture book. The inside pictures are simple shapes with no text or letters. No other person, toy, furniture, prop, detailed floor, or background scene.
Composition: Square image to finish at 512×512 pixels. Angle the boy's torso and head about 35 degrees sideways to the viewer, facing toward screen RIGHT, and place the camera a little above and in front of his LEFT side. This oblique view must show BOTH his face and that the page surfaces are oriented TOWARD HIM, not toward the viewer. Place the open book diagonally on his lap, rather than upright like a presentation. Make the boy and open book LARGE and centered, readable in a 147×147 CSS-pixel rounded illustration slot. Keep all hair, hands, book corners, and bare feet inside the square with margins at the rounded corners. The app overlays nothing on the image; the card slot is below it. No panels, divider, arrow, speech bubble, label, or writing. Generate against a perfectly uniform pure #00FF00 green background for later chroma key, not transparency or checkerboard. Use only a minimal soft contact shadow beneath him.
[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-30 — `think-say-me-boy-v2.png.webp`（採用、プロトタイプ用）

- 用途：Think & Say の I'm／It's に対応する「ぼくね」の汎用身ぶり。所有者が v2 を承認。画像は `private-prototypes/think-say-me-boy-v2.png.webp` に置き、本体には未組み込み。
- 添付した画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪型）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪型・絵のタッチ）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の猫の印）、生成時の `private-prototypes/think-say-me-boy-v2-green-original.png`（直前の v2 下書き。現在は `private-prototypes/think-say-me-boy-v2-pre-feedback-green-original.png` に保存）、`private-prototypes/think-say-me-boy-v1.png.webp`（顔と表情の参考のみ。鼻を指す手は写さない）。
- 不採用：`private-prototypes/think-say-me-boy-v1.png.webp`。自分の鼻を指す形が、鼻をほじっているように見えた。
- 完成候補は 512×512px、WebP quality 84。純緑背景（#00FF00）から `scripts/chroma-key-green.py` で透過し、髪・指先の緑の縁を拡大して確認。`tests/check-image-alpha.mjs` の透過チェックに合格。

### 採用画像に使用したプロンプト全文

```text
Use case: illustration-story. Generate a NEW image from the attached visual references. The previous v2 image's nearly horizontal pointing arm and wide smile must NOT be copied.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, daytime indoors, in his approved plain blue short-sleeved T-shirt and navy shorts. Image 1 (boy-daywear-v2.png.webp) defines his clothes and identity, Image 2 (word-target-boy-v1.png.webp) reinforces his face and hair, Image 3 (cat-mascot-v2-small.png.webp) defines only the tiny T-shirt emblem. Image 4 (the current v2 green original) defines ONLY the front-facing waist-up scale, face size and head position. Image 5 (think-say-me-boy-v1.png.webp) further confirms face and hair only. Do NOT copy the hand pose or mouth shape from Images 4 or 5.
Action: A clear Japanese child's “ぼく / わたし” gesture, pointing to HIMSELF. His torso and face remain straight toward the viewer. On the viewer's LEFT side, bend ONE elbow and place the hand LOWER on the torso, around the lower chest. The knuckles should be at approximately x=35%, y=73% of the square, well below the chin. From those low knuckles, extend the index finger on a STEEP DIAGONAL UPWARD AND INWARD, at roughly 45 degrees, to its fingertip at x=50%, y=59%: the exact midline of the UPPER CHEST, immediately below the collar center. The finger's direction leads back into his own sternum. Leave a small visible air gap between finger tip and shirt. The shirt's small cat emblem is farther toward the viewer's RIGHT at about x=58%, y=69%; there must be ample separation so the finger is not pointing at the cat. Keep fingers natural, the other fingers curled, and the free arm hanging down. No hand or finger anywhere near nose, mouth, chin or face. The pose must read “me,” not “look at my cat.”
Expression: Warm and gently sociable, speaking calmly as if saying “ぼくね.” Show a VERY SMALL relaxed talking smile: mouth corners only slightly upturned, lips modestly parted in a NARROW short curved opening, less than half as wide as the previous image's open mouth. No visible teeth, no big open grin, no laughing or delighted face. Maintain neutral eyebrows and bright but calm eyes so the picture can also accompany “I'm hungry” and “I'm sleepy.”
Objects: No objects, furniture, food, toy, background scene, text, letters or symbols. Only the tiny simplified cat-face emblem on the approved shirt.
Composition: Final 512×512 square, front-facing waist-up, face size and vertical head position matched to Image 4 and to the approved “ちょうだい” and “やりたい” pictures. Leave modest margins, no important details in the rounded-square corners. At a 147 CSS px display, the down-low fist and diagonal index finger aimed into the chest's exact midline must still read as self-reference. No app-rendered element overlaps the illustration; its card slot sits below it. Generate on an opaque perfectly flat pure #00FF00 green background for later chroma key. Do not produce transparency, checkerboard or background shadow. Do not stretch the figure.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-09-30 — `think-say-please-boy-v1.png.webp`（採用、プロトタイプ用）

- 用途：Think & Say の Can you／Can I に対応する「頼む／おねがい」の汎用身ぶり。所有者が候補を承認。画像は `private-prototypes/think-say-please-boy-v1.png.webp` に置き、本体には未組み込み。
- 添付した画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪型）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪型・絵のタッチ）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の猫の印）、`private-prototypes/think-say-me-boy-v2.png.webp`（顔の大きさと頭の位置の参考のみ。指さしのポーズと表情は写さない）。
- 不採用：`private-prototypes/think-say-please-boy-open-mouth-rejected.png`（最初の生成結果）。手を合わせて大きく口を開けて笑う姿が、大喜びしているように見え、「いただきます」に近かった。
- 採用候補は 512×512px、WebP quality 84、35,086 bytes。純緑背景（#00FF00）から `scripts/chroma-key-green.py`（輪郭を 1px 縮小）で透過し、髪・指先の縁を淡色と青色の背景で拡大確認。緑が目立つ縁の画素は 0 件で、`tests/check-image-alpha.mjs` の透過チェックに合格。

### 採用画像に使用したプロンプト全文

```text
Use case: illustration-story. Generate a NEW single-character illustration from the four attached reference images. Do not edit or copy any reference pose. The output will later be cut out by chroma key.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, in a daytime indoor scene, wearing his approved plain blue short-sleeved T-shirt with the tiny simplified cat-face emblem; the waist-up crop does not show footwear. Attached image 1, boy-daywear-v2.png.webp, fixes his face, hair, age, blue daywear and overall style. Attached image 2, word-target-boy-v1.png.webp, reinforces facial identity and style; do not copy its pajamas. Attached image 3, cat-mascot-v2-small.png.webp, defines only the tiny simplified cat-face emblem on his shirt. Attached image 4, think-say-me-boy-v2.png.webp, is a COMPOSITION REFERENCE ONLY for face size and head position; do not copy its self-pointing hand or expression.
Action: A familiar Japanese child's "おねがい / please" begging gesture. Body and face straight toward the viewer. Press both OPEN palms FLAT TOGETHER, palm against palm, with fingers together and pointing upward, directly in front of his LOWER FACE. The JOINED FINGERTIPS reach up to the height of the BOTTOM OF HIS NOSE, with the hands kept in front of his face rather than down at his chest. His touching palms form a narrow vertical prayer-like silhouette, not two separate cupped hands. Position the joined fingertips close to his nose and at least partially overlapping the lower mouth area, while the eyes, eyebrows, cheeks and most of the facial expression remain fully visible. His thumbs meet under the chin; the gesture is conspicuously HIGH, not a low mealtime prayer. Tilt his head slightly to one side. His eyes stay WIDE OPEN and look up toward the viewer with an upward pleading gaze. This is asking a person for help or permission, NOT "いただきます" or "ごちそうさま": do not place clasped hands down at chest height, do not bow, and do not close the eyes.
Expression: Cute, gentle, earnest "お願い" expression. A tiny closed-mouth pleading smile with raised inner eyebrows and big open upward-looking eyes. If the mouth opens at all, it opens only a LITTLE, as if quietly saying "おねがい"; no visible big red oval mouth, teeth or loud joyful laugh. Not a broad ecstatic grin, not a neutral mealtime expression, not eyes closed.
Objects: None. Empty hands. No food, dishes, toys, props, furniture, symbol, writing, speech bubble, or extra person. Retain only the tiny cat-face emblem on the approved T-shirt.
Composition: Final 512×512 square illustration. Waist-up framing matching the approximate face width and head position of attached image 4 and the other approved Think & Say gesture images, so four gestures look like the same-sized child in a row. Center the boy; keep the top of the hair, both arms, and joined fingertips fully inside the square, with clear margins around them and at all four corners of a rounded-square display slot. At 147 CSS px, the two touching palms, open eyes and pleading expression must remain readable. Keep the eyes above and unobstructed by the hands. The app displays this picture in a rounded 147–183 CSS px illustration frame; it overlays nothing on the artwork (the card slot is below). Generate against a perfectly UNIFORM SOLID PURE GREEN #00FF00 background, not transparency, checkerboard or gradient, for later chroma-key removal.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-02 — `think-say-hungry-boy-v2.png.webp`（採用、プロトタイプ用）

- 用途：Think & Say の右の絵「hungry」。所有者が v2 を承認。画像は `private-prototypes/think-say-hungry-boy-v2.png.webp` に置き、プロトタイプの1問目で使用する。本体には未組み込み。
- 添付した基準画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪型）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪型・絵のタッチ）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の猫の印）、`private-prototypes/think-say-me-boy-v2.png.webp`（顔の大きさと位置の参考のみ）。v1 は生成時に添付していない。
- 不採用：`private-prototypes/think-say-hungry-boy-v1.png.webp`。おなかを押さえた力のない顔だけでは、空腹ではなく腹痛や体調不良に見えた。
- 採用画像は純緑背景から `scripts/chroma-key-green.py --edge-shrink 1` で透過。縦横比を保って512×512pxに仕上げ、WebP quality 84で書き出した。拡大した輪郭に緑優勢の画素はなく、`tests/check-image-alpha.mjs` の透過チェックに合格。

### 採用画像に使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The BOY in his approved daytime outfit, indoors, alone.
Action: He gently rests BOTH hands on his belly because he is hungry. A SMALL fluffy thought cloud floats diagonally above and to the right of his head, connected to his head by exactly two or three small round thought dots. Inside the cloud is exactly ONE clearly recognizable Japanese onigiri: a triangular mound of WHITE rice with a tiny black nori patch. The onigiri is imagined food, not held by the boy.
Expression: His eyes look upward toward the onigiri in the cloud. A dreamy "I want to eat" expression, pleasantly longing, softened brows, slightly open smiling mouth, with just ONE subtle drop of drool at the corner of his mouth. No pain, nausea, sadness, sweat, tears, or tightly furrowed brows.
Objects: Only the single onigiri inside the thought cloud. Absolutely no banana, apple, toast, cereal, milk, plate, furniture, letters or symbols.
Composition: Square 512x512 asset. Waist-up boy facing mostly forward. Keep his face about the same scale and vertical position as the attached self-pointing boy reference; adjust only enough to fit the thought cloud in clear upper-right space. The boy's face, both belly-resting hands, thought dots, entire cloud and triangular rice ball must be legible at 147 CSS pixels. Keep all important content away from rounded square corners. Leave visible separation between cloud and hair/face. No cropping or stretching. The attached self-pointing boy is ONLY a size and placement reference, not a pose or expression reference.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```
