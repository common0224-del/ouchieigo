# Think & Say 企画（引き継ぎ資料・別紙）

## コンセプト

場面の絵と吹き出しを見て、子どもが「言いたいこと」を英文にする。
左カード（気持ちの型）＋右カード（伝えたい中身）で1文を作る。

## 操作と画面（決定済み）

- カードを吹き出しの中の左右2つの枠へドラッグする（Listen & Do と同じ操作。タップ選択やスワイプは不採用）
- 吹き出しは左右2分割。吹き出し内の左の絵が左の枠、右の絵が右の枠に真上・真下で対応する（上下分割は不採用）
- 左＝青系、右＝オレンジ系でカードと枠の色を対応させる
- カードは子どもと吹き出しの周囲に配置（画面下に一列に並べない）
- 吹き出しの中は絵だけ。日本語の説明は正解後、またはヒントボタンを押したときだけ表示する
- 世界観は既存画面と統一。男の子は大きく表示

## 正誤の挙動（決定済み）

- カードは常にすべて掴める（灰色にして選べなくしない）
- 不正解の組み合わせは、枠に入らずに弾かれる
- 不正解時は効果音のみ。読み上げはしない（誤った英語を聞かせない）
- 不正解時は1回目から困った顔の猫を表示（新規イラスト必要）
- 文法的に成立しない組み合わせ（I'm + eat the apple 等）も、単に不正解として扱う
- 正解時のみ完成文を読み上げ → 「Your turn!」と大きなマイクボタン → 押している間キャラクターが聞くポーズ → 離すと⭐️ → 次の問題
- 音声認識は使わない（幼児の発話を誤判定するリスクのため）

## 問題と盤面のルール（決定済み）

- 1問につき正解の組み合わせは1組だけ
- 同じ絵を別の問題で再利用してよい。盤面のカードが変われば正解も変わる
  （例：空腹の絵で、ある問題は I'm hungry、別の問題は I want an apple）
- 盤面のカードは問題ごとに明示して定義する（自動生成しない）
- 盤面に、正解以外に成立する組み合わせが出ないようにする
- 左カードに同じものを並べない
- 右カードは state／noun／action を混ぜる（1分類に偏らせない）
- ダミーは右カードで場面に合わないものを混ぜるのが作りやすい
- Can you は自分にしかできない動作（brush my teeth, wash my hands,
  wear my pajamas, put on my socks 等）と組み合わせない。カードに属性を持たせて制御する

## 左カード 14種（発達順の優先度つき）

★★★ I'm（→state） / I want（→noun） / I want to（→action） / Look at（→noun）
★★  Can you（→action） / Can I（→action） / Let's（→action） / I like（→noun） /
I can't（→action、困っている絵） / Look! I can（→action、得意げな絵）
★   I don't want（→noun） / I don't want to（→action） / It's（→state） / I don't like（→noun）

補足：

- I want（名詞）と I want to（動作）は区別する。to の有無を体で覚える
- I can は単独ではなく「Look! I can」の1枚にする
- I can't は助けを求める表現。右カードの help me と対になる
- I don't want to は反抗的な表現の多用を避けるため出題は控えめに
- 除外：I need, Do you want（親のセリフ）, Thank you for, Where is, What is, Please, I have
- That's は It's に一本化する案

## 右カード（約63種）

state：hungry, thirsty, sleepy, tired, full, sick, cold, hot, happy, sad, scared,
excited, angry, done, ready, okay, yummy, big, small, pretty, fun, hard

noun：an apple, some milk, some toast, a banana, some cereal, the book, the blocks,
the toy car, the doll, the crayons, the teddy bear, my socks, my pajamas,
the towel, the blanket, the cat, the remote, the cup

action：eat the apple, drink the milk, eat breakfast, read the book,
play with the blocks, play with the toy car, draw a picture, build a tower,
get the towel, get the book, bring the blanket, put it away, clean up,
throw it away, wear my pajamas, put on my socks, brush my teeth, wash my hands,
take a bath, go outside, go to bed, sit down, help me, reach the book,
open the milk, find my socks

## イラストの方針

- 以前 Codex が作った「本に手を伸ばす男の子」など、特定の物に依存した絵は
  汎用性がないため不採用
- 「気持ちの絵」は対象物を持たない汎用の絵にし、「モノの絵」は既存のアイテム画像を
  組み合わせる方針だった（左カードが14種に増えたため見直しが必要）
- 人物の基準は確定済み（docs/characters.md）。プロンプトのテンプレートも整備済み
  （docs/image-prompts.md）なので、新規イラストを作る条件は整っている

## 未決定事項

1. 吹き出しの絵の描き方（左カード14種に対応して、左半分に何を描くか）
2. It's 専用の state（yummy, big など）を分けるか
3. 組み合わせを制御する属性（受け付ける種類、自分専用の動作）の具体的な形
4. ダミーのカードにも音声と日本語を付けるか
5. 最初のリリースに含める範囲（段階分けは語群確定後に行う）
6. Think & Say 用の画像サイズの上限（新種類のため未決定。制作前に決める）

## Claude からの提案（未回答・要判断）

### 【提案1：左の絵を「身ぶり」7種程度に集約する】

左カード14種すべてに別々の絵を用意する必要はない。
理由：正解が1組だけになるよう盤面を定義する方針なので、左の絵は
「その盤面に並んでいる左カードの中で区別できれば十分」。

案：

- 訴える（I'm / It's）
- 欲しがる（I want / I want to）
- 見せる（Look at / Look! I can）
- 頼む（Can you / Can I）
- 誘う（Let's）
- 困る（I can't）
- 好き・嫌い（I like / I don't like / I don't want / I don't want to）

そのうえで「同じ身ぶりに属するカード同士は同じ盤面に並べない」という
ルールを盤面側に追加する。

利点：制作する絵が14枚から7枚程度に減る。絵の描き分けに悩まなくて済む。
懸念：I want と I want to のように、to の有無を区別させたい組が同じ身ぶりに
なるため、その区別を右カード側の絵（物か動作か）に委ねることになる。

### 【提案2：表情の基準画像を先に作る】

Think & Say では同じ人物の表情を何種類も描くことになる（おなかがすいた、
ねむい、こまった等）。各人物の表情だけを並べた「表情の基準画像」を
先に1枚作っておくと、以後の絵が揃えやすくなる。

## 次のステップ

1. 吹き出しの絵の描き方を決める（提案1への判断）
2. 表情の基準画像を作るか決める（提案2への判断）
3. 最初の数問の盤面を Claude と決める
4. Codex が1問だけ、ドラッグから読み上げ・Your turn まで通して作る
5. 子どもに触ってもらい、絵から正解を推測できるか確認
6. 問題数と種類を増やす

## 制作時の注意（前のチャットで確立した手順）

- 画像は docs/image-prompts.md のテンプレートを使い、基準画像を必ず添付する
- 緑背景（#00FF00）で生成 → 透過 → 拡大して緑の縁を確認 → 透過チェック
- アプリ側が画像の上に重ねるもの（吹き出しの枠など）がある場合、
  重なる位置に顔・手・重要な物を置かない
- 新しい種類の画像なので、サイズの上限を制作前に決める
