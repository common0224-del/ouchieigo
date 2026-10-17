# Item Match の語

- 現在の登録語は63語（従来の53語＋食べ物10語）。毎ゲーム、その中から12枚をランダムに表示する。問題数・カード数・正誤判定・読み上げは変更しない。
- `Turtle`（かめ、`living-item-turtle-v1b.png.webp`）と `Rabbit`（うさぎ、`living-item-rabbit-v1a.png.webp`）を追加した。
- `Cat`（ねこ）には `think-say-cat-v1.png.webp` を使う。
- 以前の `Doll and stuffed toy` 1枚は使わず、`Doll`（おにんぎょう、`living-item-doll-v1.png.webp`）と `Teddy bear`（くまのぬいぐるみ、`think-say-teddy-bear-v1.png.webp`）の2枚に分けた。1枚に2つの物が描かれていると、聞いた語がどちらを指すか分かりにくいため。
- 元画像 `living-item-doll-and-teddy-v2.png.webp` は削除しない。寝室の Listen & Do では引き続き使う。

## 「お買い物」と共用する食べ物

- 13種類のうち、`Apple`／りんご、`Banana`／バナナ、`Milk`／ミルクは登録済みだった。既存の英語・日本語表記は変えない。特に Item Match の `Milk` は従来どおり「ミルク」で、お買い物画面の「ぎゅうにゅう」とは別の表示語にする。
- 今回 `Bread`／パン、`Egg`／たまご、`Tomato`／トマト、`Carrot`／にんじん、`Potato`／じゃがいも、`Chicken`／とりにく、`Pork`／ぶたにく、`Beef`／ぎゅうにく、`Fish`／さかな、`Strawberry`／いちごを追加した。読み上げは各単語だけとし、お買い物の数量・単位表現は持ち込まない。
- 画像は公開ルートの同じファイルを参照し、複製しない。Apple は `breakfast-item-apple-v1.png.webp`、Banana は `think-say-banana-v1.png.webp`、Milk と Bread は `breakfast-items-v2.png.webp` の牛乳／食パンのセル、Egg は `shopping-item-egg-v1a.png.webp` を使う。Banana の従来のスプライト内画像は単体画像と同じ構図で、今回 Item Match の参照先だけをお買い物と共通の単体画像に変更した。
- 追加8種は `shopping-item-tomato-v1a.png.webp`、`shopping-item-carrot-v1a.png.webp`、`shopping-item-potato-v1b.png.webp`、`shopping-item-chicken-v2a.png.webp`、`shopping-item-pork-v2a.png.webp`、`shopping-item-beef-v2a.png.webp`、`shopping-item-fish-v2b.png.webp`、`shopping-item-strawberry-v1b.png.webp` を共用する。どれも既存カードの `object-fit:contain` で全体を収める。
- 既存の `Toast`／トーストはそのまま維持する。新しい `Bread` は同じ食パンの絵を使うため、1ゲームの12枚に両方が並ばないよう抽選時に片方だけ選ぶ。両語とも全語彙からの抽選対象である。数字1〜10の追加は今回行わない。

## 画面の見出しと出題バー

- Item Match の問題画面内には「🔎 Word Match」の見出しを表示しない。ホームのボタン名と、Word Match 内のゲーム選択画面の見出しはそのままにする。
- 出題バーはグリッド上部の予約済み55pxの領域に重ねる。上8px、左右16pxの余白で横幅を使い、不透明な背景にする。バーは文書の流れに入れず、カードの位置・寸法を変えない。
- 共通の「もじ」設定に従い、段階0はバーなし、段階1は英語のみ、段階2は英語と日本語を表示する。段階2でもバーは最上段のカードに重ならない。
- カード内の絵は「もじ」の段階0・1・2を通じて同じ大きさ・位置に保つ。カード下部の文字は絵を縮めるための領域を取らず、重ねた半透明のクリーム色の帯に表示する。段階0は帯なし、段階1は日本語のみ、段階2は日本語と英語。帯の不透明度は `#word-screen` の `--item-hint-opacity` で調整する。
- 「もじ」の段階は Listen & Do の4場面と画面表示中だけ共有する。Item Match から戻る・ホームへ出るとき、および終わり画面の Play again を押したときに段階0に戻し、端末には保存しない。問題の進行や終わり画面の表示だけでは段階を変えない。Listen & Do は場面選択を経た場面切り替えでは保持し、ホームへ出るときと各場面の Play again で0に戻す。
