import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const literal=name=>{
  const match=html.match(new RegExp(`const ${name}=(\\{[^\\n]+\\});`));
  assert(match,`Missing ${name}`);
  return JSON.parse(JSON.stringify(vm.runInNewContext(`(${match[1]})`)));
};
const names=literal('wordNames'), japanese=literal('wordJapanese');
const original='toothbrush cup towel soap toothpaste comb toast banana milk cereal spoon plate mug fork chopsticks apple bowl napkin sink tray rack basket table boy girl book remote blanket blocks car tissue crayons doll teddy-bear cat turtle rabbit cookie-wrapper cat-drawing bookshelf mom sofa toybox bin pajamas pillow socks alarm-clock nightcap bed dad drawer night-table'.split(' ');
const food='apple banana milk bread egg tomato carrot potato chicken pork beef fish strawberry'.split(' ');
const added='bread egg tomato carrot potato chicken pork beef fish strawberry'.split(' ');
const vocabulary=[...food,'house'];
assert.equal(original.length,53);
assert.equal(new Set(original).size,53);
assert.deepEqual(Object.keys(names),[...original,...added,'house'],'existing vocabulary or registration order changed');
assert.deepEqual(Object.keys(japanese),[...original,...added,'house'],'Japanese vocabulary is missing or duplicated');
assert.equal(Object.keys(names).length,64);
assert.equal(names.house,'House');
assert.equal(japanese.house,'いえ');
assert.deepEqual(food.filter(key=>original.includes(key)),['apple','banana','milk']);
for(const key of food) {
  assert.equal(names[key],key[0].toUpperCase()+key.slice(1),`${key}: Item Match must speak one word`);
  assert(!/piece|carton|slice|\d/.test(names[key]),`${key}: shopping quantity leaked into Item Match`);
}
assert.deepEqual(Object.fromEntries(food.map(key=>[key,japanese[key]])),{
  apple:'りんご',banana:'バナナ',milk:'ミルク',bread:'パン',egg:'たまご',
  tomato:'トマト',carrot:'にんじん',potato:'じゃがいも',chicken:'とりにく',
  pork:'ぶたにく',beef:'ぎゅうにく',fish:'さかな',strawberry:'いちご'
});
assert.equal(names.toast,'Toast');
assert.equal(japanese.toast,'トースト');

const board=html.match(/<section class="word-board"[^>]*>([\s\S]*?)<div class="word-finish"/)?.[1];
assert(board,'Item Match board not found');
const staticCards=[...board.matchAll(/<button class="word-card" data-word="([^"]+)"/g)].map(match=>match[1]);
const dynamicLists=[...html.matchAll(/^\s*(\[\['[^\n]+\]\])\.forEach\(\(\[word,src\]\)=>/gm)]
  .map(match=>JSON.parse(JSON.stringify(vm.runInNewContext(match[1]))));
const dynamicCards=dynamicLists.flat().map(([key])=>key);
assert.equal([...html.matchAll(/card\.innerHTML=`<img src="\$\{src\}" alt="" draggable="false">`/g)].length,2,'both dynamic Item Match HTML image builders must disable native dragging');
assert.match(html,/const art=document\.createElement\('img'\); art\.src=src; art\.alt=''; art\.draggable=false; card\.append\(art\);/,'dynamic Item Match food images must disable native dragging');
assert.match(html,/:is\([^\n]*#word-screen[^\n]*\) \* \{ -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; -webkit-tap-highlight-color:transparent; \}/,'Item Match cards must retain selection and tap-highlight protection');
assert.match(html,/:is\([^\n]*#word-screen[^\n]*\) :is\(img,image\) \{ -webkit-user-drag:none; \}/,'Item Match images must retain native-drag protection');
const allCards=[...staticCards,...dynamicCards];
assert.equal(allCards.length,64,'each vocabulary entry needs exactly one card');
assert.equal(new Set(allCards).size,64,'duplicate Item Match cards');
assert.deepEqual(new Set(allCards),new Set(Object.keys(names)),'word tables and cards differ');
assert.match(board,/<button class="word-card" data-word="house" type="button" aria-label="House"><img src="word-item-house-v2\.png\.webp" alt=""><\/button>/,'House card must use the shared illustration');
assert(fs.existsSync(path.join(root,'word-item-house-v2.png.webp')),'Shared House illustration is missing');
assert.match(html,/\.word-card img, \.word-card \.word-sprite \{ width:91%; height:91%; object-fit:contain;/,'House art must use existing card image sizing');
assert.match(html,/\.screen-header \.home-icon \{ display:block; width:30px; height:30px; object-fit:contain;/,'Home art must fit inside the existing button');
assert.equal([...html.matchAll(/class="home-icon" src="word-item-house-v2\.png\.webp"/g)].length,9,'Every home button must share the Item Match House asset');
assert.doesNotMatch(html,/home-icon-art|word-item-house-v1\.png\.webp/,'Old or rejected House art must not be referenced');
assert.equal(dynamicLists.at(-1).length,10,'only the ten unregistered foods should be added');
assert.deepEqual(dynamicLists.at(-1).map(([key])=>key),added);

const imageForNew=Object.fromEntries(dynamicLists.at(-1));
const expectedImages={
  bread:'breakfast-items-v2.png.webp',egg:'shopping-item-egg-v1a.png.webp',
  tomato:'shopping-item-tomato-v1a.png.webp',carrot:'shopping-item-carrot-v1a.png.webp',
  potato:'shopping-item-potato-v1b.png.webp',chicken:'shopping-item-chicken-v2a.png.webp',
  pork:'shopping-item-pork-v2a.png.webp',beef:'shopping-item-beef-v2a.png.webp',
  fish:'shopping-item-fish-v2b.png.webp',strawberry:'shopping-item-strawberry-v1b.png.webp'
};
assert.deepEqual(imageForNew,expectedImages,'new cards do not share the approved shopping assets');
for(const image of Object.values(expectedImages)) assert(fs.existsSync(path.join(root,image)),`Missing image: ${image}`);
for(const image of ['breakfast-item-apple-v1.png.webp','think-say-banana-v1.png.webp','breakfast-items-v2.png.webp'])
  assert(fs.existsSync(path.join(root,image)),`Missing shared image: ${image}`);
assert.match(board,/<button class="word-card" data-word="apple"[^>]*><img src="breakfast-item-apple-v1\.png\.webp"/);
assert.match(board,/<button class="word-card" data-word="milk"[^>]*><span class="word-sprite" style="--word-sprite:100% 0"/);
assert.match(html, /\.word-card\[data-word="banana"\] \.word-sprite \{ background:url\('think-say-banana-v1\.png\.webp'\) center \/ contain no-repeat; \}/);
assert.match(html, /if\(word==='bread'\) \{[^}]*art\.className='word-sprite'; art\.style\.setProperty\('--word-sprite','0 0'\)/);
assert.match(html, /\.word-card img, \.word-card \.word-sprite \{ width:91%; height:91%; object-fit:contain;/);
assert.match(html, /\.word-sprite \{ background:url\('breakfast-items-v2\.png\.webp'\) var\(--word-sprite, 100% 100%\) \/ 300% 200% no-repeat; \}/);

const chooseSource=html.match(/^      function chooseWordCards\(cards\) \{[^\n]+$/m)?.[0];
assert(chooseSource,'Word Match round selector not found');
const choose=vm.runInNewContext(`${chooseSource}\nchooseWordCards`);
for(const first of vocabulary) {
  const order=[first,...allCards.filter(key=>key!==first)].map(word=>({dataset:{word}}));
  const selected=[...choose(order)].map(card=>card.dataset.word);
  assert.equal(selected.length,12,`${first}: round must still show twelve cards`);
  assert.equal(new Set(selected).size,12,`${first}: repeated word in one round`);
  assert(selected.includes(first),`${first}: food cannot enter a round`);
  assert(!(selected.includes('bread') && selected.includes('toast')),'identical bread/toast art in one round');
}
assert.match(html, /function resetWord\([^\n]+selected=chooseWordCards\(cards\)/);
assert.match(html, /function speakWord\([^\n]+SpeechSynthesisUtterance\(wordNames\[wordCurrent\.dataset\.word\]\)/);
assert.match(html, /if\(card===wordCurrent\) \{ card\.classList\.add\('matched'\); correctSound\(\);/);
assert.match(html, /else wordWrongFeedback\(\)/);

const resetSource=html.match(/^      function resetWord\([^\n]+$/m)?.[0];
for(const random of [0,.5,.999]) {
  const cards=allCards.map(word=>{
    const classes=new Set(['matched','queued']);
    return {dataset:{word},classList:{
      remove:(...names)=>names.forEach(name=>classes.delete(name)),
      toggle:(name,on)=>on ? classes.add(name) : classes.delete(name),
      contains:name=>classes.has(name)
    }};
  });
  const context={
    Math:Object.assign(Object.create(Math),{random:()=>random}),
    document:{querySelectorAll:()=>cards},
    wordFinish:{classList:{remove(){}}},
    wordBoard:{append(){}},
    stopSpeech(){},selectWord(){},setTimeout(){}
  };
  vm.runInNewContext(`${chooseSource}\n${resetSource}\nresetWord(false)`,context);
  const visible=cards.filter(card=>!card.classList.contains('queued')).map(card=>card.dataset.word);
  assert.equal(visible.length,12,`fixed random ${random}: wrong card count`);
  assert.equal(new Set(visible).size,12,`fixed random ${random}: repeated card`);
  assert(!(visible.includes('bread') && visible.includes('toast')),`fixed random ${random}: indistinguishable bread/toast pair`);
}
const speechSource=html.match(/^      function speakWord\([^\n]+$/m)?.[0];
const spoken=[];
const speechContext={
  wordCurrent:null,wordScreen:{hidden:false},wordNames:names,wordSpeaker:{setAttribute(){}},
  window:{speechSynthesis:{}},speechRate:.95,voice:()=>null,isCurrentUtterance:()=>true,
  SpeechSynthesisUtterance:class { constructor(text) { this.text=text; } },
  playSpeech:utterance=>spoken.push(utterance.text)
};
const speak=vm.runInNewContext(`${speechSource}\nspeakWord`,speechContext);
for(const key of vocabulary) { speechContext.wordCurrent={dataset:{word:key}}; speak(); }
assert.deepEqual(spoken,vocabulary.map(key=>names[key]),'Item Match speech must use the single-word labels');

console.log('PASS Item Match: 63 existing + house = 64 unique words, 12-card rounds, shared house art, image references, speech and answer paths');
