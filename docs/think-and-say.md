# Think & Say 企画（引き継ぎ資料・別紙）

## コンセプト

場面の絵と吹き出しを見て、子どもが「言いたいこと」を英文にする。
左カード（気持ちの型）＋右カード（伝えたい中身）で1文を作る。

## 操作確認用プロトタイプ

- 非公開の `private-prototypes/think-and-say-proto.html` に置いている
- 吹き出しの絵は絵文字による仮置き。完成画像や本番画面ではない

## 操作と画面（決定済み）

- カードを吹き出しの中の左右2つの枠へドラッグする（Listen & Do と同じ操作。タップ選択やスワイプは不採用）
- 上部に大きな考え吹き出しを置き、左右2分割する。それぞれ正方形のイラスト枠と、その真下にカードのスロットを置く（上下分割は不採用）
- イラスト枠は縦横比1:1。Think & Say 用の画像は512×512pxの正方形とする。表示寸法はCSSだけで決め、画面が低いときは正方形のまま縮める
- 左＝青系、右＝オレンジ系でカードと枠の色を対応させる
- 男の子を中央下に大きく表示し、吹き出しのしっぽが男の子の頭から出ているように見せる。男の子はカードの背面に置く
- カードは画面下に左3枚（青系）・右3枚（オレンジ系）の2列で並べる。男の子の体に重なってよいが、顔はできるだけ隠さない
- 各カード列の上に、触っても反応しない上向きの矢印を飾りとして置く
- 画面下の案内文とスロット内の文字は表示しない
- 吹き出しのイラスト枠には絵だけを表示する。日本語の説明は正解後、またはヒントボタンを押したときだけ表示する
- 世界観は既存画面と統一する

## 音声と効果音（決定済み）

- カードに触れた（pointerdown）瞬間に、そのカードの英語を読み上げる。枠に入れたときは読み上げない
- 読み上げ中に別のカードに触れた場合は `cancel()` せず、今の読み上げの終了後に、最後に触れた1枚だけを読む。途中に触れたカードの読み上げは溜めない
- 正解・不正解の効果音と正解の演出は、ほかのゲームと統一する
- 読み上げの終了イベントが来ない場合も、タイムアウトでゲームの進行を続ける

## 正誤の挙動（決定済み）

- カードは常にすべて掴める（灰色にして選べなくしない）
- 1枚目を置いた時点では判定しない。カードは枠に入ったまま待つ
- 2枚そろったら判定する。正しいカードは枠に残り、間違っているカードだけ弾く（両方間違いなら両方弾く）
- 弾かれた後は、空いた枠に新しいカードを置いた瞬間に再判定する
- 不正解の判定時は効果音だけを鳴らし、新たな読み上げはしない（誤った組み合わせの英文を聞かせない）。カードに触れたときの単語の読み上げは上記のとおり行う
- 不正解時は1回目から困った顔の猫を表示（新規イラスト必要）
- 文法的に成立しない組み合わせ（I'm + eat the apple 等）も、単に不正解として扱う
- 正解時は、正解の効果音と演出 → 左右のカードがくっつく → 完成文の読み上げと日本語の表示 → 次の問題、の順に進む
- 音声認識は使わない（幼児の発話を誤判定するリスクのため）

## 正解時のカード演出（決定済み）

- スロットに入った2枚のカードが中央へ寄り、文字を大きくしながら隙間のない1枚のカードにくっつく
- 左側は青系、右側はオレンジ系のまま残し、文末に問題データで指定した記号（`.` や `?`）を付ける
- くっついたカードは次の問題に切り替わるまで表示する。星は表示しない

## 問題と盤面のルール（決定済み）

- 1問につき正解の組み合わせは1組だけ
- 同じ絵を別の問題で再利用してよい。盤面のカードが変われば正解も変わる
  （例：空腹の絵で、ある問題は I'm hungry、別の問題は I want an apple）
- 盤面のカードは問題ごとに明示して定義する（自動生成しない）
- 盤面に、正解以外に成立する組み合わせが出ないようにする
- 左カードに同じものを並べない
- 右カードは state／noun／action を混ぜる（1分類に偏らせない）
- ダミーは右カードで場面に合わないものを混ぜるのが作りやすい
- 右の絵は、その盤面の右カードの中から1枚に決まるように描く
- Can you の動作の絵には動作をする大人を描き、Can I の動作の絵には子ども自身を描く
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
- 吹き出し左の絵は、対象物に依存しない身ぶり9種を使う。右の絵は、その盤面の
  右カードの中から1枚に決まるように描く。具体的な絵の描き方は未決定
- 人物の基準は確定済み（docs/characters.md）。プロンプトのテンプレートも整備済み
  （docs/image-prompts.md）なので、新規イラストを作る条件は整っている

## 最初のリリースの範囲（決定済み）

- 左カードは I'm, It's, I want, Look at, I want to, Look! I can, Can you, Can I, Let's の9枚
- 左カード1枚につき右の語は3つまで（暫定）

| 左カード | 右の語 |
| --- | --- |
| I'm | hungry, sleepy, happy |
| It's | yummy, fun, pretty |
| I want | a banana, some milk, the teddy bear |
| Look at | the cat, the book, the blocks |
| I want to | go outside, read the book, play with the blocks |
| Look! I can | build a tower, put on my socks, brush my teeth |
| Can you | help me, open the milk, get the towel（絵には大人を描く） |
| Can I | go outside, play with the blocks, read the book |
| Let's | clean up, go outside, play with the blocks |

- 右の絵は重複を除いて22枚の見込み
- 語の多様性は将来 Word Match に預けることも検討する

## 未決定事項

1. 決定済みの身ぶり9種について、吹き出し左半分に具体的に何を描くか
2. I'm／It's の state 分類を将来の出題にどう適用するか。最初のリリースでは「両方可」の語を使わない
   - I'm だけ：hungry, thirsty, sleepy, tired, sick, happy, sad, scared, excited, angry
   - It's だけ：yummy, pretty, fun, hard
   - 両方可：cold, hot, okay, done, ready, full, big, small
   - I'm と It's を同じ盤面に並べるときは「両方可」の語を右カードに置かない
3. 組み合わせを制御する属性（受け付ける種類、自分専用の動作）の具体的な形
   - I like／I don't like／I don't want は、a banana や some milk と組むと不自然な英語になる。the が付く物とだけ組むか、好き嫌い用の形（bananas, milk）を別に作るかは後で決める
4. ダミーのカードにも日本語を付けるか。英語は正解カードと同様、触れたときに読み上げる
5. 本番で「Your turn!」とマイク機能を復活させるか。操作確認用プロトタイプからは削除済み

## Your turn とマイク（本番への導入は未決定）

- プロトタイプでは正解後の「Your turn!」とマイクボタンを削除した。本番で復活させるかは未定
- マイク機能を入れる場合は発音を判定せず、録音してその場で再生する方式にする。実装は後回しにする
- 初回のマイク許可には保護者が許可する流れを用意する
- iPhoneではマイク使用後に音量が下がったり受話口から鳴ったりすることがあるため、録音後すぐマイクを解放し、実機で確認する
- 録音は端末内だけで扱い、保存も送信もしない。この扱いをプライバシーポリシーに明記する
- マイクを使わなくても次へ進めるようにする

## Claude からの提案

### 【提案1：左の絵を「身ぶり」9種に集約する（採用済み）】

左カード14種すべてに別々の絵を用意せず、吹き出し左の絵は以下の身ぶり9種に集約する。

- 訴える：I'm／It's
- 欲しがる：I want／I want to
- 指さす：Look at
- 得意げ：Look! I can
- 頼む：Can you／Can I
- 誘う：Let's
- 困る：I can't
- 好き：I like
- いや：I don't like／I don't want／I don't want to

同じ身ぶりのカードを同じ盤面に並べない盤面は易しい問題、並べる盤面は
組み合わせを考える問題として、難しさの調整に使う。

### 【提案2：表情の基準画像を先に作る（未決定）】

Think & Say では同じ人物の表情を何種類も描くことになる（おなかがすいた、
ねむい、こまった等）。各人物の表情だけを並べた「表情の基準画像」を
先に1枚作っておくと、以後の絵が揃えやすくなる。

## 次のステップ

1. 採用済みの身ぶり9種について、吹き出し左半分の具体的な絵の描き方を決める
2. 表情の基準画像を作るか決める（提案2への判断）
3. 操作確認用プロトタイプを踏まえ、本番用の最初の数問の盤面を決める
4. 本番用の絵と画面を作り、ドラッグから読み上げ・カード結合・次問まで通して確認する
5. 子どもに触ってもらい、絵から正解を推測できるか確認
6. 問題数と種類を増やす

## 制作時の注意（前のチャットで確立した手順）

- 画像は docs/image-prompts.md のテンプレートを使い、基準画像を必ず添付する
- 緑背景（#00FF00）で生成 → 透過 → 拡大して緑の縁を確認 → 透過チェック
- アプリ側が画像の上に重ねるもの（吹き出しの枠など）がある場合、
  重なる位置に顔・手・重要な物を置かない
- Think & Say 用のイラストは512×512pxの正方形を基準に制作する
