# 人物画像の生成記録

このファイルは `docs/image-prompts.md` に基づく制作の記録。**候補と採用済みを区別する。** 新しい画像を採用した場合は、実際に使ったプロンプト全文、添付した基準画像、透過・サイズ検査、所有者の承認を追記する。

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
- 元の緑背景：Mac 上の `source-images/generation-inputs/action-get-boy-v3-green.png`（Git と公開サイトの対象外）。1672×941px、1,637,803 bytes。
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

## 2026-09-23 — `action-put-girl-v4-candidate`（未承認・非公開）

- 用途：Action Match の `put`、女の子版。公開用 `index.html` はまだ変更していない。候補は `private-prototypes/action-put-girl-v4-candidate.png.webp` に保存。
- 生成：組み込み imagegen。添付した基準画像は `docs/characters/word-target-girl-v2.png.webp`（正面全身）、`docs/characters/breakfast-stage-v7.jpg.webp`（顔・髪・服）、`action-put-boy-v4.png.webp`（承認済みの2コマ構成と小道具・画風）。
- 緑背景原稿：`source-images/generation-inputs/action-put-girl-v4-green.png`、1672×941px、1,530,516 bytes。透過処理：`scripts/chroma-key-green.py` → `private-prototypes/action-put-girl-v4-cutout.png`。書き出し：`cwebp -q 84 -resize 800 450`、候補WebP 58,406 bytes（元PNG比約96.2%削減）。
- 検査：`tests/check-image-alpha.mjs` PASS（800×450px、四隅アルファ0/0/0/0）。淡い青と濃い青の背景に重ねた `private-prototypes/action-put-girl-v4-edge-check.png` で、目立つ緑の縁は見られない。`private-prototypes/action-put-girl-v4-comparison.png` は基準・男の子版・旧女の子版・新候補を比較。`private-prototypes/action-put-girl-v4-card-preview.png` は現行カード寸法と二重矢印を模した**オフライン合成**で、実ブラウザのスクリーンショットではない。
- 判定：女の子の高いお団子・青いシュシュ・ピンクの星柄パジャマ・裸足、等幅2コマ、中央余白、区切り線なしを確認。所有者の承認待ち。承認前に公開用画像や参照先を差し替えない。

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

## 2026-09-23 — `action-put-boy-v5-noline-candidate`（未承認・非公開）

- 用途：Action Match の承認済み `put-boy-v4` から画像内の水色の区切り線を除いた候補。`index.html` と公開画像は変更していない。
- 確認できた記録：`docs/image-log.md` には **v4制作時の元プロンプト全文は存在しない**。元原稿 `source-images/drafts/action-put-boy-v4-green.png` と公開済みv4が残っていたため、これを編集対象にした。存在しない元プロンプトを推測で再現したとは記さない。
- 生成：組み込み imagegen の既存画像編集。添付画像は Image 1：上記v4緑背景原稿（編集対象）、Image 2：`action-put-boy-v4.png.webp`（承認済み公開版）、Image 3：`docs/characters/word-target-boy-v1.png.webp`、Image 4：`docs/characters/bathroom-stage-v5.jpg.webp`（人物基準）。水色線のみを周囲の緑背景で置き換えるよう指定した。
- 候補の緑背景PNG：`source-images/drafts/action-put-boy-v5-noline-green.png`、1672×941px、1,509,056 bytes。透過：`scripts/chroma-key-green.py` → `private-prototypes/action-put-boy-v5-noline-cutout.png`。WebP quality 84、800×450pxの候補：`private-prototypes/action-put-boy-v5-noline-candidate.png.webp`、55,026 bytes（緑背景PNG比約96.4%削減、旧公開WebP 57,290 bytes比約4.0%削減）。
- 検査：`tests/check-image-alpha.mjs` PASS（四隅アルファ0/0/0/0）。`private-prototypes/action-put-boy-v5-noline-edge-check.png` の淡色・濃色背景で目立つ緑の縁なし。現行版との並列比較は `private-prototypes/action-put-boy-v5-noline-comparison.png`、カード寸法と二重矢印を模したオフライン合成は `private-prototypes/action-put-boy-v5-noline-card-preview.png`（実ブラウザのスクリーンショットではない）。
- 目視では、男の子・積み木・台の構図と位置は維持され、水色線だけが消えた。画像生成による微細な再描画はあるため、完全なピクセル一致ではない。元の緑背景画像との比較では中央70px帯を除いた画素の平均絶対差は3.85/255、30階調超の差がある画素は0.67%。所有者の承認待ち。

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
