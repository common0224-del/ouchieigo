# 人物画像の生成記録

このファイルは `docs/image-prompts.md` に基づく制作の記録。**候補と採用済みを区別する。** 新しい画像を採用した場合は、実際に使ったプロンプト全文、添付した基準画像、透過・サイズ検査、所有者の承認を追記する。

## 2026-10-11 — Action Match 女の子版「Put it on.」「Take it off.」靴下の色を変更

- **理由：** 白い靴下は実際のカードのクリーム色の背景に溶け込んで見えにくかったため、無地のオレンジ（基準色 `#F28A24`、輪郭・陰影は濃い同系色）に変更した。
- **公開画像と候補の対応：** 公開ルートの `action-put-on-girl-v3a.png.webp` は `private-prototypes/action-match/action-put-on-girl-v4a.png.webp` の内容に、公開ルートの `action-take-off-girl-v3a.png.webp` は `private-prototypes/action-match/action-take-off-girl-v4a.png.webp` の内容に差し替えた。公開側は既存のファイル名を維持するが、中身はオレンジの靴下版。各組のバイト単位の一致を確認した。候補 v4a は移動・削除せず残す。
- **白い靴下の元画像：** `private-prototypes/action-match/action-put-on-girl-v3a.png.webp` と `private-prototypes/action-match/action-take-off-girl-v3a.png.webp` に残す。上書き前の各公開画像とバイト単位で一致することを確認したため、別名の複製は作らない。この後に続く v3a の生成記録は、白い靴下版を制作・採用した当時の記録である。
- **作り方：** 公開されていた採用画像を元に、靴下がある領域と白い布の色条件を組み合わせて画素を選び、同じ `#F28A24` を基準として元の明暗に沿って色を置き換えた。画像編集AI・生成プロンプトは使っていない。靴下の選択領域外のRGBA画素は元画像と一致し、アルファ面全体も一致した。800×450px、透過 lossless WebP で保存し、四隅のアルファ値はすべて0。実際のカードに近い `#FFF8E7` の背景に重ねた確認用画像は `private-prototypes/action-match/action-put-on-girl-v4a-check.png` と `private-prototypes/action-match/action-take-off-girl-v4a-check.png`。
- **今後の確認の教訓：** 画像の見え方は暗い背景だけで判断せず、実際のカードの背景色（クリーム色）の上でも確認する。

## 2026-10-11 — Action Match「Pick it up.」女の子版 v1b（採用、アプリには未組み込み）

- **採用画像：** `private-prototypes/action-match/action-pick-up-girl-v1b.png.webp`。800×450px、透過WebP。非公開の候補フォルダに置いたまま、アプリには未組み込み。
- **透過・寸法：** 緑背景で生成した原画を `scripts/chroma-key-green.py` の既定設定で透過。原画1672×941pxの端を1pxだけ切り、縦横比を保って800×450pxへ縮小し、WebP quality 84で保存した。`tests/check-image-alpha.mjs` の透過検査はPASS、四隅のアルファ値は0/0/0/0。可視画素に強い緑優勢の画素は検出されず、目視でも目立つ緑の縁や半透明のもやは見当たらなかった。
- **不採用：** `private-prototypes/action-match/action-pick-up-girl-v1a.png.webp`。800×450px、透過WebP。**現在の保存先に存在する。**
- **動物と色の選択：** Item Match の `Teddy bear`、`Rabbit`、`Cat`、`Turtle`、`Doll` と取り違えないよう、ぬいぐるみはぞうにした。淡い紫色は、リビング背景のおもちゃ箱に描かれた青いぞう、椅子の水色、女の子の服のピンク、靴下の白、男の子版のボールの赤と区別するため。
- **レビューでの決定：** ひざを寄せてしゃがみ、足を開く構図を避けた。v1b は手がぞうの少し上で止まり「これから拾う」と分かるため採用。v1a は手がぞうの頭に触れて見えるため不採用。

### 両案の生成時に添付した参考画像

1. `private-prototypes/action-match/action-pick-up-boy-v1a.png.webp`：等幅2コマ、しゃがむ→立って胸の前に持つ流れと人物の大きさ。男の子の顔・服は参考にしない。
2. `private-prototypes/action-match/action-take-off-girl-v3a.png.webp`：絵のタッチ、女の子の描き方。
3. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔、髪、昼服の基準。
4. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。

### 不採用 v1a の生成プロンプト全文

```text
Use case: illustration-story
Asset type: Action Match two-panel character action candidate, variant v1a. The four attached images are references only, not edit targets.
Reference image 1 (action-pick-up-boy-v1a.png.webp): equal-width two-panel composition, crouch then stand holding an object at chest, character scale; do not copy the boy's face or clothes.
Reference image 2 (action-take-off-girl-v3a.png.webp): illustration style and rendering of the girl.
Reference image 3 (girl-daywear-v1.png.webp): exact girl's face, hair, high bun with blue scrunchie, and approved pink short-sleeved dress.
Reference image 4 (cat-mascot-v2-small.png.webp): tiny simplified cat face emblem on the dress only; do not draw a separate cat.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The one same GIRL in approved daytime outfit, indoors and barefoot, appears once in each of two before-and-after panels; no other people.
Action: In the LEFT panel she crouches facing mostly forward with knees together, dress hem falling naturally in front of the knees, both soles on the floor. A small seated lavender elephant plush is on the floor a little ahead of her toes, not underneath her. She reaches one hand toward it but has not touched or lifted it. In the RIGHT panel she stands in the same horizontal position, upright and front-facing, holding that same lavender elephant plush with both hands at chest level. The transition is unmistakably floor to hands.
Expression: Left eyes look down at the plush, attentive and gentle. Right a happy small smile.
Objects: One plush elephant per panel, pale lavender fabric, seated form, clear broad ears and long trunk, small round black eyes, plain with no pattern, lettering or decorations. Smaller than the girl's head and easy to hold in two hands. The plush is the same size and appearance in both panels.
Composition: Exactly two equal-width side-by-side panels, BEFORE left and AFTER right, each 400x450 within a final 800x450 canvas. Match the girl's standing scale and horizontal placement between panels, as in reference 1. Keep each complete figure, feet, face, reaching hand and elephant safely within its own panel. The app overlays a 31 CSS px double arrow at the central panel boundary around vertical midpoint: leave a clear gutter there with no face, hand, or elephant. No drawn divider or arrows. Variant v1a: compact, balanced squat with both knees close together; elephant faces nearly forward on the floor. Keep all meaningful action high enough to remain visible when scaled into a card.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Additional exclusions: no sitting on the floor, no spread knees or raised-knee front pose, no twisting, side-facing body, or lifted foot. Do not place the plush on a shelf. Do not depict bear, rabbit, cat, turtle, or doll plush. Plush must not be blue, white, yellow, red, green, or pink. No book, blocks, towel, cup, blanket, trash can, ball, hat, box, chair, socks, window, curtain, large floor, or large shadow. No cat animal except the tiny clothing emblem.
```

### 採用 v1b の生成プロンプト全文

```text
Use case: illustration-story. Generate second variant of Action Match 'Pick it up.' girl. References: 1 action-pick-up-boy-v1a is two-panel crouch-to-stand action and scale only, not boy's look; 2 action-take-off-girl-v3a is girl's rendering style; 3 girl-daywear-v1 is exact girl's appearance; 4 cat-mascot-v2-small is tiny chest emblem only. [STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: Same single girl in each panel, indoors in approved daytime outfit, barefoot.
Action: LEFT: Girl crouches with knees together and soles flat, dress hem hanging over the fronts of her knees. She reaches one hand toward a small seated lavender elephant plush on the floor just in front of her feet; she has not lifted it. Her eyes look at the plush. RIGHT: she stands at the same horizontal position and holds the identical plush at chest height with both hands, facing forward and smiling.
Expression: Left focused and gentle; right happy smile.
Objects: A single plain pale lavender seated stuffed elephant, smaller than girl's head, long obvious trunk, broad ears, tiny round black eyes, no pattern, writing or decoration. Same size and form across both panels.
Composition: Final 800x450, two side-by-side exactly equal 400x450 panels, before left and after right. Full figures and feet visible, corresponding placement/scale. Variant v1b differs slightly from v1a: girl crouches a little more upright, with closed knees; the elephant's head is turned slightly in three-quarter view to show its long trunk and near ear clearly. The app places a 31 CSS px double arrow over the panel boundary at vertical midpoint, so keep the boundary gutter completely clear of faces, hands and objects. No drawn divider or arrows.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Additional exclusions: no floor sitting, spread knees, body twist, sideways body, raised foot, shelf, table, bear/rabbit/cat/turtle/doll plush; no blue, white, yellow, red, green, or pink plush; no book, blocks, towel, cup, blanket, bin, ball, hat, box, chair, socks, window or curtain; no large floor or shadow. Only tiny cat face on girl's chest, no separate cat animal.
```

## 2026-10-11 — Action Match「Close it.」女の子版 v1a（採用、アプリには未組み込み）

- **採用画像：** `private-prototypes/action-match/action-close-girl-v1a.png.webp`。800×450px、透過 lossless WebP。候補フォルダに置いたままで、アプリには未組み込み。
- **合成の由来・透過：** `action-open-girl-v2a.png.webp` の左右400×450pxを、復号後の画素そのままで入れ替えた。v1a の制作に画像生成は使っていない。元画像は緑背景（#00FF00）を `scripts/chroma-key-green.py --edge-shrink 2` で透過した画像で、v1a はその透過画素を受け継ぐ。再保存時も透明部分を含め画素を保つため `exact=True` の lossless WebP を使用。復号後の両コマが元画像の対応コマと全画素一致し、四隅と中央の矢印領域は透明で、中央の境目に手や物は重ならないことを確認した。
- **不採用：** `action-close-girl-v1b.png.webp`。現在の保存先 `private-prototypes/action-match/` に存在する。
- **レビューでの決定：** v1b は右コマの口元だけを満足げな小さな笑顔に編集したが、v1a との顔の違いが小さく、編集する理由がないため不採用。コマを入れ替えただけの v1a を採用した。

### 不採用 v1b の画像編集時に添付した参考画像

1. `private-prototypes/action-match/action-close-girl-v1a.png.webp`：編集対象。右コマの顔以外を保つ基準。
2. `private-prototypes/action-match/action-open-girl-v2a.png.webp`：採用済みの元画像と人物の参考。

### 不採用 v1b の生成プロンプト全文

```text
Use case: precise-object-edit
Asset type: Action Match two-panel children's illustration, 800×450 composition.
Image 1 is the exact edit target: action-close-girl-v1a.png.webp. Image 2 is the adopted source/reference action-open-girl-v2a.png.webp.
Edit ONLY the GIRL'S FACE in the RIGHT panel (the panel with the closed cream curtains). She has just finished closing the curtains. Give her a slightly more satisfied, peaceful small smile, with relaxed happy eyes and eyebrows. Her mouth is closed or only very slightly open; no big open-mouth laugh. Keep her identity, head outline, skin tone, hair, blue scrunchie and pose the same. Keep the facial features at the same positions so they can be composited into the original face.
Everything outside the right-panel facial features MUST stay unchanged: the entire LEFT panel, the right-panel hair, body, pink dress, chest cat emblem, arm, hand on the central curtain seam, bare feet, white window frame, pale cream closed curtains, transparency, dimensions and alignment. Do not redraw or move the window, girl or curtains. No new objects, text, divider or arrow. No angry, troubled, crying or sad expression.
Output a transparent image with the same two-panel layout, preserving the existing alpha. The edit is only a subtle facial-expression change; nothing else.
```

## 2026-10-11 — Action Match「Open it.」女の子版 v2a（採用、アプリには未組み込み）

- **採用画像：** `private-prototypes/action-match/action-open-girl-v2a.png.webp`。800×450px、透過WebP。画像は非公開の候補フォルダに置いたままで、アプリには未組み込み。
- **透過・寸法：** 緑背景（#00FF00）で生成し、`scripts/chroma-key-green.py --edge-shrink 2` で透過。絵を引き伸ばさず縦横比を保って800×450pxの透明キャンバスに配置し、WebP品質84で保存した。四隅のアルファ値はすべて0、画像内に透明部分と不透明部分がある。淡い背景に重ねた目視確認では目立つ緑の縁・半透明の白いもやはなく、アルファ値100超の可視画素で強い緑優勢のものは0だった。
- **不採用：** `action-open-girl-v1a.png.webp`、`action-open-girl-v1b.png.webp`（女の子が窓の端に立ち、片側のカーテンを寄せる動きに見える構図）、`action-open-girl-v2b.png.webp`（別案）。**3枚とも現在の保存先 `private-prototypes/action-match/` に存在する。**
- **レビューでの決定：** カーテンは白に近い淡いクリーム色、窓の外は物を描かない単色の淡い空。女の子は窓の中央の手前に立ち、左コマでは手を中央のあわせ目に添え、右コマではカーテンを中央から左右へ開く。窓の端に立つ旧構図だと片側だけに寄せる動きに見えるため描き直した。v2a は小さい表示でも開閉と手の位置の違いが分かるため採用した。

### v1a・v1b・v2a・v2b の生成時に添付した参考画像

1. `private-prototypes/action-match/action-take-off-girl-v3a.png.webp`：タッチ、人物の大きさ、等幅2コマ構図の参考。顔と椅子は参考にしない。
2. `private-prototypes/action-match/action-open-boy-v1b.png.webp`：「閉じる→開く」を2コマで見せる参考。男の子と箱は写さない。
3. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔、髪、昼服の基準。
4. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。

### 不採用 v1a の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One girl, shown twice in two successive panels, daytime indoors and barefoot. Image 1 is a reference ONLY for the picture-book art style, girl scale, and equal two-panel composition; do not copy its seated pose or stool. Image 2 is a reference ONLY for clear before/after visual storytelling and panel scale; do not copy the boy or toy box. Image 3 is the authoritative reference for the girl's face, high bun with blue scrunchie and plain pink short-sleeved dress. Image 4 is ONLY the tiny simplified cat-face emblem on the dress, never a separate cat.
Action: Illustrate "Open it." LEFT BEFORE: one white-framed upright window is completely covered by TWO closed pale near-white cream curtain panels meeting at the middle with no visible sky. The girl stands beside the window, lightly pinching the edge of one curtain with one hand, about to slide it open. RIGHT AFTER: the SAME window and the SAME girl in the SAME positions and at the SAME sizes. The two curtain panels are gathered OPEN at the left and right sides, exposing a broad central area of very pale cream-blue solid-color sky. With one hand she holds an open curtain at its edge. The opening must be unmistakably wide, not a small slit.
Expression: In left panel intent and gentle focus; in right panel a warm open-eyed smile.
Objects: Exactly one simple white-framed window per panel and its two plain, almost-white pale-cream curtains with a few readable soft pleats. No wall. The closed left window shows curtain only; the open right window shows ONLY one flat pale cream-blue color for sky, lighter than the blue stool in Image 1. No outside scenery, cloud, tree, bird or building.
Composition: Wide 16:9 image with exactly two equal-width 400×450-equivalent panels. In each panel place the upright window on viewer-left, girl standing immediately to its viewer-right, with little overlap. Window top just above the girl's bun; barefoot feet fully in frame. Her entire body, shoulders, waist, legs and face turn naturally about 30 degrees toward the window, with no twisted torso. Keep window, girl, hands and curtain clear of the x=400 center boundary. The app overlays red arrowheads at the center seam around mid-height, about 18×22 CSS px per arrowhead and about 31 CSS px overall. Draw no divider or arrow. Keep window and girl large enough that curtain closed versus open reads at small card size. Pure #00FF00 background outside the isolated window and girl, with no room or floor.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not add walls, floors, large shadows, clouds, trees, birds, buildings or any outdoor object. Do not add books, blocks, towels, cups, blankets, bins, balls, plush toys, hats, toy boxes, stools, chairs or socks. No green curtains or window frame. No twisted body, full profile, lifted foot, extra cat, extra person, text, symbols, divider or arrow.
```

### 不採用 v1b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One girl, shown twice in two successive panels, daytime indoors and barefoot. Image 1 is a reference ONLY for the picture-book art style, girl scale, and equal two-panel composition; do not copy its seated pose or stool. Image 2 is a reference ONLY for clear before/after visual storytelling and panel scale; do not copy the boy or toy box. Image 3 is the authoritative reference for the girl's face, high bun with blue scrunchie and plain pink short-sleeved dress. Image 4 is ONLY the tiny simplified cat-face emblem on the dress, never a separate cat.
Action: Illustrate "Open it." LEFT BEFORE: one white-framed upright window is completely covered by TWO closed pale near-white cream curtain panels meeting at the middle with no visible sky. The girl stands beside the window, lightly pinching the edge of one curtain with one hand, about to slide it open. RIGHT AFTER: the SAME window and the SAME girl in the SAME positions and at the SAME sizes. The two curtain panels are gathered OPEN in more visibly folded, narrower stacks at the left and right sides, exposing a broad central area of very pale cream-blue solid-color sky. With one hand she holds an open curtain at its edge. The opening must be unmistakably wide, not a small slit.
Expression: In left panel intent and gentle focus; in right panel a warm open-eyed smile.
Objects: Exactly one simple white-framed window per panel and its two plain, almost-white pale-cream curtains with somewhat deeper, clearly separated but still simple pleats. No wall. The closed left window shows curtain only; the open right window shows ONLY one flat pale cream-blue color for sky, lighter than the blue stool in Image 1. No outside scenery, cloud, tree, bird or building.
Composition: Wide 16:9 image with exactly two equal-width 400×450-equivalent panels. In each panel place the upright window on viewer-left, girl standing immediately to its viewer-right, with little overlap. Make this second candidate's window slightly narrower than the first candidate, but still broad enough to show a large opening. Its top is just above the girl's bun; barefoot feet fully in frame. Keep the girl relatively large within each panel. Her entire body, shoulders, waist, legs and face turn naturally about 30 degrees toward the window, with no twisted torso. Keep window, girl, hands and curtain clear of the x=400 center boundary. The app overlays red arrowheads at the center seam around mid-height, about 18×22 CSS px per arrowhead and about 31 CSS px overall. Draw no divider or arrow. Keep window and girl large enough that curtain closed versus open reads at small card size. Pure #00FF00 background outside the isolated window and girl, with no room or floor.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not add walls, floors, large shadows, clouds, trees, birds, buildings or any outdoor object. Do not add books, blocks, towels, cups, blankets, bins, balls, plush toys, hats, toy boxes, stools, chairs or socks. No green curtains or window frame. No twisted body, full profile, lifted foot, extra cat, extra person, text, symbols, divider or arrow.
```

### 採用 v2a の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One girl, shown twice in two successive panels, daytime indoors and barefoot. Image 1 is a reference ONLY for picture-book art style, girl scale, and equal two-panel composition; do not copy its seated pose or stool. Image 2 is a reference ONLY for clear before/after storytelling and panel scale; do not copy the boy or toy box. Image 3 is the authoritative reference for the girl's face, high bun with blue scrunchie and plain pink short-sleeved dress. Image 4 is ONLY the tiny simplified cat-face emblem on the dress, never a separate cat.
Action: Illustrate "Open it." LEFT BEFORE: TWO pale near-white cream curtains fully cover one upright white-framed window, meeting at a clear VERTICAL CENTRAL JOIN. The girl stands IN FRONT OF THE WINDOW near its middle, slightly forward and a little to the viewer-right of the central join so her face does NOT cover that join. Her one outstretched hand TOUCHES THE CENTRAL JOIN at about chest height with fingertips, about to pull the two curtain halves apart. Her other arm hangs naturally at her side. RIGHT AFTER: the SAME girl and SAME window at the SAME size and position. The two curtains are pulled APART FROM THEIR CENTRAL JOIN and gathered at opposite LEFT and RIGHT edges, revealing a BROAD central opening of uniform pale cream-blue sky. She holds the edge of the viewer-right open curtain with the same one hand and smiles. The difference must clearly be a move of the hand from center to side and curtains opening from middle to both sides; NOT a one-sided curtain slide.
Expression: Left gentle intent and focus; right warm open-eyed smile.
Objects: Exactly one simple white-framed window per panel and two plain, almost-white pale-cream curtain panels with a few soft pleats. No wall. The closed left window shows curtain only; the open right window shows ONLY flat pale cream-blue sky, lighter than the blue stool in Image 1. No outdoor object.
Composition: Wide 16:9 image with EXACTLY TWO equal-width 400×450-equivalent panels. The girl is IN FRONT OF THE CENTRAL PART of each window, not standing at a window's outer edge or next to the window. The window rises just above the girl's bun. Position the girl's torso in the lower center-right area of the window while keeping the vertical central join (left panel) and central sky opening (right panel) visible to the viewer. Her face should be to the right of the central join, and her arm reaches inward to it; do not obscure the central join with her head or body. She turns naturally about 30 degrees toward the window, shoulders, waist, feet and face aligned, without twisted torso. Both bare feet fully inside frame. Match girl size, window size, and alignment across both panels. The app overlays red arrowheads on the center seam at mid-height, about 18×22 CSS px per arrowhead and 31 CSS px overall; keep face, hand, window and curtains away from that panel seam. No divider or arrow. Keep the curtain change obvious at small card size. Solid pure #00FF00 background outside the isolated window and girl; no room or floor.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not add walls, floors, large shadows, clouds, trees, birds, buildings or any outdoor object. Do not add books, blocks, towels, cups, blankets, bins, balls, plush toys, hats, toy boxes, stools, chairs or socks. No green curtains or window frame. No twisted body, full profile, lifted foot, extra cat, extra person, text, symbols, divider or arrow.
```

### 不採用 v2b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One girl, shown twice in two successive panels, daytime indoors and barefoot. Image 1 is a reference ONLY for picture-book art style, girl scale, and equal two-panel composition; do not copy its seated pose or stool. Image 2 is a reference ONLY for clear before/after storytelling and panel scale; do not copy the boy or toy box. Image 3 is the authoritative reference for the girl's face, high bun with blue scrunchie and plain pink short-sleeved dress. Image 4 is ONLY the tiny simplified cat-face emblem on the dress, never a separate cat.
Action: Illustrate "Open it." LEFT BEFORE: TWO pale near-white cream curtains fully cover one upright white-framed window, meeting at a clear VERTICAL CENTRAL JOIN. The girl stands IN FRONT OF THE WINDOW near its middle, slightly forward and a little to the viewer-right of the central join so her face does NOT cover that join. Her one outstretched hand TOUCHES THE CENTRAL JOIN at about chest height with fingertips, about to pull the two curtain halves apart. Her other arm hangs naturally at her side. RIGHT AFTER: the SAME girl and SAME window at the SAME size and position. The two curtains are pulled APART FROM THEIR CENTRAL JOIN and gathered in visibly folded but narrow stacks at opposite LEFT and RIGHT edges, revealing a BROAD central opening of uniform pale cream-blue sky. She holds the edge of the viewer-right open curtain with the same one hand and smiles. The difference must clearly be a move of the hand from center to side and curtains opening from middle to both sides; NOT a one-sided curtain slide.
Expression: Left gentle intent and focus; right warm open-eyed smile.
Objects: Exactly one simple white-framed window per panel and two plain, almost-white pale-cream curtain panels with somewhat deeper, more visibly separated soft pleats. No wall. The closed left window shows curtain only; the open right window shows ONLY flat pale cream-blue sky, lighter than the blue stool in Image 1. No outdoor object.
Composition: Wide 16:9 image with EXACTLY TWO equal-width 400×450-equivalent panels. The girl is IN FRONT OF THE CENTRAL PART of each window, not standing at a window's outer edge or next to the window. For this second candidate, make the window slightly narrower and its frame more prominent, while still rising just above the girl's bun. Position the girl's torso in the lower center-right area of the window while keeping the vertical central join (left panel) and central sky opening (right panel) visible to the viewer. Her face should be to the right of the central join, and her arm reaches inward to it; do not obscure the central join with her head or body. She turns naturally about 30 degrees toward the window, shoulders, waist, feet and face aligned, without twisted torso. Both bare feet fully inside frame. Match girl size, window size, and alignment across both panels. The app overlays red arrowheads on the center seam at mid-height, about 18×22 CSS px per arrowhead and 31 CSS px overall; keep face, hand, window and curtains away from that panel seam. No divider or arrow. Keep the curtain change obvious at small card size. Solid pure #00FF00 background outside the isolated window and girl; no room or floor.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not add walls, floors, large shadows, clouds, trees, birds, buildings or any outdoor object. Do not add books, blocks, towels, cups, blankets, bins, balls, plush toys, hats, toy boxes, stools, chairs or socks. No green curtains or window frame. No twisted body, full profile, lifted foot, extra cat, extra person, text, symbols, divider or arrow.
```

## 2026-10-11 — Action Match「Take it off.」女の子版 v3a（当時採用した白い靴下の原版）

- **当時の採用画像：** `private-prototypes/action-match/action-take-off-girl-v3a.png.webp`。800×450px、透過 lossless WebP。白い靴下の原版として非公開の候補フォルダに保管。現在の公開画像は上記の色変更記録のとおり。
- **透過と合成の由来：** 採用 v3a の左コマだけを新しく画像生成した。緑背景（#00FF00）の原画を `scripts/chroma-key-green.py --edge-shrink 2` で透過し、800×450pxに縮小した。右400×450pxは `action-take-off-girl-v2a.png.webp` の右コマを復号後の画素そのままで合成し、一致を確認した。その v2a の左400×450pxは `action-put-on-girl-v3a.png.webp` の右コマを画素そのままで使用していた。画素を再圧縮で変えないため lossless WebP で保存。四隅のアルファ値は0/0/0/0、中央の境目は透明。淡い背景と青い背景に重ねた目視確認で、目立つ緑の縁や半透明の白いもやはなかった。
- **不採用：** `action-take-off-girl-v1a.png.webp`、`action-take-off-girl-v1b.png.webp`（床に座る正面向きの旧構図）、`action-take-off-girl-v2a.png.webp`、`action-take-off-girl-v2b.png.webp`（左コマが靴下をはいて座るだけで、これから脱ぐ動きがない）、`action-take-off-girl-v3b.png.webp`（つまむ手の位置が散らばる）。**5枚とも現在の保存先 `private-prototypes/action-match/` に存在する。** v2a は画像全体として不採用だが、右コマのみ採用画像の右半分に使用した。
- **レビューでの決定：** `Put it on.` と同じ低い水色の丸椅子に座る。右コマでは、脱いだ白い靴下2つを足から離し、両手で胸の前に持つ。足の近くに持つと「はく」絵と取り違えるため。左コマは足元を見て、両手で手前の靴下のふちをつまみ、これから脱ぐ動きを示す。ただし靴下は両足にはいたままにし、途中まで脱いだ形にはしない。v3a は両手がふちに寄り、小さい表示でもつまんでいることが分かるため採用。v3b は手の位置が散らばるため不採用。

### v1a・v1b の生成時に添付した参考画像

1. `private-prototypes/action-match/action-put-on-girl-v1a.png.webp`：旧版の床に座る構図、人物の大きさ、靴下の参考。
2. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔・髪・昼服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。

### 不採用 v1a の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The SAME girl in Image 1, daytime indoors, wearing the approved plain pink short-sleeved dress with tiny cat-face emblem. Image 1 is the exact two-panel "Put it on." reference: its RIGHT panel shows the girl's seated posture, location, scale, hairstyle, dress, smile and white socks. Image 2 is the girl's authoritative face/hair/daywear reference. Image 3 is ONLY the reference for the tiny simplified cat emblem on her dress; do not add a separate cat.
Action: Create a two-panel BEFORE/AFTER concept for "Take it off." In the LEFT panel show the girl sitting with both knees raised and BOTH PLAIN WHITE SOCKS WORN, exactly like Image 1's right panel. This generated LEFT panel is just positional guidance; it will be discarded and replaced in final compositing by the original reference image's right 400×450 pixels, unchanged. In the RIGHT panel AFTER, draw the SAME girl sitting in precisely the SAME place, size, leg position, front-facing torso and face angle as that socked reference. Both feet are now completely BARE, with ten visible toes and no socks on the ankles or feet. Her two bare feet are clearly separated from her hands. She holds the TWO removed plain WHITE socks together with both hands at UPPER CHEST height, in front of the upper pink dress, far above and well away from her feet. The sock cuffs and foot shapes are recognizable, not a white blob. A small cheerful smile. The visual contrast must read "socks moved from feet to hands" at small Action Match card size.
Expression: Happy, relaxed, gentle open-eyed smile, matching Image 1's right-panel girl.
Objects: Exactly the same two white plain unpatterned child socks; no stripes, logos, letters, colors or decorative details. In RIGHT panel both socks are in her hands at chest height, none on feet or near toes. No other objects.
Composition: Wide 16:9 image with EXACTLY two equally wide 400×450-equivalent panels, full seated girl visible in each panel from blue scrunchie and high bun to bare/socked toes. Match the reference's RIGHT-panel girl's scale, seated silhouette, foot baseline and horizontal center inside each panel. Preserve generous empty space at the vertical panel boundary x=400 and its mid-height: the app overlays red triangle arrowheads there around 18×22 CSS px each (roughly 31 CSS px overall). No hands, feet, face or socks in that center arrow region. No drawn divider or arrow. Solid pure #00FF00 green background for subsequent chroma-key transparency. No floor or large shadow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not draw socks on either foot in the RIGHT panel, a half-worn sock, socks close to toes, a boy, a separate cat, book, blocks, towel, cup, blanket, trash bin, ball, stuffed animal, hat, box, green socks, large floor, large shadow, standing pose, twisted torso, profile body, divider, arrow, text or watermark.
```

### 不採用 v1b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One girl in two successive panels, daytime indoors. Image 1 is the exact "Put it on." girl reference: use its RIGHT 400×450 panel for the seated position, character scale, head/feet coordinates, hairstyle, face, pink dress and white socks. Image 2 reinforces the girl's approved high dark-brown bun with blue scrunchie, face and pink daywear. Image 3 supplies ONLY the tiny simplified black-white cat emblem on the dress; do not draw a separate cat.
Action: Illustrate "Take it off." LEFT panel BEFORE: the girl is sitting front-facing with raised knees and BOTH WHITE SOCKS ON HER FEET like Image 1's right panel. The generated left panel will NOT be used in the final file: we will instead copy Image 1's right half into the final left half pixel-for-pixel. RIGHT panel AFTER: the SAME girl sits front-facing at precisely the same location, same scale and same knee/foot placement as Image 1's right panel. Both of her feet are now COMPLETELY BARE, with all toes clearly visible. Both white socks have been REMOVED; she holds the two separate plain white socks in front of her UPPER CHEST, near but BELOW her chin, their ankle openings at shoulder height and their toe shapes hanging visibly downward. Hold one sock in EACH hand, side by side, with a little gap between them so it is unmistakably TWO socks rather than one white lump. The socks are far from her bare feet and do not touch the dress's tiny cat emblem if possible. She smiles at the viewer. At small size the action must be clear: socks on both feet before, socks in both hands and bare feet after.
Expression: Warm pleased smile, eyes open, natural and happy.
Objects: Exactly two plain white child-size socks, unpatterned, no logo or colored heel, no other props. In the RIGHT panel neither foot has any sock on it, even partially.
Composition: Horizontal 16:9, EXACTLY two equal panels, 400×450-equivalent each. Full seated girl within each panel, including high bun, blue scrunchie, both hands and both feet. Match Image 1's right-panel seated posture, figure size and foot baseline very closely in the generated RIGHT half. Make both feet and the two hand-held socks large and distinct. The app overlays red arrowheads around the central panel boundary x=400 at mid-height, about 18×22 CSS px each and about 31 CSS px overall, so keep that central region empty. No internal divider or arrows. Background pure solid #00FF00 green for chroma-key extraction, no visible floor or room.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not draw a sock near toes or on either foot of the RIGHT panel; do not draw a half-worn sock. Do not draw a boy, cat animal, book, blocks, towel, cup, blanket, trash bin, ball, stuffed animal, hat, box, green sock, floor, large shadow, standing pose, twisting, side-facing pose, divider, arrow, text or watermark.
```

### v2a・v2b の生成時に添付した参考画像

1. `private-prototypes/action-match/action-put-on-girl-v3a.png.webp`：丸椅子、座り方、人物の大きさ、白い靴下の基準。v2a・v2b の左コマはこの画像の右半分を画素そのままで使用。
2. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔・髪・昼服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。

### 不採用 v2a の生成プロンプト全文（v3a 右コマの元画像）

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The SAME GIRL in two equal Action Match panels, daytime indoors, in the approved pink short-sleeved dress with a tiny simplified cat-face chest emblem. Image 1 is the edit target and exact source for the left panel: action-put-on-girl-v3a. Its RIGHT half shows the required girl seated on a low light-sky-blue round backless stool, wearing both plain white socks. Image 2 is the authoritative girl identity and dress. Image 3 guides ONLY the tiny simplified chest cat mark; draw no separate cat.
Action: Depict "Take it off." LEFT BEFORE: retain the sock-wearing seated girl from Image 1's RIGHT half. This left panel is a registration reference only and will be replaced by exact source pixels in final assembly. RIGHT AFTER: draw the same girl on the same low pale-blue round stool at the same scale, same location within her panel, same seated posture and approximate 30-degree turn toward image-right. Align shoulders, waist, knees, feet and face in that natural direction without a twisted body. Both feet rest flat on the ground and are COMPLETELY BARE from toes to ankles. Show individual bare toes on BOTH feet. No sock remains on either foot. She holds TWO distinct, plain WHITE CHILDREN'S SOCKS at MID-CHEST HEIGHT, well away from her feet: one sock in EACH hand, gently held by its cuff. Both socks show recognizable cuff, heel and toe shapes, hanging down separately, so small viewers see two removed socks now in her hands. Keep the pink chest cat mark visible between the hands. Her head is uncovered; she smiles warmly.
Expression: Gentle happy smile in both moments; right face turned with the body, approximately 30 degrees toward image-right, not full profile.
Objects: Exactly the same pale-blue round stool in each panel and only the two plain white socks. No patterns, stripes, writing or colored trim on socks. No floor, background furniture or other objects. At most a tiny contact shadow under stool feet.
Composition: One 16:9 canvas with two equal 400x450-equivalent panels. The girl, stool and feet occupy similar size and position in both halves. Show full high bun, stool and both feet without cropping. Keep heads, hands, socks and feet clear of the x=400 center boundary. The app overlays a red double arrow at the center seam around mid-height, about 18x22 CSS px per arrowhead and 31 CSS px overall; leave that area empty. Do not draw the divider or arrows. Use a single pure #00FF00 green background for later alpha extraction.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not leave a sock on either foot in the RIGHT panel. Do not place either sock near toes or legs. Do not draw the girl on the ground or with raised knees, floating feet, a twisted body, an extra person or cat, books, blocks, towel, cup, blanket, bin, ball, stuffed animal, hat, box, extra furniture, divider, arrows, text or watermark.
```

### 不採用 v2b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The SAME GIRL in two equal Action Match panels, daytime indoors, in the approved pink short-sleeved dress with a tiny simplified cat-face chest emblem. Image 1 is the edit target and exact source for the left panel: action-put-on-girl-v3a. Its RIGHT half shows the required girl seated on a low light-sky-blue round backless stool, wearing both plain white socks. Image 2 is the authoritative girl identity and dress. Image 3 guides ONLY the tiny simplified chest cat mark; draw no separate cat.
Action: Depict "Take it off." LEFT BEFORE: retain the sock-wearing seated girl from Image 1's RIGHT half. This left panel is a registration reference only and will be replaced by exact source pixels in final assembly. RIGHT AFTER: draw the same girl on the same low pale-blue round stool at the same scale, same location within her panel, same seated posture and approximate 30-degree turn toward image-right. Align shoulders, waist, knees, feet and face in that natural direction without a twisted body. Both feet rest flat on the ground and are COMPLETELY BARE from toes to ankles. Show individual bare toes on BOTH feet. No sock remains on either foot. She holds TWO distinct, plain WHITE CHILDREN'S SOCKS at MID-CHEST HEIGHT, well away from her feet: one sock in EACH hand, gently held by its cuff, with her hands a little closer together in front of her chest than in the other candidate. The sock in the viewer-left hand hangs slightly HIGHER than the sock in the viewer-right hand. Both socks remain fully separate and show recognizable cuff, heel and toe shapes, so small viewers see two removed socks now in her hands. Keep the pink chest cat mark visible between the hands. Her head is uncovered; she smiles warmly.
Expression: Gentle happy smile in both moments; right face turned with the body, approximately 30 degrees toward image-right, not full profile.
Objects: Exactly the same pale-blue round stool in each panel and only the two plain white socks. No patterns, stripes, writing or colored trim on socks. No floor, background furniture or other objects. At most a tiny contact shadow under stool feet.
Composition: One 16:9 canvas with two equal 400x450-equivalent panels. The girl, stool and feet occupy similar size and position in both halves. Show full high bun, stool and both feet without cropping. Keep heads, hands, socks and feet clear of the x=400 center boundary. The app overlays a red double arrow at the center seam around mid-height, about 18x22 CSS px per arrowhead and 31 CSS px overall; leave that area empty. Do not draw the divider or arrows. Use a single pure #00FF00 green background for later alpha extraction.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not leave a sock on either foot in the RIGHT panel. Do not place either sock near toes or legs. Do not draw the girl on the ground or with raised knees, floating feet, a twisted body, an extra person or cat, books, blocks, towel, cup, blanket, bin, ball, stuffed animal, hat, box, extra furniture, divider, arrows, text or watermark.
```

### v3a・v3b の生成時に添付した参考画像

1. `private-prototypes/action-match/action-put-on-girl-v3a.png.webp`：右半分の構図、丸椅子、女の子と靴下の見た目の基準。v3a・v3b の左コマを新しく描く際に添付した。
2. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔・髪・昼服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。

### 採用 v3a の生成プロンプト全文（左コマを描き直し）

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same GIRL seated indoors in her approved pink short-sleeved daytime dress with the tiny cat-face emblem, high dark-brown bun and blue scrunchie. Image 1 (action-put-on-girl-v3a) is the base and exact composition reference: use its RIGHT half showing the girl seated on the low light-sky-blue round backless stool with BOTH PLAIN WHITE SOCKS WORN. Image 2 is her authoritative identity and outfit. Image 3 guides only the tiny cat-face emblem; do not add a separate cat.
Action: Create a two-panel Action Match illustration of "Take it off." In the LEFT BEFORE panel, keep the same girl's stool, size, location within her half, dress, hair, full-body 30-degree angle toward picture-right and BOTH fully worn white socks as in Image 1's right half. Change her action: she bends forward slightly from the hips WITHOUT TWISTING her torso, tips only her head down and LOOKS DIRECTLY AT THE SOCK ON HER NEARER FOOT (viewer-left foot). BOTH hands reach down to that same nearer ankle. Her thumb and index finger on each hand clearly PINCH THE UPPER RIM / CUFF of the sock at the ankle, as though about to pull it off. Show the actual fingers touching the sock cuff, not floating above it. The white sock remains COMPLETELY ON the foot, covering every toe, heel and ankle, not slid down even a little. The other far foot still wears its complete matching white sock. BOTH sock-covered feet remain FLAT ON THE GROUND. Calm concentrated expression with a small CLOSED-MOUTH smile, not a big open-mouth laugh. No loose sock in the left panel.
RIGHT AFTER panel is only a visual registration guide; in final assembly its pixels will be replaced with action-take-off-girl-v2a's exact right panel, showing bare feet and two socks in her hands. Do not let left-panel art cross the x=400 boundary.
Objects: Only the low light-blue round stool and two plain white socks worn on the feet in LEFT panel. The socks are solid white, no pattern, stripes, letters or colored cuffs. No room, furniture, large floor or objects from other cards.
Composition: One 16:9 canvas with two equal 400x450-equivalent halves. The app overlays a red double arrow on the center boundary at mid-height, about 18x22 CSS px per arrowhead and 31 CSS px overall. Keep face, hands, sock cuffs, stool and feet fully inside each half and away from the center arrow area. Show both hands at the nearer ankle visibly, while the girl's face stays large enough to see her downward gaze. No divider or arrows drawn in the image. Pure #00FF00 chroma-green background.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not expose bare toes or skin below either sock cuff in the LEFT panel. Do not remove, roll down, or hold a loose sock. Do not place hands away from the near sock cuff. No floor sitting, spread legs, raised knees, twisting, sideways profile, lifted foot, extra people, separate cat, books, blocks, towel, cup, blanket, bin, ball, stuffed animal, hat, box, divider, arrow, text or watermark.
```

### 不採用 v3b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same GIRL seated indoors in her approved pink short-sleeved daytime dress with the tiny cat-face emblem, high dark-brown bun and blue scrunchie. Image 1 (action-put-on-girl-v3a) is the base and exact composition reference: use its RIGHT half showing the girl seated on the low light-sky-blue round backless stool with BOTH PLAIN WHITE SOCKS WORN. Image 2 is her authoritative identity and outfit. Image 3 guides only the tiny cat-face emblem; do not add a separate cat.
Action: Create a two-panel Action Match illustration of "Take it off." In the LEFT BEFORE panel, keep the same girl's stool, size, location within her half, dress, hair, full-body 30-degree angle toward picture-right and BOTH fully worn white socks as in Image 1's right half. Change her action: she bends forward slightly from the hips WITHOUT TWISTING her torso, tips only her head down and LOOKS DIRECTLY AT THE SOCK ON HER NEARER FOOT (viewer-left foot). BOTH hands reach down to that same nearer ankle. Her thumb and index finger on each hand clearly PINCH THE UPPER RIM / CUFF of the sock at the ankle, as though about to pull it off. For this second candidate, place one hand on the front edge of that cuff and the other hand on the outer side edge, with a small visible separation between the two sets of fingers; both still grip the SAME nearer sock cuff. Show the actual fingers touching the sock cuff, not floating above it. The white sock remains COMPLETELY ON the foot, covering every toe, heel and ankle, not slid down even a little. The other far foot still wears its complete matching white sock. BOTH sock-covered feet remain FLAT ON THE GROUND. Calm concentrated expression with a small CLOSED-MOUTH smile, not a big open-mouth laugh. No loose sock in the left panel.
RIGHT AFTER panel is only a visual registration guide; in final assembly its pixels will be replaced with action-take-off-girl-v2a's exact right panel, showing bare feet and two socks in her hands. Do not let left-panel art cross the x=400 boundary.
Objects: Only the low light-blue round stool and two plain white socks worn on the feet in LEFT panel. The socks are solid white, no pattern, stripes, letters or colored cuffs. No room, furniture, large floor or objects from other cards.
Composition: One 16:9 canvas with two equal 400x450-equivalent halves. The app overlays a red double arrow on the center boundary at mid-height, about 18x22 CSS px per arrowhead and 31 CSS px overall. Keep face, hands, sock cuffs, stool and feet fully inside each half and away from the center arrow area. Show both hands at the nearer ankle visibly, while the girl's face stays large enough to see her downward gaze. No divider or arrows drawn in the image. Pure #00FF00 chroma-green background.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not expose bare toes or skin below either sock cuff in the LEFT panel. Do not remove, roll down, or hold a loose sock. Do not place hands away from the near sock cuff. No floor sitting, spread legs, raised knees, twisting, sideways profile, lifted foot, extra people, separate cat, books, blocks, towel, cup, blanket, bin, ball, stuffed animal, hat, box, divider, arrow, text or watermark.
```

## 2026-10-11 — Action Match「Put it on.」女の子版 v3a（当時採用した白い靴下の原版）

- **当時の採用画像：** `private-prototypes/action-match/action-put-on-girl-v3a.png.webp`。800×450px、透過 lossless WebP。白い靴下の原版として非公開の候補フォルダに保管。現在の公開画像は上記の色変更記録のとおり。
- **透過と合成：** 左コマは `action-put-on-girl-v2b.png.webp` を参照して緑背景（#00FF00）で描き直し、`scripts/chroma-key-green.py --edge-shrink 2` で透過、800×450pxに縮小した。右コマは v2b の右400×450pxを復号後の画素そのままで合成し、lossless WebPで保存した。右コマの全画素一致、四隅のアルファ0、中央の境目の透過を確認。淡い背景に重ねた目視確認で目立つ緑の縁や半透明の白いもやはなかった。
- **不採用（いずれも現在の保存先 `private-prototypes/action-match/` に存在）：** `action-put-on-girl-v1a.png.webp`・`action-put-on-girl-v1b.png.webp`（床に座り足を開く正面向きの旧構図）、`action-put-on-girl-v2a.png.webp`・`action-put-on-girl-v2b.png.webp`（左コマの奥の足が裸足）、`action-put-on-girl-v3b.png.webp`（奥の靴下の足首が手前の脚に少し隠れる）。
- **レビューでの決定：** 低い水色の丸椅子に座り、体を画面の右へ約30度向ける。靴下は帽子の黄、箱の茶、ボールの赤と区別できる白い無地。左コマは「奥の足に靴下をはき、手前の足は裸足、手にもう片方の靴下」、右コマは両足に靴下をはいた姿にして対応を明確にする。v3a は奥の靴下の足首まで見えるため採用。v3b は足首が少し隠れ、小さい表示では「はいている」ことが伝わりにくいため不採用。

### v2a・v2b の生成時に添付した参考画像

1. `private-prototypes/action-match/action-pick-up-boy-v1a.png.webp`：画風、人物の大きさ、2コマの構図のみ。
2. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔、髪、服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。
4. `private-prototypes/action-match/action-put-on-girl-v1a.png.webp`：白い靴下の形と色のみ。床に座る姿は写さない。

### 不採用 v2a の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same girl twice in a two-panel Action Match image, daytime indoors, approved pink short-sleeved dress with little simplified cat emblem, high dark-brown bun with blue scrunchie. Image 1 gives ONLY the two-panel layout, style and character scale, not the boy's identity or ball. Image 2 gives the girl's authoritative face, hair and dress. Image 3 gives ONLY the little chest emblem, not an actual cat. Image 4 gives ONLY the white sock shape and shading, NOT its floor-sitting posture.
Action: She sits upright on a SIMPLE SHORT LIGHT-BLUE ROUND BACKLESS STOOL. The seat is UNDER her upper thighs, not around her hips, and supports her weight. Three short stool legs are visible. Her body and face both turn only 30 degrees toward picture right, with shoulders, pelvis, knees and head facing the same direction. Her face remains mostly visible. Dress hem covers thighs and hangs over stool seat. LOWER LEGS are visible. BOTH FEET STAY ON THE GROUND THROUGHOUT, at exactly the same ground baseline as the stool legs. Her near foot is gently slid forward on its HEEL to create a little space between legs, but its heel is firmly planted, with a SMALL CONTACT SHADOW directly UNDER THE HEEL. It is not lifted.
LEFT before putting on socks: both feet completely barefoot. She holds ONE loose plain white sock with both hands above and slightly BEHIND the extended foot, clearly separate from toes and ankle. White sock is not on either foot. The sock opening points toward the extended toes, but there is a visible green gap before contact. Her eyes look down at it, calm concentration.
RIGHT after: exact same girl and stool, same scale, same posture, same feet touching ground. ONE plain white sock covers EACH foot entirely from toes to ankle. Hands resting on knees; cheerful smile.
Expression: left attentive, right delighted.
Objects: only the light sky-blue round backless stool and plain white child socks. No patterns, lettering, colored stripes or logos. Shadows only tiny contact shadows under stool feet and the girl's heels.
Composition: horizontal 16:9 image, two equally wide 400×450-equivalent panels. The girl and stool centered in each half and fully inside frame; no cropped bun, hands, stool, heels or toes. Her face size and body scale match Image 1. BOTH FEET are DOWN at the same ground baseline in EACH PANEL, rather than hovering; the extended foot is only farther forward horizontally, not higher. Keep important hands, sock, bare toes and stool away from the center panel seam x=400. The app places red triangle arrowheads over the seam at mid-height, roughly 18×22 CSS px each and 31 CSS px overall. Leave central seam region empty. No in-image divider or arrows. Plain solid #00FF00 chroma green background, no room or drawn floor.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not lift the girl's foot into the air or put a white sock on a foot in LEFT panel. Do not show her sitting on ground with splayed legs or raised knees. No green stool, backrest, twisted torso, profile face, one-legged standing pose, big floor or shadow, boy, books, blocks, towel, cup, blanket, bin, ball, stuffed animal, hat, box, furniture other than stool, separate cat, extra people, divider, arrows, text or watermark.
```

### 不採用 v2b の生成プロンプト全文（v3a 左コマの元画像）

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The SAME girl in two panels, daytime indoors, approved pink short-sleeved dress with tiny cat-face chest emblem, high dark-brown hair bun tied with blue scrunchie. Image 1 is a reference ONLY for Action Match two-panel layout, child scale, soft illustrated style; do not use the boy's blue clothes, face or ball. Image 2 is the girl's exact face, hair, dress and body reference. Image 3 guides ONLY the tiny cat emblem, not a separate pet. Image 4 guides ONLY the plain white child sock shape and shading; do not use its floor-sitting body pose.
Action: Two matching moments on one simple short BACKLESS LIGHT-BLUE ROUND STOOL per panel. The stool has a round seat and three short visible legs. Girl sits on top of the seat, not on floor; straight comfortable back. Her entire head, shoulders, hips, knees and feet coherently face about 30 degrees toward image RIGHT while her face is still mostly visible. The pink dress hem drapes over the seat, hides upper thighs, and leaves shins and feet visible. BOTH FEET HAVE THEIR HEELS DOWN, resting on an INVISIBLE GROUND LINE at the SAME VERTICAL HEIGHT AS THE STOOL LEGS. The nearer leg is simply slid forward about a child's foot length, but her knee stays low and the heel/sole rests at the same ground level; no raised or hovering foot.
LEFT BEFORE: Both feet are completely bare with visible toes. The girl holds ONE plain white sock with both hands at the height of her forward shin, a little above and just behind her forward toes, leaving a distinct green gap between the sock and the entire bare foot; sock is not worn or touching the toes. Her gaze points toward her hands and foot. RIGHT AFTER: the same stool, figure scale, body orientation, seated position and ground-level feet; both feet are entirely covered in matching plain WHITE socks through the ankles. Her hands rest on her knees; a pleased smile and eyes toward viewer. In both panels, her feet and the stool legs all stand on the SAME HORIZONTAL BASELINE near the lower part of the illustration.
Expression: Left focused gently, right cheerful.
Objects: only the small round light-blue backless stool and the plain white socks. No patterns, stripes, writing, logo or colored cuffs. Minuscule contact shadow below feet/stool legs may show ground contact, no floor.
Composition: One horizontal 16:9 image, precisely two equal 400×450-equivalent panels. Full girl and stool visible, centered within each half. Make the two foot states large enough to read when the whole image is a small Action Match card. Keep girl, hands, stool and sock well away from center seam x=400, where the app overlays red arrowheads around 18×22 CSS px each (about 31 CSS px overall). Empty chroma-green gap at seam; no drawn divider or arrows. Background solid pure #00FF00 green for later alpha extraction.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Never draw a foot raised in the air. Never draw a sock touching or covering a foot in LEFT panel. No floor-sitting, splayed knees, stool backrest, green stool, green socks, twisted torso, profile face, one-legged standing, large floor or shadow, boy, books, blocks, towel, cup, blanket, bin, ball, stuffed animal, hat, box, extra furniture, separate cat or person, divider, arrows, text or watermark.
```

### v3a・v3b の生成時に添付した参考画像

1. `private-prototypes/action-match/action-put-on-girl-v2b.png.webp`：構図の土台。右コマは最終合成でこの画像の画素に置換。
2. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔、髪、昼服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。

### 採用 v3a の生成プロンプト全文（左コマを描き直し）

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Precise edit of reference image action-put-on-girl-v2b. It is a two-panel Action Match illustration. Keep the entire RIGHT panel unchanged. In the LEFT panel, preserve the same girl, pose, expression, hands, held white sock, pink dress, hair, blue scrunchie, pale blue round stool, lighting, scale, placement, and perspective. Change only ONE FOOT: the FARTHER foot, the foot on the VIEWER'S RIGHT in the left panel, beyond the nearer leg and stool, now already wears a plain WHITE sock from toes through ankle. Match the white sock shape and white color of the right panel. Show its full white toe and white ankle cuff clearly. The NEARER foot on the VIEWER'S LEFT stays completely BARE with five visible toes. The other white sock stays in both hands near but NOT touching that bare foot; show a small clear air gap between held sock and bare toes. This depicts one sock already on and the second sock about to be put on. Keep both feet grounded and in the same positions. Do not hide the far foot. Make the far white sock, near bare foot, and hand-held white sock easy to distinguish at small display size. The character's body must not twist.

Reference attachment roles: action-put-on-girl-v2b is the exact composition and base; girl-daywear-v1 is identity and outfit; cat-mascot-v2-small is the tiny simplified chest mark only, not an extra cat. Keep the right panel as a registration reference; it will be replaced with the source pixels in the final composite. The panel border is at x=400 in the intended 800x450 output. Leave a clear empty gutter around that center boundary.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
Do not put a sock on the near viewer-left foot. Do not move or remove the held sock. Do not add any other objects. Do not add a divider or arrow.
```

### 不採用 v3b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Precise edit of reference image action-put-on-girl-v2b. It is a two-panel Action Match illustration. Keep the entire RIGHT panel unchanged. In the LEFT panel, preserve the same girl, pose, expression, hands, held white sock, pink dress, hair, blue scrunchie, pale blue round stool, lighting, scale, placement, and perspective. Make a second, subtly different candidate from the first version. Change only ONE FOOT: the FARTHER foot, the foot on the VIEWER'S RIGHT in the left panel, beyond the nearer leg and stool, now already wears a plain WHITE sock from toes through ankle. Match the white sock shape and white color of the right panel. Show the far foot's white toe prominently, with its white ankle cuff slightly more tucked behind the near leg than in the other candidate, but still clearly identifiable as a worn sock. The NEARER foot on the VIEWER'S LEFT stays completely BARE with five visible toes. The other white sock stays in both hands near but NOT touching that bare foot; show a small clear air gap between held sock and bare toes. This depicts one sock already on and the second sock about to be put on. Keep both feet grounded and in the same positions. Do not hide the far foot. Make the far white sock, near bare foot, and hand-held white sock easy to distinguish at small display size. The character's body must not twist.

Reference attachment roles: action-put-on-girl-v2b is the exact composition and base; girl-daywear-v1 is identity and outfit; cat-mascot-v2-small is the tiny simplified chest mark only, not an extra cat. Keep the right panel as a registration reference; it will be replaced with the source pixels in the final composite. The panel border is at x=400 in the intended 800x450 output. Leave a clear empty gutter around that center boundary.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
Do not put a sock on the near viewer-left foot. Do not move or remove the held sock. Do not add any other objects. Do not add a divider or arrow.
```

## 2026-10-11 — Action Match「Put it on.」女の子版 v1a（当時採用、後に不採用）

- **当時の採用画像（後に不採用）：** `private-prototypes/action-match/action-put-on-girl-v1a.png.webp`。800×450px、透過 WebP（quality 84）。緑背景（#00FF00）の生成原画を `scripts/chroma-key-green.py --edge-shrink 2` で透過し、縦横比を保って800×450pxに縮小した。透過検査は PASS（四隅のアルファ値 0/0/0/0）。淡い背景と青い背景に重ねても、目立つ緑の縁や白いもやは見つからず、中央のアプリ側の矢印が重なる部分は透過している。**後に不採用とした理由：床に座って足を開く正面向きの構図は、子ども向けの絵として避けたいため。**
- **不採用：** `action-put-on-girl-v1b.png.webp`（現在の保存先 `private-prototypes/action-match/` に存在する）。
- **レビューでの決定：** 立ったまま靴下をはくと片足立ちで体がねじれやすいため、座って靴下を足に近づける姿にした。靴下は帽子の黄色、箱の茶色、ボールの赤と区別できる白い無地にした。左コマで両足とも裸足と分かる v1a を採用した。v1b は靴下がワンピースの猫と近く、白い塊が目立ちにくいため採用しない。

### 両案に添付した参考画像

1. `private-prototypes/action-match/action-pick-up-boy-v1a.png.webp`：絵のタッチ、人物の大きさ、等幅2コマの構図の参考。男の子の顔・服は写さない。
2. `docs/characters/girl-daywear-v1.png.webp`：女の子の顔、髪（高いお団子と青いシュシュ）、昼服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：胸の小さな猫の顔の基準。

### 採用画像 v1a の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same GIRL appears once in each of two equal panels, daytime indoors. Use Image 1 only for the Action Match two-panel composition, soft colorful art style, character scale and amount of background detail; it is a BOY and must NOT influence her face, hairstyle or clothing. Image 2 is the authoritative reference for this girl's face, dark-brown hair in a HIGH BUN with a BLUE SCRUNCHIE, pink short-sleeved dress, body proportions and bare feet. Image 3 is the identity reference only for the tiny simplified cat-face mark on the dress; draw no separate cat.
Action: BEFORE and AFTER putting on plain white socks. LEFT panel BEFORE: full-body girl sitting on the ground facing the viewer, both knees bent and raised in a comfortable stable sitting posture. BOTH feet are still BARE, with all toes visible. With both hands she holds ONE loose white sock by its opening, near but NOT ON the toes of one foot; leave a clearly visible small gap between sock and bare toes. Her gaze is down toward the sock and foot. RIGHT panel AFTER: same girl sitting at the SAME horizontal position and scale, with the SAME body and leg arrangement, facing viewer; she now wears one plain WHITE SOCK on EACH foot. Both sock-covered feet are clearly visible, white fabric from toes through ankles. Hands rest lightly on knees, not holding any sock. She looks up and smiles.
Expression: LEFT calm concentration, eyes looking at sock/foot; RIGHT pleased open-eyed gentle smile.
Objects: Only the pair of plain white children's socks, no patterns, stripes, logos, colored cuffs, writing or decorations. In the LEFT panel one sock is held in her hands, the other may be beside her but never on either foot. In the RIGHT panel both socks are worn, none loose. Do not draw a floor, furniture or other objects; a tiny ground shadow directly beneath her is acceptable.
Composition: EXACTLY two equal left-to-right 400×450-equivalent panels in one 16:9 image. Same girl's identity, high bun, blue scrunchie, dress, seated position and size across both panels. Show her entire bun, knees, hands, feet and socks without cropping; the feet should be large and clear enough for a small game card. Keep the girl and socks inside each panel and well away from x=400 center seam. The app overlays red arrowheads centered on that seam at mid-height, about 18×22 CSS px each (overall Action Match center triangle about 31 CSS px); keep the entire center arrow area empty. No divider or in-image arrows. Solid pure #00FF00 chroma-green background to remove later.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not draw a boy, a separate cat, books, blocks, towel, cup, blanket, trash bin, ball, stuffed animal, hat, toy box, shelf, green socks, large floor or shadow, standing pose, lifted standing leg, twisted torso, profile-facing pose, divider, arrow, text or watermark.
```

### 不採用画像 v1b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
GIRL: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, dark brown hair in a high bun tied with a blue scrunchie. Default outfit: pink collared pajamas with a white star pattern; barefoot indoors. Approved daytime outfit: plain pink short-sleeved dress with a tiny simplified face of the usual cat on the chest; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same GIRL appears in both panels, daytime indoors, in her approved plain pink short-sleeved dress with tiny simplified cat-face emblem. She has DARK BROWN HAIR in a HIGH BUN tied with a clearly BLUE SCRUNCHIE. Image 1 is only a reference for the established Action Match 2-panel proportions, illustration style and figure scale; do not copy the boy's identity, blue shirt or ball. Image 2 is the authoritative girl identity, pink dress, hair, face and proportions. Image 3 is only the simplified shirt-cat emblem reference; no live cat.
Action: Two moments for "Put it on." LEFT BEFORE: girl sits facing viewer with both knees raised, one bare foot slightly forward and clearly visible. She holds one PLAIN WHITE SOCK open with both hands directly in front of that foot, ready to pull it over her toes, but the white sock is separated from her toes by visible empty green space; BOTH feet are BARE. Her eyes look at the toes and sock, expression quietly determined. RIGHT AFTER: the very same girl remains seated in the same spot, same front-facing torso, same size and leg position. Now both feet wear the matching solid-white socks all the way over the toes and up to the ankles. Hands relax on her bent knees. She lifts her gaze and smiles happily. The primary readable difference at small size is white socks in hands versus white socks on both feet.
Expression: attentive and gently focused on left, cheerful and satisfied on right.
Objects: Two white child-size socks total in each story moment. No colored stripes, logos, lace, letters or patterns; subtle grey contour lines are allowed to make the white socks readable. On the left, one sock is opened between the two hands, and if a second loose sock is drawn, keep it unobtrusive and away from the feet; neither sock touches or covers a foot. On the right, there are NO loose socks because one is on each foot. No other objects, only a tiny close shadow if needed to ground the seated figure.
Composition: Wide 16:9 before/after image split into EXACTLY two equal 400×450-equivalent panels, no drawn divider. Full body from high bun through sock/bare toes visible, not cropped. Keep her face about as large as the boy's face in reference Image 1, with the girl centered within each half and the hands and feet large enough to recognize at small card size. Her body and socks stay clear of the vertical center boundary x=400. The app adds red arrowheads around that boundary at mid-height, approximately 18×22 CSS px per arrowhead, about 31 CSS px overall; leave that region pure empty green. Background solid pure #00FF00 chroma green for alpha extraction. Do not draw arrow or line.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not draw a boy, separate cat, books, blocks, towels, cups, blankets, trash bin, ball, stuffed animal, hat, box, green socks, standing pose, raised standing leg, profile body, twisted torso, furniture, room, large floor, large shadow, divider, arrow, text or watermark.
```


## 2026-10-11 — Action Match「Pick it up.」男の子版（採用、アプリには未組み込み）

- **採用画像：** `private-prototypes/action-match/action-pick-up-boy-v1a.png.webp`。800×450px、透過 WebP。生成原画の緑背景（#00FF00）を `scripts/chroma-key-green.py --edge-shrink 2` で透過し、縦横比を保って800×450pxに縮小して WebP（quality 84）で保存した。透過検査は PASS（四隅のアルファ値 0/0/0/0）。緑が強く残る画素は検出されず、中央のアプリ側の矢印が重なる部分も透過している。
- **不採用：** `action-pick-up-boy-v1b.png.webp`（現在の保存先 `private-prototypes/action-match/` に存在する）。
- **レビューでの決定：** v1a は赤いボールが足の前の床に小さく置かれ、まだ床にあると分かる。右コマは `Take it off.` の右コマと同じ、正面を向いて物を胸の前に両手で持つ構図。v1b はボールが大きく、膝のあいだに入り込んで、床にあるのか手のそばなのか分かりにくいため不採用とした。

### 採用画像 v1a・不採用画像 v1b に添付した参考画像

1. `private-prototypes/action-match/action-take-off-boy-v1b.png.webp`：絵のタッチ、人物の大きさ、2コマの構図と右コマの立ち姿の参考。
2. `docs/characters/boy-daywear-v2.png.webp`：男の子の顔、髪、昼服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：Tシャツの胸の小さな猫の顔の基準。

### 採用画像 v1a の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same boy appears once in each panel, daytime indoors, wearing his approved blue short-sleeved T-shirt with the tiny simplified cat-face chest emblem and navy knee-length shorts, barefoot. Image 1 is a reference for the Action Match two-panel layout, art style, boy's scale and the RIGHT-panel front-facing pose of holding an object at chest height; do not copy the yellow hat. Image 2 is the authoritative face, short brown hair, daytime outfit and body proportions. Image 3 is only the identity reference for the tiny simplified shirt emblem; draw no separate cat.
Action: Make an EXACTLY TWO PANEL before/after illustration for "Pick it up." LEFT panel BEFORE: the boy is front-facing and squats with both feet flat on the floor, knees bent and torso naturally lowered, looking DOWN at one red ball on the floor a little in FRONT OF his bare feet. He reaches ONE hand toward the ball, fingers almost touching it; the ball is still resting on the floor, not in his hand and not beneath his foot. RIGHT panel AFTER: same boy, same horizontal position and adult-view camera angle, now standing upright, facing forward, holding the very same red ball with BOTH hands at mid-chest height, smiling warmly. The standing boy's scale matches Image 1's right panel. The left boy is shorter in the frame ONLY because he is squatting, not because his body has been scaled down. Maintain the same foot baseline and body identity across panels. Make the ball's change from ground to hands unmistakeable at small card size.
Expression: Left focused, looking at the ball; right cheerful smile looking at the viewer.
Objects: Exactly ONE plain solid-red rubber ball per panel, round, no lines, patterns, letters or gloss marks that resemble a logo. Its diameter is clearly smaller than the boy's head and can fit naturally between his two hands. Only a very small subtle shadow immediately beneath the ball in the LEFT panel; no drawn floor or large cast shadow.
Composition: One wide 16:9 image of two equally wide 400×450-equivalent panels, LEFT before and RIGHT after. Show the boy's full body including both bare feet in both panels. Keep face, reaching hand, red ball and feet inside their own panels, away from the vertical center boundary. The app overlays two red triangle arrows at the center boundary around mid-height, each about 18×22 CSS px, so leave that area empty. Do not draw divider lines or arrows. No room or furniture. Solid pure chroma-green background for later removal.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not draw books, blocks, towels, cup, blanket, trash bin, hat, toy box, stuffed animal, shelf, platform, table, other toys, a separate cat, another person, green or yellow ball, ball under foot, twisted torso, side-facing body, raised foot, room floor, large shadow, divider line or arrow.
```

### 不採用画像 v1b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same BOY in two successive moments, daytime indoors, approved plain blue short-sleeved T-shirt with a tiny simplified cat-face chest emblem, navy knee-length shorts, bare feet. Image 1 guides the established two-panel Action Match style and boy scale; its RIGHT panel guides the forward-facing posture for holding an object at chest level, but replace the hat with a red ball. Image 2 guides face, hair, approved daytime clothes and body proportions. Image 3 guides ONLY the tiny shirt emblem, not a separate cat.
Action: Show "Pick it up." in two side-by-side equal-width panels with NO dividing line. LEFT BEFORE: the boy is in a balanced low squat, shoulders and hips facing the viewer, both feet flat. He bends his knees and reaches his RIGHT hand down and slightly forward toward ONE plain RED rubber ball lying on the GROUND IN FRONT OF his feet, beyond his toes, with a clear gap so the ball is neither beneath nor touching a foot. The hand is about to grasp the ball but does not lift it; his gaze points down at it. RIGHT AFTER: he stands straight up in the SAME horizontal spot, shoulders and hips still facing the viewer, and holds the SAME red ball with both hands in front of his chest, pleased open-mouth smile. The left squatting body and right standing body have the SAME anatomy and the same height WHEN standing; left appears shorter only due to bent legs.
Expression: Attentive, intent eyes on ball in left panel; happy proud smile looking toward viewer in right panel.
Objects: One smooth uniformly red, unpatterned child-size rubber ball in each panel, smaller than the boy's head, small enough for his hands to cup around. No stripes, seams, printed symbols, words or decorative highlights. The only ground cue is a tiny soft shadow directly below the ball in the LEFT panel.
Composition: Horizontal 16:9 illustration, two equal 400×450-equivalent panels. The boy occupies approximately the same center of each panel. In the left panel the ball sits slightly forward and toward viewer's right of the boy, clearly separate from his feet and center seam. In the right panel the ball is lifted to chest height. Full body and feet visible in both panels, no cropping. Keep hands, feet, face and ball clear of the central panel boundary; at mid-height the app overlays two red triangle arrowheads, about 18×22 CSS px each, so reserve an empty green gutter there. Background pure solid #00FF00 chroma green, no scene or floor. Draw neither divider nor arrow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not draw books, blocks, towels, cup, blanket, trash bin, hat, toy box, stuffed animal, shelf, platform, table, other toys, a separate cat, another person, green or yellow ball, ball under foot, twisted torso, side-facing body, raised foot, room floor, large shadow, divider line or arrow.
```

## 2026-10-11 — Action Match「Close it.」男の子版（採用、アプリには未組み込み）

- **採用画像：** `private-prototypes/action-match/action-close-boy-v1a.png.webp`。800×450px、透過 WebP。採用済み `private-prototypes/action-match/action-open-boy-v1b.png.webp` の左右400×450pxを、デコード後の画素をそのまま入れ替えて合成した。新しい画像生成は使っていない。入れ替え後の各コマを合成元と照合し、両方とも画素一致した。透過は、元画像の緑背景（#00FF00）を `scripts/chroma-key-green.py --edge-shrink 2` で除去したアルファをそのまま引き継いだ。四隅のアルファ値は0/0/0/0。
- **lossless WebP の理由：** 画素を再圧縮で変えず、左右コマが元画像と一致することを保証するため。元の `action-open-boy-v1b.png.webp` は41,152バイト、採用画像は173,436バイト。公開アプリには未組み込みなので、公開用画像の容量は変わらない。
- **不採用：** `action-close-boy-v1b.png.webp`（現在の保存先 `private-prototypes/action-match/` に存在する）。
- **レビューでの決定：** v1b は右コマの顔を満足そうな小さな笑顔に編集したが、v1a との表情の違いが小さく、編集する理由がないため採用しない。

### 不採用 v1b の添付画像と編集・透過の由来

1. `private-prototypes/action-match/action-close-boy-v1a.png.webp`：編集対象。左コマと右コマの顔以外は最終画像でもこの画素を使用。
2. `private-prototypes/action-match/action-open-boy-v1b.png.webp`：男の子の顔・色・絵のタッチの参考。

v1b は画像生成による顔の編集を2回試し、2回目の結果から右コマの顔の領域のみを v1a に合成した。左コマと顔以外の画素、背景の透過アルファは v1a から保持した。v1b も800×450pxの lossless 透過 WebP だが、上記の理由で不採用。

### 不採用 v1b の編集プロンプト全文（最初の試行）

```text
Use case: precise-object-edit
Asset type: Action Match two-panel children's game illustration.
Input images: Image 1 is the exact edit target, the 800×450 transparent two-panel "Close it." image. Image 2 is the approved "Open it." illustration for the boy's identity, art style, and colors only.
Primary request: Change ONLY the expression on the face of the boy in the RIGHT panel (the panel with the toy chest already CLOSED). Give him a satisfied, content little CLOSED-MOUTH smile after closing the lid: gently upturned mouth corners and a pleased relaxed gaze. Keep his head shape, hair, eye size and positions, ears, skin tone, neck, head angle and gaze toward the closed box otherwise unchanged. No anger, worry, tears or big open-mouth laugh.
Invariants: The LEFT panel must remain absolutely unchanged. Within the RIGHT panel, do not redraw or move anything except the expression inside the facial oval: body, arms, hands, shirt and tiny cat emblem, shorts, legs, feet, the closed wooden chest, lid, shadows, positions, scale, layout, and empty center gutter must remain unchanged. Preserve the 800×450 two-panel framing and original fully transparent background/alpha; no green background, no new objects, no text, no divider or arrow. The result must be suitable for surgically compositing only the RIGHT boy's face region back over Image 1 so every pixel outside the face stays exact.
```

### 不採用 v1b の編集プロンプト全文（最終合成に使用した試行）

```text
Use case: precise-object-edit
Asset type: a transparent two-panel Action Match game image.
Input images: Image 1 is the edit target, the exact "Close it." composite. Image 2 is the approved "Open it." reference for boy identity and color/style only.
Change only the RIGHT boy's facial expression in the CLOSED-CHEST panel. Make him visibly but gently SATISFIED that he finished closing the lid: mouth stays small and CLOSED, both mouth corners lifted a little more than in Image 1, subtle rounded happy cheeks, eyes slightly softened/narrowed into a content look while still open. This must look different from Image 1's neutral little smile, but not a big grin, not open-mouth laughing, not sleepy. Keep him looking toward the closed chest. Preserve the same face identity, oval/head outline, hair, ears, brow position, nose, skin tone, head angle, and all body proportions.
Strict invariants: Do not change a single thing in the LEFT panel. Do not change right panel outside the inner face. Preserve the boy's body, arms, shirt and cat emblem, shorts, feet, wooden box, closed lid, placement, size, transparent background, and empty center seam. No anger, worry, crying, open mouth, extra objects, text, arrows, or divider. Output the whole image with the same framing, even though only the right facial features should be modified.
```

## 2026-10-11 — Action Match「Open it.」男の子版（採用、アプリには未組み込み）

- **採用画像：** `private-prototypes/action-match/action-open-boy-v1b.png.webp`。800×450px、透過 WebP（quality 84）。緑背景（#00FF00）の生成原画を `scripts/chroma-key-green.py --edge-shrink 2` で透過し、縦横比を保って800×450pxに縮小した。`tests/check-image-alpha.mjs` は PASS（四隅のアルファ値 0/0/0/0）。淡い背景に重ねた目視確認で目立つ緑の縁・半透明の白いもやは見つからず、不透明・半透明画素に緑が強く残る画素もなかった。
- **レビューでの決定：** 採用 v1b は箱をひざ程度の高さにおさめ、おもちゃ箱として読める構図にした。v1a は箱が腰に近い高さで棚と取り違えるおそれがあるため採用しない。
- **不採用：** `action-open-boy-v1a.png.webp`。現在の保存先 `private-prototypes/action-match/` に存在する。

### 採用画像 v1b の添付画像

1. `private-prototypes/action-match/action-take-off-boy-v1b.png.webp`：絵のタッチ、人物の大きさ、2コマの構図の参考。
2. `docs/characters/boy-daywear-v2.png.webp`：男の子の顔、髪、昼服の基準。
3. `docs/characters/cat-mascot-v2-small.png.webp`：Tシャツの胸の猫の顔の基準。

### 採用画像 v1b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy only, daytime indoors, approved daytime blue T-shirt and navy knee-length shorts, barefoot. Reference Image 1 is style and full-body scale for the 2-panel Action Match illustration, not content to copy. Reference Image 2 is the boy's face, hairstyle and clothes. Reference Image 3 is only the tiny simplified cat emblem on his shirt.
Action: Two equal before/after panels for opening a small toy chest. Same full-body front-facing boy standing next to same toy chest, with same ground line and same size in both panels. He is about THREE TIMES TALLER than the CLOSED chest. The CLOSED chest top is NO HIGHER THAN his knees. It is a single plain light-brown wood box with flat hinged top, no other furniture. LEFT panel before: closed flat lid, the boy lightly grips the front edge with BOTH hands; focused little smile. RIGHT panel after: the exact same small box, in the exact same spot; its ONLY lid rotates up on the REAR hinge to a near-vertical open position. Boy holds the upright lid with one hand, peeks into DARK EMPTY box and smiles gently. Draw the boy so his entire head, shirt, shorts, legs and bare feet remain visible; box to one side, not in front of boy or obscuring him. The lid is clearly closed left and clearly open right, readable small.
Expression: Calm anticipation on left, happy discovery on right, eyes toward box on right.
Objects: Only the small wooden chest with no contents, pattern or lettering. Same rectangular geometry in both panels.
Composition: Wide horizontal 16:9; two equal 400×450-equivalent panels. Within EACH panel, boy occupies one side and small chest the other, without overlap. Boy roughly 350 units tall within 450; closed chest roughly 110 units tall within 450, its top exactly near the boy's knees. Keep exact same character and box scale/location in both panels. Leave a clear gap around the center seam, because the app overlays a 31 CSS px triangle there. Absolutely no image-internal arrows or divider lines. Solid uniform pure green background for later chroma key. No room or floor drawn.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Additional exclusions: No oversized chest, no chest in front of boy, no contents or toys, no blocks, balls, stuffed animals, books, hat, towel, cup, blanket, bin, drawer, furniture doors, cat animal, other people, twisting or turning, green chest, divider, arrow, text or watermark.
```

## 2026-10-11 — Action Match 帽子の2動詞・男の子版（採用、アプリには未組み込み）

- **Put it on.：** `private-prototypes/action-match/action-put-on-boy-v3b.png.webp`（最終採用、アプリには未組み込み）。800×450px、透過 WebP。緑背景の生成原画を `scripts/chroma-key-green.py --edge-shrink 1` で透過し、縦横比を保って左コマを400×450pxに配置した。右コマは下記 v1a の右半分を画素そのままで合成し、画素一致を確認するため lossless WebP で保存。四隅のアルファ値は0、目立つ緑縁・半透明のもやは見つからなかった。
- **Take it off.：** `private-prototypes/action-match/action-take-off-boy-v1b.png.webp`（採用、アプリには未組み込み）。800×450px、透過 WebP。緑背景の生成原画を同じ `--edge-shrink 1` で透過し、縦横比を保って右コマを400×450pxに配置した。左コマは v1a の右半分を画素そのままで合成し、画素一致を確認するため lossless WebP で保存。四隅のアルファ値は0、目立つ緑縁・半透明のもやは見つからなかった。
- **共通の合成元：** `private-prototypes/action-match/action-put-on-boy-v1a.png.webp` の右半分は、正面を向いて黄色い帽子をかぶった男の子。Put it on. では完成後の右コマ、Take it off. では動作前の左コマとして使用する。v1a の左コマ（帽子を頭上に持ち上げた姿）は最終採用していない。
- **レビューでの決定：** 頭上に帽子を持ち上げる姿は「かぶる」とも「ぬぐ」とも読めるため、Put it on. の左コマは、フックの帽子に手を伸ばす斜め後ろ向きの姿にした。帽子がボールに見えないよう、横からつばが見える向きにした。Take it off. の右コマをフックへ帽子を戻す絵にすると Put it on. の左右を入れ替えただけになるため、正面を向き、胸の前で帽子を両手に持つ姿にした。
- **不採用：** `action-put-on-boy-v1b.png.webp`（現在の保存先 `private-prototypes/action-match/` には存在しない）、`action-put-on-boy-v2a.png.webp`、`action-put-on-boy-v2b.png.webp`、`action-put-on-boy-v3a.png.webp`、`action-take-off-boy-v1a.png.webp`。

### Put it on. 採用画像 v3b の添付画像

1. 直前の v3a 左コマの生成原画 `/Users/y.komon/.codex/generated_images/01a09c8c-f410-7831-9c4c-50d2efa2ffc2/exec-56ff4b98-a560-4e5c-8108-9cdc88bcb84e.png`：絵のタッチと構図の参考。ほぼ後ろ向きの姿勢は写さない。
2. `private-prototypes/action-match/action-put-on-boy-v1a.png.webp`：帽子・男の子の大きさと、最終右コマの画素の基準。
3. `docs/characters/boy-daywear-v2.png.webp`：昼服、髪、体型の基準。
4. `docs/characters/word-target-boy-v1.png.webp`：人物の基準。
5. `docs/characters/cat-mascot-v2-small.png.webp`：胸の猫の印の基準（左コマの背中には描かない）。

### Take it off. 採用画像 v1b の添付画像

1. `private-prototypes/action-match/action-put-on-boy-v1a.png.webp`：帽子の形、男の子の大きさと、最終左コマの画素の基準。
2. `docs/characters/boy-daywear-v2.png.webp`：昼服と正面全身の基準。
3. `docs/characters/word-target-boy-v1.png.webp`：人物の基準。
4. `docs/characters/bathroom-stage-v5.jpg.webp`：人物の補助基準。
5. `docs/characters/cat-mascot-v2-small.png.webp`：胸の猫の印の基準。

### 合成元 v1a の添付画像

`action-put-boy-v5.png.webp`（Action Match の等幅2コマ・タッチ・大きさ）、`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の猫の印）、`docs/characters/word-target-boy-v1.png.webp` と `docs/characters/bathroom-stage-v5.jpg.webp`（人物の補助基準）。

### 合成元 v1a の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same BOY appears once in each panel, in his approved daytime outfit, indoors and barefoot. Image 1 (action-put-boy-v5.png.webp) is ONLY the reference for two equal panels, boy scale, drawing style, and restrained background detail; do not copy its blue star pajamas, red block, stool, or action. Image 2 (boy-daywear-v2.png.webp) is the authoritative face, hair, daytime outfit and full-body proportions. Image 3 (cat-mascot-v2-small.png.webp) is ONLY the identity reference for the tiny simplified cat-face emblem on the T-shirt, not a separate cat. Images 4 (word-target-boy-v1.png.webp) and 5 (bathroom-stage-v5.jpg.webp) are supplementary boy identity references; do not copy their pajamas or room objects.
Action: EXACTLY TWO sequential equal-width panels, left BEFORE and right AFTER putting on a hat. LEFT: boy stands front-facing, feet still, holding one yellow hat with both hands directly above his head, ready to put it on; the hat is NOT touching the head and a clearly visible gap of about one tenth of head height separates hat and hair. RIGHT: same boy stands in exactly the same place at the same scale and facing angle; the same hat is fully and firmly worn on his head, with its brim clearly visible; both hands rest naturally down by his sides. No other movement.
Expression: Left attentive and gently eager, right a warm small smile. Keep his facial identity the same in both panels.
Objects: Exactly one simple yellow Japanese preschool commuting-style hat per panel: round crown and a clearly visible rounded brim, no pattern, badge, writing, or logo. Hat size and color match across panels. No other objects.
Composition: One horizontal Action Match image, final 800x450px (16:9), divided conceptually into two equal 400px-wide panels. Same standing position, body size, shoulders, feet and simple frontal pose in each panel; characters fully visible and large enough that the hat-on versus hat-off difference reads at small card size. Keep the boy near the center of EACH panel, not near the boundary. Leave a completely empty gutter around the x=400px panel boundary so the app can overlay its red double arrows there (about 38x22 CSS px centered on the boundary); keep all faces, hands and hat clear of this area and away from the card's rounded edges. The app also overlays a thin card border, but no labels on the image. Keep the important hat action in the upper 80% and show the feet without cropping. Only very minimal grounding; no room furniture or background scene.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.

Do not draw books, blocks, towel, cup, blanket, trash bin, ball, teddy bear, toy box, a separate cat, other people, hat held behind or beside the head, twisted torso, side view, large steps, divider line or arrow.
```

### Put it on. 採用画像 v3b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: The same boy as the references, indoors in the approved daytime blue short-sleeved shirt and navy shorts, barefoot. Only one boy in each panel.
Action: Create a two-panel before/after illustration for "Put it on." In the LEFT panel ONLY, redraw the boy from a 70-DEGREE rear-to-side profile, clearly MORE SIDE-ON than Image 1. The viewer sees the boy's right side and only the rear third of his back, not a mostly rear view. His nose is hidden behind the cheek contour, and no eye or mouth is visible: he faces a hook toward the LEFT. The viewer sees his back and the RIGHT SIDE of his body. His shoulder line, shirt, hips, both legs, feet, neck and head all face the same diagonal-left direction with no twist. Only a sliver of rounded cheek and one ear may be visible; neither eye nor mouth is visible. One hand reaches to lightly touch the BRIM of a yellow hat that is still hanging on a hook, without covering the hat. Both feet flat; no tiptoeing. The hat is not on or over the boy's head. The RIGHT panel is a visual guide only: the original right panel of image 2 showing the boy front-facing, wearing the yellow hat and smiling. The generated right panel will be discarded; the right 400×450 pixels from image 2 will be inserted unchanged.
Expression: No visible facial expression in the LEFT panel; head stays aligned with the rest of the body.
Objects: Exactly one yellow rounded school hat matching image 2's right hat. Show the hat in clear SIDE PROFILE with a broad BRIM projecting horizontally to the LEFT and a dome above it, not the top/crown view that resembles a ball. The hat hangs from a small loop at the rear of the crown so the wooden board and single round hook remain unobscured. It hangs from exactly ONE round hook on ONE small wooden board. The board and round hook remain visibly exposed, not hidden behind the hat. No wall is drawn; only the board and hook appear against green. No other objects.
Composition: Two equal-width panels across a wide 16:9 image. Match the height and size of the boy in image 2's RIGHT panel, and align the bottoms of his bare feet. In LEFT, his torso is turned as a single rigid unit toward the left: the front shirt surface stays hidden, the right shoulder projects toward the viewer, and the right hip and right foot follow the SAME angle. This is a rear-side profile, not the back view of image 1. The boy is toward the center of the LEFT panel; the hat and board are farther LEFT, at a height he can reach without stretching or lifting his feet. Leave a clear, unmistakable green gap between his hair and the hat. Keep the central boundary clear because the app overlays two red arrowheads there at mid-height, each about 18×22 CSS px. No panel divider or in-image arrow. Image 1 is the previous left-panel variant; use it ONLY as style and composition reference. Do not copy its mostly rear-facing pose. Rotate the entire boy leftward by about 25 more degrees to reveal significantly more right-side profile, without showing his face or the front cat emblem. Make the hat brim more clearly horizontal. Smooth the boy's short hair, reducing spiky/shaggy volume to match the right boy in image 2. Image 2 is the exact source for final right-panel pixels and reference for boy scale, clothes and hat; do not copy its LEFT lifted-hat pose. Image 3 is the approved daytime body and hair reference. Image 4 is boy identity reference. Image 5 is cat emblem reference; no cat is drawn on the back of the LEFT boy's shirt.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

### Take it off. 採用画像 v1b の生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy, indoors in his approved daytime blue short-sleeved T-shirt with the small simplified cat-face emblem, navy knee-length shorts, and bare feet.
Action: A two-panel Action Match image for "Take it off." In the LEFT panel, show the front-facing boy wearing the yellow hat, standing still, exactly as in the RIGHT HALF of Image 1. This LEFT panel is only a generation guide; the final image will use those original Image 1 pixels without changes. In the RIGHT panel ONLY, newly draw the SAME boy standing in the same position, same size, same front-facing pose and foot baseline. He has REMOVED the hat; his brown short hair is fully uncovered. He holds that one hat with BOTH hands at LOWER CHEST height, clearly far below and separated from his head. His hands hold the two sides of the brim, but the hat is rotated about 30 degrees to HIS LEFT, showing both its rounded crown and the brim in clear three-quarter profile. The brim projects diagonally outward; both hands and the hat silhouette are fully visible. His body is upright, not twisted, with no extra gesture.
Expression: Small cheerful open-mouth smile in the RIGHT panel, looking at the viewer. Same face and hair as the references.
Objects: Exactly one yellow rounded child's school hat matching Image 1, now in the boy's hands in the RIGHT panel. The cap is in a stronger three-quarter SIDE view than a face-on symmetrical view, with the projecting curved brim clearly visible; do not show only the top of the crown. No wall, hook, shelf, room, or other item.
Composition: Wide 16:9 two-panel illustration with equal-width panels. Match the boy's height, overall scale and foot position to the hat-wearing boy in Image 1's RIGHT half. Hold the hat slightly to the boy's own left side at lower-chest height, while still in front of his torso and well below his chin; keep it clearly away from the head and not so large that it hides his entire torso; allow the tiny shirt emblem to peek above or beside the hat if possible. Leave the boundary between panels clear because the app overlays two red arrowheads there at mid-height, each about 18×22 CSS px. No in-image divider or arrow. Image 1 is the exact pixel source for the final LEFT panel and the reference for hat shape, boy size, and style. Image 2 is the approved daytime full-body reference; Images 3 and 4 are boy identity references; Image 5 is the cat emblem reference.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-04 — Think & Say 右の絵：外へ出る・ジャングルジム・ねむい（承認済み・採用）

- 所有者が `private-prototypes/think-say-go-outside-boy-v4.png.webp`、`private-prototypes/think-say-climb-boy-v1.png.webp`、`private-prototypes/think-say-sleepy-boy-v1.png.webp` を承認した。3枚とも 512×512px の透過 WebP（quality 84）。本体には未組み込み。
- 3枚とも緑背景（#00FF00）で生成し、`scripts/chroma-key-green.py --edge-shrink 1` で透過した。`tests/check-image-alpha.mjs` は3枚とも PASS（四隅0/0/0/0）。髪の輪郭と、外の木・ジャングルジムの草を拡大確認し、緑の縁や欠けは見つからなかった。
- 不採用 `think-say-go-outside-boy-v1.png.webp`：ドアと枠が宙に浮き、壁と床がなかったため、家の中から外へ出る場面だと伝わらなかった。
- 不採用 `think-say-go-outside-boy-v2.png.webp`：壁と床を追加した版だが、男の子の上半身は室内側を向いてドアノブを握り、下半身は外へ歩いていて、向きが逆になった。壁なしの初稿を直す途中の候補として不採用。
- 不採用 `think-say-go-outside-boy-v3.png.webp`：体は外へ向いたが、ほぼ背中を見せたまま顔だけ正面へ大きく振り返り、首が回りすぎて不自然だった。v2 で指摘された上半身・下半身の向きの不一致を解消するための修正版だったが、採用しない。
- 採用 v4：体・顔ともに外へ進む横向きの歩き姿。胸の猫の印は横向きのため見えなくてもよい。ドアノブは握らず、壁・床・ドア・外の景色は維持した。

### `think-say-go-outside-boy-v4.png.webp`（採用）

添付した画像：初回の壁・床つき生成では `docs/characters/boy-daywear-v2.png.webp`、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`、ユーザー提供の `スクリーンショット 2026-10-04 19.08.59.png`（構図の参考のみ）。ドア修正では初回生成の緑背景画像（保存ファイル名なし）、v3への姿勢修正では `private-prototypes/think-say-go-outside-boy-v2-green-original.png`、v4への修正では `private-prototypes/think-say-go-outside-boy-v3-green-original.png` を編集対象として添付した。

#### 壁・床つきの初回生成プロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, daytime, viewed from INSIDE the home at the front entrance. He wears his approved plain blue short-sleeved T-shirt with a tiny simplified usual cat-face emblem, navy knee-length shorts and WHITE SNEAKERS. Reference image 1 boy-daywear-v2.png.webp fixes the boy's identity, face, swept brown hair and daytime outfit; change only bare feet to white sneakers. Reference image 2 word-target-boy-v1.png.webp reinforces the same face and picture-book style, NOT pajamas. Reference image 3 cat-mascot-v2-small.png.webp is only for the tiny chest emblem. Reference image 4 (the user-supplied doorway screenshot) is ONLY a composition reference for a wall-attached open door and someone stepping through it. Do NOT copy its girl, ponytail, yellow shirt, window, furniture, or whole-room background.
Action: The boy is mid-step THROUGH an OPEN front door, leaving the house. His torso, hips and leading white sneaker move toward the bright outdoors, while his head turns slightly back toward the viewer with a happy excited smile. One hand may touch the open door or frame; his hands hold nothing. Make the travel direction unmistakably from inside to outside, not entering the home.
Expression: Excited and eager to go out, face partly visible as he looks back.
Objects: A SIMPLE LIGHT-COLORED interior wall SECTION with a visible edge, and a SMALL connected indoor floor SECTION. The open front door is physically HINGED TO THAT WALL, set in a doorframe and threshold; it must NOT be a freestanding floating door or detached frame. Beyond the doorway show bright blue sky, white cloud, a simple path leading away, and one tree. No window, cabinet, table, shoes rack, furniture, toy, held object, text or logo. Outside foliage and any tiny grass are deep muted dark green/teal (#245E46), never near pure chroma #00FF00.
Composition: TRUE SQUARE 1:1 canvas for final 512x512px Think & Say right-side illustration. Make a compact CUTOUT STAGE: only a partial light wall panel with the attached door and a small floor piece, with pure green #00FF00 CHROMA BACKDROP VISIBLE ALL AROUND its outer silhouette. Do not fill the square with a complete room or a large rectangular background. The boy, doorway and outdoor view must all read clearly at 147 CSS px. Show the boy's full body including both white sneakers, no cropping or stretching. Keep head, feet and action away from the rounded square frame corners. The app places no overlay over the artwork; its card slot is separate below.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

#### ガラス窓を木製板へ変更した追加指示全文

```text
Use case: precise-object-edit. Edit only the FIRST attached green-background illustration. Keep the EXACT same boy (face, hair, blue short-sleeved cat-emblem shirt, navy shorts, white sneakers, expression and walking-out pose), exact wall, floor, door position and opening, outdoor sky, cloud, path, tree, framing, drawing style, and PURE FLAT #00FF00 chroma-green outside the cutout. Change ONLY the open door's upper blue glass pane into a plain solid WOOD panel in the same warm wood color and shading as the rest of the door. There must be NO glass window and NO window anywhere. Keep door handle, hinges and all other parts unchanged. No new objects, text, furniture or people.
```

#### v3 に向けた体の向きの追加指示全文

```text
Use case: precise-object-edit. Edit the FIRST attached green-background illustration. Preserve the same approved boy identity (brown swept hair, face, age), blue short-sleeved T-shirt with tiny cat-face emblem, navy shorts, WHITE SNEAKERS, art style, pure flat #00FF00 green outer background, partial light interior wall and short floor, fully open solid-wood door attached to the wall, bright sky/cloud/path/dark-green tree outside, and square framing. Change ONLY the boy's BODY POSE and head orientation. The door is already wide open and he does NOT touch or grip the door knob, door, or frame; BOTH HANDS are visibly away from the handle. Show him walking OUT through the doorway in a consistent SIDE VIEW or slightly rear three-quarter view: shoulders, CHEST, waist, hips, knees and BOTH FEET all face the SAME outward direction toward the path beyond the door, with one white sneaker stepping across the threshold. His arms swing naturally with the walking motion, one a little forward and one a little back. ONLY HIS HEAD turns slightly back OVER HIS SHOULDER toward the viewer, showing a cheerful, excited partial face. Do not rotate his chest or shirt front toward the viewer; no twisted torso and no forward-facing upper body attached to outward-facing legs. Keep the door panel opaque wood, with NO glass window, and add no furniture, other people, text or objects. This is a precise pose correction, not a new scene.
```

#### 採用 v4 に向けた横向き姿勢の追加指示全文

```text
Use case: precise-object-edit. Edit the attached green-background illustration as the TARGET. Keep the exact same bright children's picture-book art style and the SAME partial pale indoor wall and wood floor cutout, door frame and threshold, fully open solid wooden door with no window, blue sky, clouds, path and tree outside, pure flat #00FF00 green around the cutout, square composition. Keep the same small brown-haired boy in a plain blue short-sleeved daytime shirt and navy shorts with WHITE SNEAKERS. Change ONLY the boy's pose and orientation. He is walking OUT to the right through the doorway. Depict his WHOLE BODY IN A TRUE SIDE PROFILE, seen from his left side: shoulders, chest, pelvis, legs, both sneakers and nose ALL point toward the outdoor path on image-right. His near shoulder and near side of the shirt face the viewer; avoid a rear/back view. Let his head stay in the same profile direction as his chest, with at most a subtle 30–45 degree glance toward the viewer, NOT looking backward over a shoulder. Show a cheerful expression with a small open smile and lively visible eye in profile. Both arms swing naturally while walking and are far away from the doorknob and door; he does not hold anything. Chest cat emblem may be hidden by the side view. Anatomical priority: the neck connects naturally to shoulders; face and body orientations match; no head twisted 180 degrees and no face looking directly at viewer while back is visible. Keep the boy full-body and large enough to read at 147px. No new objects, no text.
```

### `think-say-climb-boy-v1.png.webp`（採用）

添付した画像：`docs/characters/boy-daywear-v2.png.webp`、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`。

#### 使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, daytime outdoor play, in his approved blue short-sleeved shirt with tiny simplified cat-face emblem, navy knee-length shorts, and WHITE SNEAKERS. Reference image 1 (boy-daywear-v2.png.webp) defines his exact identity, face, hair and daytime clothing; replace only bare feet with white sneakers. Reference image 2 (word-target-boy-v1.png.webp) reinforces face, hair and art style, not pajamas. Reference image 3 (cat-mascot-v2-small.png.webp) defines only the tiny chest emblem.
Action: He is actively CLIMBING a simple three-dimensional jungle gym of horizontal and vertical metal bars, near its top, both hands tightly gripping separate upper bars and both white-sneakered feet supported on lower rungs. His body is above the middle of the structure, with several visible tiers of bars extending below him, unmistakably showing height. Do not make it a ladder, swing, slide, or plain railing.
Expression: Happy and quietly proud of climbing high, looking outward with a delighted confident face.
Objects: Exactly one colorful children's jungle gym made of red, blue, yellow and orange painted metal bars. Simple open cubic grid with visible crossbars and vertical tiers, large enough to recognize at 147 CSS px. No other people or objects. No sky or scenic background. At most a tiny patch of dark muted teal-green grass (#245E46) directly at the base, far from chroma green #00FF00; do not use bright green or lime on the bars or any object.
Composition: A true square Think & Say right-side illustration for final 512x512px. Make the boy large and clearly near the TOP of the jungle gym, while enough of the structure's lower grid remains visible to show he climbed high. Keep the full boy, both hands and white shoes within the square, not cropped or stretched. The app places no overlay over this artwork; only its separate frame has rounded corners, so avoid important parts in the corners. Background outside the depicted equipment is pure flat #00FF00 green for chroma removal; minimal ground shadow only.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

### `think-say-sleepy-boy-v1.png.webp`（採用）

添付した画像：`docs/characters/word-target-boy-v1.png.webp`。

#### 使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, a sleepy evening or bedtime indoor moment. He wears his approved blue COLLARED long-sleeved pajamas with white star pattern and white piping on the collar and cuffs, barefoot. The attached word-target-boy-v1.png.webp is the authoritative reference for the boy's exact face, swept brown hair, pajamas, age and picture-book art style. Do not copy its waving pose.
Action: He rubs ONE EYE with one hand while giving a large, unmistakable yawn. His other arm hangs relaxed. His shoulders droop slightly with drowsiness, but he remains upright. He holds nothing.
Expression: Half-closed droopy sleepy eyes, mouth wide open in a clear yawn, heavy eyelids. Not laughing, not crying, not ill or in pain.
Objects: None. No pillow, teddy bear, bed, furniture, food, symbols or text.
Composition: Square Think & Say right-side illustration for final 512x512px. Show the boy from waist up, large and centered, with the rubbing hand, sleepy half-closed eyes and open yawning mouth clearly readable at 147 CSS px. Keep the whole head and hand inside the frame with safe margins at rounded corners. No app-rendered overlay covers the illustration; the card slot is below, separate. Background is flat pure #00FF00 green for later transparency. No floor shadow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-04 — Think & Say 室内・昼服の男の子の右の絵5枚（承認済み・採用）

- 所有者が `think-say-happy-boy-v1`（笑い目への編集後）、`think-say-play-blocks-boy-v1`、`think-say-build-tower-boy-v1`、`think-say-clean-up-boy-v1`、`think-say-socks-boy-v1` を承認した。候補はすべて `private-prototypes/` にあり、512×512px。本体には未組み込み。
- `put on my socks` の確認事項：くつしたのつま先が画像の左下の角で切れている。アプリの角の丸い枠でさらに隠れて気になる場合は、引きの構図で描き直す。

### `think-say-happy-boy-v1.png.webp`（採用）

- 採用画像：`private-prototypes/think-say-happy-boy-v1.png.webp`。初稿の目を開けた笑顔は、ほかの身ぶり（やりたい・指さす・誘う）と同じ顔に見え、「うれしい」が特別に伝わらなかったため、ポーズ・服・髪型を保ったまま弓なりの笑い目へ編集した。

添付した画像：`docs/characters/boy-daywear-v2.png.webp`、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`。表情編集時は初稿の生成画像（保存ファイル名なし）、`docs/characters/boy-daywear-v2.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`。

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy, daytime indoors, wearing the approved blue short-sleeved cat-emblem T-shirt and navy shorts, barefoot. Use boy-daywear-v2 for his exact face, hair and clothing; word-target-boy-v1 only for consistent face and art style, not its pajamas; cat-mascot-v2-small only for the tiny chest emblem.
Action: He springs upward in a joyful little jump, both arms raised high above his head. Both bare feet are just off the ground. He holds nothing.
Expression: Unmistakable delighted "yay!" happiness, a broad genuine smile; eyes may narrow with joy.
Objects: None. No toys, props, lettering, or symbols.
Composition: One large centered full-body boy in a square 512x512 asset, head, raised hands and bare feet fully within frame; energetic silhouette and facial expression read clearly at 147 CSS px. The app displays this in a rounded square illustration frame, with no overlay over the artwork; leave safe corner margins. Background must be flat pure green for later chroma removal, with almost no floor shadow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

表情のみの追加編集指示全文（初稿の生成画像、boy-daywear-v2、cat-mascot-v2-small を添付）:

```text
Edit the FIRST attached image only. Keep the exact same illustrated boy, same airborne jumping pose, both arms and hands raised, same limb positions, blue short-sleeved cat-emblem T-shirt, navy shorts, bare feet, hair, framing, pure green #00FF00 backdrop, and art style. Change ONLY his facial expression: both eyes closed as clear upward-arching cheerful smiling eye curves, like the Japanese picture-book "^^" happy expression; mouth wide open in a big delighted full smile. This should read as uniquely joyful, not the open-eyed excited expression of the current image. Keep the face shape and head angle identical. Do not add or remove any other object. The other attached images are identity/emblem references only.
```

### `think-say-play-blocks-boy-v1.png.webp`（採用）

- 採用画像：`private-prototypes/think-say-play-blocks-boy-v1.png.webp`。

添付した画像：`docs/characters/boy-daywear-v2.png.webp`、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`、`private-prototypes/think-say-blocks-v2.png.webp`。

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy, daytime indoors, wearing the approved blue short-sleeved cat-emblem T-shirt and navy shorts, barefoot. Use boy-daywear-v2 for his exact face, hair and clothing; word-target-boy-v1 for face and art style, not pajamas; cat-mascot-v2-small only for the tiny chest emblem. The attached think-say-blocks-v2 defines the blocks' exact colors and simple motifs, not the composition.
Action: Seated on the floor, smiling and playing with scattered toy blocks. He holds exactly one loose block in both hands in front of him, examining and moving it. Several other loose blocks rest separately on the floor near him. No stacked blocks, no tower.
Expression: Happy, absorbed in play, eyes looking at the block he holds.
Objects: A few easy-to-read toy blocks in red, yellow, blue, orange and purple with small heart, sun, star, flower and moon motifs as in the attached block reference. Absolutely no green blocks. No box, furniture, lettering or symbols beyond the approved block motifs.
Composition: Single square 512x512 illustration; seated boy large and central, his hands and the one held block especially legible at 147 CSS px; the loose blocks visibly scattered, not forming any stack. Full boy and blocks within frame with empty safe corners. App displays this image in a rounded illustration frame and overlays nothing on the artwork. Flat pure green background for chroma removal; minimal floor shadow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

### `think-say-build-tower-boy-v1.png.webp`（採用）

- 採用画像：`private-prototypes/think-say-build-tower-boy-v1.png.webp`。

添付した画像：`docs/characters/boy-daywear-v2.png.webp`、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`、`private-prototypes/think-say-blocks-v2.png.webp`。

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy, daytime indoors, in the approved blue short-sleeved cat-emblem T-shirt and navy shorts, barefoot. boy-daywear-v2 is his exact appearance; word-target-boy-v1 is face/art-style reference but not outfit; cat-mascot-v2-small is only for the small chest emblem. The attached think-say-blocks-v2 is the block design reference only.
Action: He kneels beside a clearly tall, straight, already-built toy-block tower roughly as high as his own seated/kneeling body. He is carefully placing one final block on the very top with one hand. The vertical stack must remain upright, stable, and obvious; this is building a tower, not playing with scattered blocks. Do not show a collapsed tower.
Expression: Concentrated and quietly proud, eyes watching the top block.
Objects: A single high stacked tower using block colors and motifs from think-say-blocks-v2: red heart, yellow sun, blue star, orange flower, purple moon. No green blocks. The last block is visibly held above and nearly touching the top. No other toys, furniture, words, or symbols.
Composition: Square 512x512 illustration with kneeling boy on the left and tall tower on the right, both large and fully inside the frame, top block and hand visually prominent at 147 CSS px. Do not crop head, hand, tower base, or bare feet. The app overlays nothing on this rounded-square illustration; leave corner margins. Flat pure green background for later chroma removal; minimal floor shadow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

### `think-say-clean-up-boy-v1.png.webp`（採用）

- 採用画像：`private-prototypes/think-say-clean-up-boy-v1.png.webp`。

添付した画像：`docs/characters/boy-daywear-v2.png.webp`、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`、`private-prototypes/think-say-blocks-v2.png.webp`。

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy, daytime indoors, wearing approved blue short-sleeved cat-emblem T-shirt, navy shorts, bare feet. boy-daywear-v2 is exact face/hair/outfit reference; word-target-boy-v1 is face/art-style reference, not pajama reference; cat-mascot-v2-small is only chest emblem; think-say-blocks-v2 is block designs only.
Action: He is actively tidying up toys: seated or kneeling at a simple open wooden toy box, carrying one loose block with his hand into the box opening. The block is halfway into the box, so the action of putting away is clear. A few blocks are already visibly inside the box, with only two or three left scattered on the floor. He is cleaning up, not playing or building.
Expression: Gentle focused and satisfied, looking at the block being placed into the box.
Objects: Simple plain wooden open-top toy box or basket. Red/yellow/blue/orange/purple blocks with small heart/sun/star/flower/moon motifs matching the attached block reference. No green blocks, no tower. No other toys, furniture, words, or symbols.
Composition: Square 512x512, boy on one side and open box on the other, large visible opening and hand-to-box motion readable at 147 CSS px. Full body/limbs, box and remaining blocks inside frame. Rounded illustration frame has no app overlay on the image; leave corner margins. Pure flat green chroma background, minimal floor shadow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

### `think-say-socks-boy-v1.png.webp`（採用）

- 採用画像：`private-prototypes/think-say-socks-boy-v1.png.webp`。

添付した画像：`docs/characters/boy-daywear-v2.png.webp`、`docs/characters/word-target-boy-v1.png.webp`、`docs/characters/cat-mascot-v2-small.png.webp`。

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One boy, daytime indoors, in the approved blue short-sleeved T-shirt with tiny cat-face emblem and navy knee-length shorts. He is normally barefoot indoors but is now visibly putting on a sock. boy-daywear-v2 is his exact appearance/outfit reference; word-target-boy-v1 is face/art-style reference, not its pajamas; cat-mascot-v2-small is only the tiny chest emblem.
Action: Seated on the floor with one knee bent and the foot drawn near his body. Using both hands, he grips the cuff of one plain bright yellow sock and actively pulls it over one foot. The sock is partially on the foot, its cuff stretched between both hands; the dressing action is unmistakable. His other foot may remain bare. Do not show him merely holding up a sock.
Expression: A determined, trying-hard but gentle face, looking down at the sock and his foot.
Objects: One plain solid-color yellow sock being put on, with no pattern, logo, writing, shoes, or other objects.
Composition: Square 512x512 illustration. Large boy centered, foot, sock cuff, and both hands clear and enlarged enough to identify the action at 147 CSS px. No cropped head, fingers, feet or legs. No background furniture. App has no overlay on this rounded-square artwork; leave clear margins at corners. Flat pure green background for chroma removal and minimal floor shadow.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```


## 2026-10-04 — Think & Say の `some milk` `think-say-milk-v2.png.webp`（承認済み・採用）

- 用途：Think & Say の右の絵「some milk」。所有者が `private-prototypes/think-say-milk-v2.png.webp` を承認した。透明なガラスのコップの側面から、7〜8分目まで入った白い牛乳が見える。本体には未組み込み。
- 添付した画像：`breakfast-item-plate-v1.png.webp`（絵のタッチのみの参考。皿は描かない）。不採用の v1 は添付していない。
- 不採用：`private-prototypes/think-say-milk-v1.png.webp`。青いマグカップでは中身が上からしか見えず、147pxの表示では「牛乳」よりマグカップや単なる飲み物に見えたため。
- v2 は純緑背景（#00FF00）で新規生成し、`scripts/chroma-key-green.py` で透過した。縦横比を変えずに512×512pxの透明な正方形の中央へ配置し、WebP quality 84で保存（35,400 bytes）。明るい背景と青い背景でガラス上部を拡大確認し、コップの縁・牛乳の輪郭に欠けはなく、強い緑優勢画素は検出されなかった。`tests/check-image-alpha.mjs` はPASS（四隅0/0/0/0）。
- 確認画像：`private-prototypes/think-say-milk-v2-glass-closeup.png`、6枚の比較 `private-prototypes/think-say-objects-compare-milk-v2.png`、147px相当の比較 `private-prototypes/think-say-objects-compare-milk-v2-147.png`。比較はオフライン合成で、実ブラウザのスクリーンショットではない。

### `think-say-milk-v2.png.webp` に使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
No human or animal characters appear.

[SCENE]
Who: No characters. One plain transparent drinking glass of milk for the Think & Say right illustration “some milk”.
Action: The glass stands upright, filled with opaque WHITE MILK to roughly 75–80% of its height. Show the milk as a large, solid white area clearly visible THROUGH THE SIDE of the glass, not only as a white oval seen from above. A crisp horizontal milk level separates the white milk from the empty clear top quarter.
Expression: Not applicable.
Objects: Exactly one simple colorless glass tumbler, without a handle, pattern, logo, words, straw, paper carton, saucer, steam or other food. The attached breakfast-item-plate-v1.png.webp is a STYLE reference only for clean outlines, soft highlights, and the app's picture-book rendering; do not draw the plate.
Composition: Center the entire glass large in a square 512x512 final canvas. Show it from slightly above the rim but mostly front-on, so the broad white milk-filled side dominates. Use a distinct pale blue-gray outline and subtle white highlights to define the rim and glass walls. Keep the EMPTY upper part genuinely transparent, with no green-tinted glass or green reflections; chroma-key removal must leave the rim and walls intact. At 147 CSS px, the image must immediately read as a GLASS FULL OF MILK, not a mug or bowl of soup. The app overlays nothing on this image; keep the rim and base away from the rounded frame corners.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-04 — Think & Say の物だけの絵5枚（承認済み・採用）

- `private-prototypes/think-say-banana-v1.png.webp`：`breakfast-items-v2.png.webp` のバナナ1本を切り出し、縦横比を保って512×512pxの透明な正方形の中央に配置。生成は行っていない。
- `private-prototypes/think-say-teddy-bear-v1.png.webp`：`living-item-doll-and-teddy-v2.png.webp` からくまのぬいぐるみ1体だけを切り出し、縦横比を保って512×512pxの透明な正方形の中央に配置。生成は行っていない。
- `private-prototypes/think-say-book-v1.png.webp`：閉じた絵本の `living-item-book-v1.png.webp` を、縦横比を保って512×512pxの透明な正方形の中央に配置。生成は行っていない。
- `private-prototypes/think-say-cat-v1.png.webp`：全身の黒白猫を新規生成。添付した基準画像は `docs/characters/cat-mascot-v2-small.png.webp`。顔の模様、目、鼻、画風を合わせた。下記にプロンプト全文を記録する。
- `private-prototypes/think-say-blocks-v2.png.webp`：積み上げていない積み木を新規生成。添付した画風・小道具の参考画像は `living-item-blocks-v1.png.webp`。下記にプロンプト全文を記録する。
- `private-prototypes/think-say-blocks-v1.png.webp` は不採用。緑の積み木が `scripts/chroma-key-green.py` による透過処理で灰色に変色したため、緑色を含まない配色で v2 を新たに生成した。
- 5枚とも512×512px、WebP quality 84、透明な四隅と十分な透明領域を `tests/check-image-alpha.mjs` で確認した。`cat-v1` と `blocks-v2` は純緑背景（#00FF00）から `scripts/chroma-key-green.py` で透過し、明るい背景に重ねて輪郭を拡大確認した。承認済み6枚を並べた比較画像は `private-prototypes/think-say-objects-compare-milk-v2.png`、147px相当は `private-prototypes/think-say-objects-compare-milk-v2-147.png`。これらはオフライン合成で、実ブラウザのスクリーンショットではない。本体には未組み込み。

### `think-say-cat-v1.png.webp` に使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
No human characters appear. The only animal is the approved black-and-white cat mascot in the attached reference image.

[SCENE]
Who: The app's usual black-and-white cat mascot, recognizable as the same individual as the attached cat-mascot-v2-small.png.webp: matching black mask and ears, white muzzle and chest, pink nose, large yellow-green eyes, friendly face.
Action: Show one cat standing naturally, full body including all four paws and the tail. No other animals or people.
Expression: Bright and friendly, matching the mascot reference.
Objects: None. Do not copy the yellow star decoration from the head-only mascot reference.
Composition: One full cat centered and large within a square 512x512 final canvas, with a clear silhouette at 147 CSS px. Do not crop paws, ears, whiskers or tail. The app adds no overlay over this illustration; keep all essential parts clear of the rounded frame corners.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

### `think-say-blocks-v2.png.webp` に使用したプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
No human or animal characters appear.

[SCENE]
Who: No characters. A small group of colorful wooden toy blocks for the Think & Say right illustration, “the blocks”.
Action: Five or six separate blocks casually placed next to one another, not stacked; no block rests on another, and there is no tower.
Expression: Not applicable.
Objects: Only colorful wooden toy blocks, using the attached living-item-blocks-v1.png.webp as a reference for rounded wood texture and simple embossed motifs. Use yellow, red, blue, orange, and purple blocks. Do not paint any block or motif green, because the pure-green background will be chroma-keyed to transparency. No box, furniture, floor illustration, or other toy.
Composition: Center the group large within a square 512x512 final canvas. Keep small gaps between blocks so they read as several individual pieces at 147 CSS px. The app adds no overlay over the image; avoid all rounded frame corners. Strongly avoid any vertical tower silhouette, to distinguish “the blocks” from “build a tower”.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-04 — 身ぶり「誘う」 `think-say-lets-boy-v2.png.webp`（承認済み・採用）

- 用途：Think & Say の左の絵、Let's 用の「いこうよ！」。採用候補は `private-prototypes/think-say-lets-boy-v2.png.webp` に保管し、所有者が承認した。本体には未組み込み。
- `think-say-lets-boy-v1.png.webp` は不採用。片手を横向きに差し出した形が、「いっしょにいこう」ではなく握手を求めているように見えたため。v2はv1を添付・編集せず、新しく生成した。
- v2に添付した基準画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪・年齢感・画風）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪・画風の補強。パジャマや挙手は写さない）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の小さな猫の顔のみ）、`private-prototypes/think-say-me-boy-v2.png.webp`（顔の大きさ・頭の位置・腰から上の構図のみ。ポーズと表情は写さない）。
- 緑背景原稿：`private-prototypes/think-say-lets-boy-v2-green-original.png`。`scripts/chroma-key-green.py --edge-shrink 2` で透過し、正方形のまま比率を変えず512×512pxへ縮小、WebP quality 84で保存した。原稿1,456,865 bytes → WebP 37,800 bytes（97.4%削減）。髪と輪郭を淡色・青色背景で拡大確認し、半透明輪郭の緑優勢画素は0件。`tests/check-image-alpha.mjs` はPASS（四隅0/0/0/0）。
- 比較画像：`private-prototypes/think-say-lets-boy-v2-three-gestures.png`、`private-prototypes/think-say-lets-boy-v2-three-gestures-147px.png`、`private-prototypes/think-say-lets-boy-v2-seven-gestures.png`。147px相当でも「指さす」の水平・右向きの視線、「やりたい」の真上・そろえた指と、v2の斜め上・人さし指・見る人への視線を区別できることを確認。比較画像はオフライン合成で、実ブラウザのスクリーンショットではない。

### 実際に使ったプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, in a daytime indoor scene, wearing his approved plain blue short-sleeved T-shirt with the tiny simplified cat-face emblem. Reference image 1 (boy-daywear-v2.png.webp) defines the approved daytime clothing, hair, face, age and art style. Reference image 2 (word-target-boy-v1.png.webp) reinforces his face, hair and illustration style; do not copy its pajamas or raised arm. Reference image 3 (cat-mascot-v2-small.png.webp) defines only the tiny simplified cat-face emblem on his shirt. Reference image 4 (think-say-me-boy-v2.png.webp) is ONLY a reference for face size, head height and waist-up framing; do not copy its self-pointing pose or expression. The previous Let's candidate is NOT a reference and must not influence the pose.
Action: A spirited Japanese child's "Shuppaatsu! Let's go over there!" invitation. His torso leans and steps toward the VIEWER'S RIGHT, as if just starting to go there. ONE ARM is raised DIAGONALLY FORWARD AND UP toward the UPPER RIGHT of the square (roughly a 45-degree diagonal), with the INDEX FINGER pointing toward that upper-right destination; the other fingers are curled. The raised arm is neither horizontal nor straight vertically above his ear. The other hand makes a small, relaxed fist beside his waist. His FACE and EYES turn back toward the VIEWER, the friend he is inviting, while his raised index finger points away toward their destination. This is a lively moving-together invitation, not merely noticing an object.
Expression: Bright energetic open-mouth smile, looking at the viewer as if calling "Let's go!" He is cheerful and inviting.
Objects: No held objects, other people, background scenery, signs, letters or symbols. Only the tiny cat emblem from reference image 3.
Composition: Create an ACTUAL SQUARE 1:1 canvas for a final 512x512 asset. Waist-up portrait with the entire head, raised diagonal arm, upward-right pointing index fingertip, and other fist fully inside the square. Keep his face approximately the same large size and vertical position as reference image 4. Leave room in the square's upper-right quadrant for the diagonal arm and pointing fingertip, but do not make the face too small. The difference from Look at must be clear at 147 CSS px: Look at points horizontally right while facing that direction; this boy points diagonally UP-RIGHT while looking back at the viewer. The difference from I want to must be clear: I want to raises an arm vertically beside the ear with all fingers together; this boy raises his arm diagonally and extends only his index finger. No app-rendered overlay covers the image; its separate frame merely has rounded corners. Keep face, fingertip, elbow and fist away from the rounded corners. Preserve proportions, no stretching.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-04 — 身ぶり「得意げ」 `think-say-proud-boy-v1.png.webp`（承認済み・採用）

- 用途：Think & Say の左の絵、Look! I can 用の「えっへん」。最終候補は `private-prototypes/think-say-proud-boy-v1.png.webp` に保管し、所有者が承認した。本体には未組み込み。
- 初稿は口を大きく開けた笑顔で、ただうれしそうに見え、「やりたい」の表情に近かった。そのため表情のみ2回編集し、閉じた口の控えめな笑み、満足げに細めた目、少し上げたあごにした。両手を腰に当てるポーズ、人物、昼服は維持した。
- 初回生成で添付した基準画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪・画風）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪・画風）、`docs/characters/cat-mascot-v2-small.png.webp`（胸の小さな猫の顔）、`private-prototypes/think-say-me-boy-v2.png.webp`（顔の大きさ・頭の高さ・腰から上の構図のみ。ポーズと表情は写さない）。1回目の表情編集には初稿の緑背景画像、`boy-daywear-v2.png.webp`、`word-target-boy-v1.png.webp` を添付。2回目には1回目の編集結果を添付した。
- 最終緑背景原稿：`private-prototypes/think-say-proud-boy-v1-green-original.png`。生成された1672×941pxの中央941×941pxに人物・両ひじ・両手が収まっていたため、`scripts/chroma-key-green.py --edge-shrink 2` で透過後、中央を正方形に切り出し、比率を変えず512×512pxへ縮小してWebP quality 84で保存した。髪と輪郭を淡色・青色背景で拡大確認し、半透明輪郭の緑優勢画素は0件。`tests/check-image-alpha.mjs` はPASS（四隅0/0/0/0）。最終WebPは38,248 bytes。
- 比較画像：`private-prototypes/think-say-proud-boy-v1-six-gestures.png`、`private-prototypes/think-say-proud-boy-v1-six-gestures-147px.png`。147px相当でも両手が腰にあり、既存の5身ぶりと区別できることを確認。比較画像はオフライン合成で、実ブラウザのスクリーンショットではない。

### 初回生成で使ったプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, in a daytime indoor scene, wearing his approved plain blue short-sleeved T-shirt with the tiny simplified usual cat-face emblem. Reference image 1 (boy-daywear-v2.png.webp) defines his daytime clothing, face, hair, age and art style. Reference image 2 (word-target-boy-v1.png.webp) reinforces his face, hair and illustration style; do not copy its pajamas, raised arm or wave. Reference image 3 (cat-mascot-v2-small.png.webp) defines only the tiny simplified cat-face emblem on his shirt. Reference image 4 (think-say-me-boy-v2.png.webp) is ONLY for his face size, head height and waist-up framing; do not copy its self-pointing pose or calm expression.
Action: The boy stands proudly with BOTH HANDS planted clearly on his WAIST/HIPS, one on each side, elbows jutting outward left and right, chest pushed forward and shoulders back, like a Japanese child saying "Ehem! Look, I did it!" His body and face are squarely front-facing. His chin may lift slightly. Both hands are visibly touching the sides of his waist, not raised, not pointing, not in pockets, and not folded across his chest.
Expression: A confident, delighted BIG smile, eyes wide open looking directly at the viewer, eyebrows lively; he is pleased with something he has just managed to do.
Objects: No finished craft or achievement object, no held item, no background furniture, no symbol or text. Only the tiny shirt emblem from reference image 3.
Composition: ACTUAL SQUARE 1:1 canvas for a final 512x512 asset. Waist-up portrait with the whole head, both hands on hips and both outward elbows fully inside the square. Keep his face approximately the same large size and vertical position as reference image 4, but include enough torso below the face so both hands at the waist are unmistakable. Do not shrink the face excessively to fit the elbows. Show the hip gesture clearly at 147 CSS px display size. Keep head, elbows and hands away from the rounded frame's four corners. No app-rendered overlay will be placed over this image; the separate display frame merely has rounded corners. No crop or stretching in the final asset.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

### 1回目の表情編集で使った追加指示全文

```text
Edit the FIRST attached green-background illustration of the boy. Keep the same exact boy, same blue short-sleeve shirt with tiny cat face, same hairstyle, same waist-up scale and position, and the exact BOTH-HANDS-ON-HIPS pose with elbows out. Change ONLY the facial expression and slight head/chin angle: a distinctive self-satisfied Japanese child's 'えっへん' expression after succeeding, with a CLOSED mouth, only the corners slightly lifted in a restrained smug smile, eyes gently narrowed in satisfaction (not wide-open, not asleep), and chin lifted just a little. He must look proud and pleased, not excited or surprised. No open mouth, no teeth, no tongue. Preserve the picture-book style and facial identity from reference images 2 and 3. No new objects, props, symbols, text, rays, or sparkles. The backdrop MUST be uniformly pure solid #00FF00 green for later chroma key, with no shadows or gradient. Keep all head, hands, and elbows fully inside a central square area.
```

### 2回目の表情編集で使った追加指示全文

```text
Edit ONLY the eye expression on this exact illustration. Preserve the character identity, hair, clothes, composition, both hands on hips, closed-mouth small smug smile, slight raised chin, pure flat #00FF00 background, everything else. The boy's eyes should be visibly but gently narrowed into a satisfied, self-proud, playful 'えっへん' gaze, with upper lids lowered about one third, NOT wide round surprised eyes, NOT closed eyes, and not angry. Preserve warm friendly expression. No open mouth, no teeth. Do not change anything else.
```

## 2026-10-04 — 身ぶり「指さす」 `think-say-look-boy-v1.png.webp`（承認済み・採用）

- 用途：Think & Say の左の絵、Look at 用の「あ、見て！」。候補は `private-prototypes/think-say-look-boy-v1.png.webp` に保管し、所有者が承認した。本体には未組み込み。
- 添付した基準画像：`docs/characters/boy-daywear-v2.png.webp`（昼服・顔・髪・年齢感・画風）、`docs/characters/word-target-boy-v1.png.webp`（顔・髪・画風の補強。パジャマと挙手は写さない）、`docs/characters/cat-mascot-v2-small.png.webp`（Tシャツの小さな猫の顔のみ）、`private-prototypes/think-say-me-boy-v2.png.webp`（顔の大きさ・頭の位置・腰から上の構図のみ。自分を指すポーズと表情は写さない）。
- 緑背景原稿：`private-prototypes/think-say-look-boy-v1-green-original.png`。正方形原稿を `scripts/chroma-key-green.py --edge-shrink 1` で透過し、比率を変えず512×512pxのWebP quality 84で書き出した。原稿1,454,956 bytes → WebP 37,022 bytes（97.5%削減）。淡色・青色背景で拡大確認し、半透明輪郭の緑優勢画素は0件。`tests/check-image-alpha.mjs` は PASS（四隅0/0/0/0）。
- 比較画像：`private-prototypes/think-say-look-boy-v1-vs-me.png`、`private-prototypes/think-say-look-boy-v1-five-gestures.png`、`private-prototypes/think-say-look-boy-v1-five-gestures-147px.png`。147px相当でも右向きの指さしが読み取れることを確認。比較画像はオフライン合成で、実ブラウザのスクリーンショットではない。

### 実際に使ったプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
BOY: 4 to 6 years old, small build, round face, large brown eyes, rosy cheeks, light skin, short brown hair swept to his right. Default outfit: blue collared pajamas with a white star pattern and white piping on the collar and cuffs; barefoot. Approved daytime outfit: plain blue short-sleeved T-shirt with a tiny simplified face of the usual cat on the chest, and navy knee-length shorts; barefoot indoors, white sneakers outdoors.

[SCENE]
Who: One BOY only, in a daytime indoor scene, wearing his approved plain blue short-sleeved T-shirt with the tiny simplified usual cat-face emblem; the waist-up crop does not show his shorts or bare feet. Reference image 1 (boy-daywear-v2.png.webp) defines his approved daytime clothing, hair, face, age and art style. Reference image 2 (word-target-boy-v1.png.webp) reinforces his face, hair and illustration style, but do not copy its pajamas or raised waving hand. Reference image 3 (cat-mascot-v2-small.png.webp) defines only the tiny, simplified cat-face emblem on the shirt. Reference image 4 (think-say-me-boy-v2.png.webp) is ONLY a reference for face size, head height and general waist-up scale; do not copy its self-pointing hand pose or calm expression.
Action: The boy has just spotted something offscreen. He extends ONE arm straight outward toward the VIEWER'S RIGHT, away from his chest and body, and points with only his INDEX FINGER to the empty space on the right. The finger clearly points to the right, not upward, toward his chest, or toward the viewer. His other arm rests naturally. His face, eyes and slightly right-turned torso all follow the same rightward direction. This is the familiar Japanese child's "Ah, look!" pointing gesture, not a wave and not self-pointing.
Expression: Delighted discovery and mild surprise, eyes opened wide and looking toward the viewer's right, mouth open in a small "Ah!" shape.
Objects: No held object, no object at the fingertip, no scenery, no symbols or text. Only the tiny shirt emblem from reference image 3.
Composition: An ACTUAL SQUARE 1:1 canvas, not a wide canvas. Draw the boy from the waist up as in reference image 4; his hair begins near the top edge and his shirt continues to the bottom edge, so there is no visible flat cut-off above the bottom of the square. Keep his face approximately the same large size and vertical position as reference image 4. Shift his torso LEFT of center; the straight extended arm points to the RIGHT and stays inside the square with the whole pointing hand, individual index finger and tip visible with a clear margin from the right edge. Do not shrink the face to fit the arm. At a 147 CSS px display size, the outward rightward point must remain readable and clearly distinct from reference image 4's finger pointing toward his own chest. No app-rendered overlay is placed over this image; its separate display frame has rounded corners, so keep face, hand and fingertip out of all four corners. Final asset will be 512x512 pixels without cropping or stretching.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-03 — パパの昼服 `dad-daywear-v1.png.webp`（承認済み・基準画像に採用）

- 採用した候補：`private-prototypes/dad-daywear-v1.png.webp`。同一ファイルを `docs/characters/dad-daywear-v1.png.webp` に配置。パパにとって初めての正面全身の立ち姿基準。512×512px、WebP quality 84、透過。候補と採用画像の SHA-256 は一致する。
- 添付した基準画像：`docs/characters/word-target-dad-v1.png.webp`（顔・髪型・髪色・年齢感・絵のタッチの正式基準）、`docs/characters/boy-daywear-v2.png.webp`（昼服の描き方と正面全身の立ち姿の構図のみ。男の子の顔・髪・体型・服の色や形は写さない）。
- 緑背景（#00FF00）で生成し、`scripts/chroma-key-green.py --edge-shrink 1` で透過。人物を切らず引き伸ばさずに透明余白で512×512pxに収めた。元画像 1,085,069 bytes → 候補 WebP 23,120 bytes（97.9%削減）。淡色・青色の背景上で輪郭を拡大確認し、目立つ緑の縁は見られなかった。`tests/check-image-alpha.mjs` は PASS（四隅0/0/0/0）。比較画像は `private-prototypes/dad-daywear-v1-vs-reference.png` と `private-prototypes/dad-daywear-v1-vs-boy.png` に保管。

### 実際に使ったプロンプト全文

```text
[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
DAD: man around his 30s, calm face, light skin, short dark-brown softly wavy hair with a loose fringe falling onto his forehead, clean-shaven. Approved morning/night outfit: light-blue collared pajamas with white piping along the collar and cuffs. Approved daytime outfit: plain navy long-sleeved crew-neck T-shirt without a collar or cat emblem, beige trousers; barefoot indoors, brown sneakers outdoors. Keep the daytime outfit visibly distinct from the light-blue collared pajamas by color and shape.

[SCENE]
Who: Dad alone, in a daytime indoor scene, wearing his approved navy long-sleeved crew-neck T-shirt and beige full-length trousers, barefoot. Reference image 1 (word-target-dad-v1.png.webp) is the authoritative reference for his face, hair, hair color, age, and illustration style. Reference image 2 (boy-daywear-v2.png.webp) is ONLY a reference for the clean rendering of daytime clothes and near-frontal full-body standing composition; do not copy the boy's face, hair, youthful body proportions, short sleeves, shorts, colors, or cat emblem.
Action: Dad stands naturally and calmly, facing nearly straight toward the viewer. This is a full-body standing character reference, with natural adult body proportions, relaxed arms, both bare feet visible, and no action or props.
Expression: Same gentle, calm, friendly expression and mature 30-something face as reference image 1.
Objects: None. No furniture, no item, no cat emblem, no shadows or scenery.
Composition: One adult man centered in a square frame, head to toes fully inside with comfortable margins. Make the full figure as large and legible as possible without cropping. No app-rendered overlays will be placed on this reference image; keep the entire figure unobstructed. Preserve an adult height-to-head ratio and mature facial structure even though reference image 2 depicts a child. The composition should be nearly frontal, not seated.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

## 2026-10-03 — `think-say-get-towel-dad-v1.png.webp`（採用、プロトタイプ用）

- 用途：Think & Say の右の絵「get the towel」。パパが棚からピンクのタオルを取り出す。所有者が候補を承認し、`private-prototypes/think-and-say-proto.html` の3問目で使用する。本体には未組み込み。
- 添付した画像：`docs/characters/word-target-dad-v1.png.webp`（パパの正式な人物基準）、`bathroom-item-towel-v4.png.webp`（既存のピンクのタオルの色・畳み方・質感の参考。貼り付けはしない）。
- 元の緑背景：`private-prototypes/think-say-get-towel-dad-v1-green-original.png`。`scripts/chroma-key-green.py --edge-shrink 2` で透過し、512×512px の透明余白を加えて WebP quality 84 で保存した。元画像 2,057,978 bytes → 候補 WebP 43,176 bytes（97.9%削減）。
- 確認：髪・手・棚の輪郭を淡い青背景で2倍に拡大し、緑優勢の縁は0件。`tests/check-image-alpha.mjs` の透過チェックは PASS（四隅0/0/0/0）。基準画像との比較 `private-prototypes/think-say-get-towel-dad-v1-comparison.png` と、147px相当の合成プレビュー `private-prototypes/think-say-get-towel-dad-v1-question3-147px.png` を作成した。合成プレビューは実ブラウザ表示の検証ではない。

### 採用画像に使用したプロンプト全文

```text
Use case: illustration-story. Generate a NEW square Think & Say right-side illustration. Image 1 is the authoritative Dad identity, hairstyle, face, pajamas, and picture-book style reference. Image 2 is the existing pink bath-towel item reference for the towel's color, folded shape, and fabric texture; do not paste it into the art.

[STYLE]
Children's picture-book illustration for a kids' English learning app. Bright, saturated colors, clean soft outlines, soft cel shading with gentle highlights, cute rounded proportions, large expressive eyes. Match the art style of the attached reference images exactly. Not watercolor, not colored pencil, not realistic, not 3D render.

[CHARACTERS]
DAD: man around his 30s, calm face, light skin, short dark-brown softly wavy hair with a loose fringe falling onto his forehead, clean-shaven. Approved morning/night outfit: light-blue collared pajamas with white piping along the collar and cuffs. Daytime outfit is undecided; ask the owner before depicting Dad in a daytime scene.

[SCENE]
Who: Dad alone, indoors just after bath time (night), in his approved light-blue collared pajamas with white piping. No boy and no other person.
Action: Dad reaches toward a SIMPLE OPEN WOODEN SHELF and is JUST TAKING one neatly folded pink towel from the stack on a shelf. One hand supports and pulls the pink towel halfway out toward himself; the towel still visibly overlaps the remaining stack. His extended arm, hand, towel, and shelf must form an obvious continuous action of GETTING A TOWEL FROM THE SHELF, not holding up a towel after walking away.
Expression: Dad has a calm, kind, gentle face and looks at the towel he is taking.
Objects: One simple wooden open shelf with a few folded towels stacked on it, plus the one towel being removed. The removed towel is a single clear pink color matching the attached bathroom-item-towel-v4 reference. Other stacked towels may be muted pale blue or cream to separate them from the pink towel in motion. No doors, cabinets, books, cups, toys, windows, shoes, coats, food, writing or logos.
Composition: Final 512x512 square illustration. Dad shown waist-up to above the knees, on the RIGHT; simple shelf on the LEFT, close enough that his extended hand is visibly pulling the pink towel directly from it. Dad's face, reaching arm, towel, and shelf should all be large and readable within a 147 CSS-pixel rounded-square illustration slot. Keep the hand touching the pulled towel, and keep part of the pulled towel still on the stack so the action is unambiguous. No important detail at rounded corners. The app displays no triangle, button, label, or other overlay on top of this image; the card slot is beneath it. Use the specified uniform green background for later chroma key.

[TECHNICAL A — transparent-use asset: Action Match, Think & Say thought bubble, etc.]
Plain solid pure green (#00FF00) background with no gradient, no shadow on the background, no checkerboard pattern. Keep all important actions and objects within the upper 80% of the image. Characters fully inside the frame. For Action Match, draw no divider lines or arrows inside the image; leave a clear gutter at each equal-width panel boundary for app-rendered arrows. The final Action Match image must be exactly 800x450 pixels (16:9); preserve the artwork's proportions and use transparent padding rather than stretching if the generated aspect ratio differs. No text, no watermark.

[DO NOT]
Do not change any character's hairstyle, hair color, face, or selected approved outfit from the reference images. DAD has no beard and no stubble. MOM's hair is always tied back, never loose. GIRL always has a high bun tied with a blue scrunchie; never a ponytail or twin tails. Do not replace the approved blue-star or pink-star pajama pattern. No extra people who are not listed. No text or letters in the image.
```

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

## 2026-10-10 — ホームアイコン3点・Item Matchの動物2点（採用、本体用）

- 公開用：`home-icon-word-match-cat-v1a.png.webp`、`home-icon-listen-do-cat-v3a.png.webp`、`home-icon-think-say-cat-v1a.png.webp`、`living-item-turtle-v1b.png.webp`、`living-item-rabbit-v1a.png.webp`。承認されたPNGは `private-prototypes/` に残し、512×512px・WebP quality 84で公開ルートへコピーした。
- 初稿で添付した基準画像：`docs/characters/cat-mascot-v2-small.png.webp`、`private-prototypes/think-say-blocks-v2.png.webp`、`living-item-toy-car-v1.png.webp`（猫の同一性と既存絵のタッチ）。Listen & Do の再生成では `private-prototypes/home-icon-word-match-cat-v1a.png`、`private-prototypes/home-icon-think-say-cat-v1a.png`、`docs/characters/cat-mascot-v2-small.png.webp` も参照し、最終編集では右側に青い波線が3本ある直前の候補を土台にした。
- 5点とも角の透過と拡大した輪郭を確認し、緑の縁・半透明の白いもやは見つからなかった。`tests/check-image-alpha.mjs` に合格。

### Word Match アイコンの生成プロンプト全文

```text
Create one original square transparent-background illustration for a preschool English-learning game's Word Match home icon. Use the attached images only as references, not as edit targets. Image 1 is the identity reference for the same black-and-white mascot cat: preserve the distinctive black forehead/ears/outer face, white central blaze/muzzle/chest, large yellow-green eyes, pink nose, rounded friendly children's-book face. Do NOT copy the yellow star from Image 1. Image 2 is a reference for the application's colorful, softly dimensional illustration finish. Image 3 is the Item Match object-art reference for crisp shape and restrained highlights.
Draw exactly one cat, shown from about chest upward, peering curiously through ONE large simple magnifying glass held with one forepaw. The magnifying glass must read instantly at 100 CSS px, but must not hide both eyes or the cat's identity. A clear continuous silhouette; strong clean outlines; light rim/edge around black fur so the cat remains readable on orange, blue, or purple button colors. Center the complete icon with comfortable transparent padding. Genuinely transparent alpha background: no square, no colored backdrop, no white backdrop, no shadow panel. No extra props, cards, stars, sparkle, text, letters, numbers, logo, or watermark.
```

透過前のチェッカー背景を緑に置き換えた追加指示：

```text
Edit Image 1 ONLY to replace the baked-in gray checkerboard background with one perfectly flat, uniform pure chroma green (#00FF00) background. Preserve the cat and magnifying glass exactly: pose, identity, colors, size, shape, placement and all edges. Remove every checker square and shadow from the backdrop; no new objects. The green is only a temporary chroma-key matte, not part of the artwork.
```

### Think & Say アイコンの生成プロンプト全文

```text
Create one original square transparent-background children's English game home icon. Image 1 is the identity reference for the SAME black-white mascot cat: black ears and outer face, white center blaze, white muzzle/chest, yellow-green eyes, pink nose, rounded friendly face. Never copy the yellow star in Image 1. Image 2 and Image 3 are style references only: polished children's-book illustration, soft dimensional highlights, crisp readable edges. Cat must be prominent and clear at 100px on orange, blue, or purple button colors, with a thin light edge around black fur. No background, square, panel, text, lettering, logo, or watermark.
THINK & SAY variation A: chest-up front-facing mascot cat, curious thoughtful expression, with one compact puffy thought cloud directly above its head. In the cloud are EXACTLY TWO small, blank picture cards side by side: one solid blue and one solid orange, plain unmarked faces. Cards must be visibly distinct at 100px; no symbols or pictures inside them. Keep the whole cat, cloud, and cards inside the square with transparent padding. No other objects.
```

透過前のチェッカー背景を緑に置き換えた追加指示：

```text
Edit Image 1 ONLY: replace the gray-and-white checkerboard background completely with a perfectly uniform pure vivid chroma green (#00FF00). Preserve the entire foreground art as closely as possible: same cat identity, pose, prop, thought cloud/cards if present, colors, shapes, scale and position. Keep the white edge, white whiskers and all light-colored foreground details; remove only the checkerboard backdrop. No shadows, no added objects, no text. The green is a temporary chroma-key matte.
```

### Listen & Do アイコン最終編集のプロンプト全文

```text
Use case: precise-object-edit. Image 1 is the edit target: the black-and-white mascot cat bust with THREE blue sound-wave arcs beside its ear on the RIGHT side of the picture. Make a careful local edit to this exact artwork, not a new composition. Remove the raised front paw and foreleg touching that ear entirely. Put that front leg down naturally in front of the chest, mostly below the bust crop if needed; no paw visible beside the ear or above the cat's face. Tip ONLY the ear next to the arcs a little toward the incoming sound, a subtle natural rotation toward the arcs. Keep the cat's attentive sideward gaze, small closed-mouth smile, face identity, fur markings, head and bust size, placement, soft painterly style and white outline exactly as Image 1. Preserve the three blue/white sound arcs EXACTLY in their existing position, count, thickness, shape and colors, with no extra waves. Keep the pure uniform #00FF00 chroma-green backdrop unchanged for subsequent transparency extraction. No checkerboard, text, logos, extra props, background, or watermark. The finished icon at 100px must read as listening, never beckoning, waving or scratching.
Variant A: lower the removed foreleg completely below the visible crop so the chest is clean and uninterrupted; rotate the right-side ear only very slightly toward the arcs.
```

### Turtle アイコンの生成プロンプト全文

```text
Create one original square illustration asset for a preschool English-learning game. It will be used both as a large Item Match card image and at 40 CSS px beside a speech-speed slider. Images 1-3 are style references only (polished, warm children's-book illustration with softly dimensional shading, restrained detail, crisp distinct silhouette); do not copy the cat, blocks, or toy car as content. Draw exactly one cute, natural-looking household pet animal, full body in clean SIDE PROFILE facing RIGHT, every limb/tail/ear entirely inside the frame, centered and taking up most of the width. Use a perfectly uniform pure chroma green (#00FF00) BACKGROUND to be removed later; a single flat solid color, no gradient, no checker pattern. No ground, grass, landscape, shadow, decoration, accessories, text, logo, or watermark. Strong colored outer edge and simple anatomy so the species reads at 40px.
A pet turtle, leisurely stepping to the RIGHT, in a clean side profile; head and neck stretch forward slightly, front leg mid-step, back legs on the ground. Rounded warm brown and muted olive shell with broad simple shell segments, warm beige-olive face and legs, gentle eye. Make silhouette compact and unambiguous at 40px. Avoid any bright saturated green similar to the chroma backdrop.
```

### Rabbit アイコンの生成プロンプト全文

```text
Create one original square illustration asset for a preschool English-learning game, used both as an Item Match card and at 40 CSS px beside a speech-speed slider. Images 1-3 are style references only (polished warm children's-book illustration, soft dimensional shading and crisp silhouette); do not copy the cat, blocks, or car. Draw exactly ONE cute, natural household pet rabbit, full body in SIDE PROFILE facing RIGHT, actively hopping, with the head, two long upright ears, front and hind feet, and little tail all entirely visible. It should occupy about the same visual mass as a pet turtle illustration and fill most of the square width, with comfortable padding. Clear rabbit silhouette and edge contrast readable at 40px. The background must be one uniformly pure chroma green (#00FF00) matte to remove later, with no checkerboard, shadows, ground, grass, other animals, accessories, scenery, text, logo, or watermark.
Variation A: warm cream-white rabbit with subtle soft gray-brown ear tips, mid-hop to the RIGHT; hind legs tucked just leaving the ground, forepaws extended forward, ears swept slightly back by motion, round short cotton tail. Friendly alert dark eye, anatomically natural and pet-like rather than cartoon-human. Bold clear outline.
```

## 2026-10-10 — `home-icon-word-match-cat-v2a.png.webp`（採用、本体用）

- 用途：ホームの Word Match アイコン。元画像は `private-prototypes/home-icon-word-match-cat-v2a.png`、公開画像は `home-icon-word-match-cat-v2a.png.webp`。旧版 `home-icon-word-match-cat-v1a.png.webp` は削除せず保管。
- 描き直した理由：v1a の虫めがねを持つ前足が人間の指のようで不自然だったため、前足をなくして虫めがねを片目の前に浮かせた。レンズ越しの目を少し大きく描いた。
- 編集時の添付画像：`private-prototypes/home-icon-word-match-cat-v1a.png`（編集対象）、`private-prototypes/home-icon-listen-do-cat-v3a.png`、`private-prototypes/home-icon-think-say-cat-v1a.png`（猫の同一性、構図とタッチの参考のみ）。市松模様を純緑に置き換える編集では、その直前の生成画像だけを添付した。
- 純緑背景を透過して512×512pxに仕上げ、WebP quality 84で保存。輪郭の緑の縁と半透明の白いもやを確認し、透過チェックに合格。

### 採用版の編集プロンプト全文

```text
Use case: precise-object-edit. Image 1 is the exact edit target, the Word Match black-and-white mascot cat bust with blue-rimmed magnifying glass. Images 2 and 3 are style, character identity, scale and chest-up crop references only; do not copy their sound waves or thought cards. Produce candidate A of the Word Match home icon. Remove ONLY the forepaw and fingers gripping the magnifying-glass handle; both forepaws are lowered and may be entirely below the chest-up crop. Keep the magnifying glass floating unsupported in front of the cat's one eye. Its handle extends diagonally downward; preserve the existing bright blue lens rim, yellow connector and red/yellow handle shape and colors. Through the lens, that eye must appear subtly but clearly larger than the other eye, with an optically coherent circular lens; keep the eye centered in the lens and clearly readable at 100 px. Preserve the cat's exact identity, open-mouth curious expression, black-white markings, chest-up scale, position, soft dimensional children's-book painting, crisp white edge, and genuinely transparent background. Keep all icon elements inside the square. No human-like fingers, no paw holding the handle, no extra objects, text, logo, or checkerboard. Change nothing else.
```

市松模様を緑背景に修正した追加指示：

```text
Use case: background-extraction. Image 1 is the exact edit target. Replace ONLY its entire baked-in gray checkerboard background with a perfectly uniform flat solid pure #00FF00 chroma green matte. Preserve every foreground pixel and edge visually: same cat face and chest, fur, white whiskers and white outline, blue magnifying glass, red/yellow handle, enlarged eye, precise scale and position. Do not paint over the white whiskers or edge. Remove every checker square; no checkerboard, gradient, haze or shadow in green backdrop. Do not change any other part of Image 1. This is temporary green for later alpha extraction.
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
