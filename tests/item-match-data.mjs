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
const existingNames=literal('wordNames'), existingJapanese=literal('wordJapanese');
const bathWordMatch=html.match(/const bathTimeWordItems=(\[[^;]+\]);/);
assert(bathWordMatch,'Bath Time shared Item Match registrations are missing');
const bathWordItems=JSON.parse(JSON.stringify(vm.runInNewContext(`(${bathWordMatch[1]})`)));
const bathWords=bathWordItems.map(([key])=>key);
const names={...existingNames,...Object.fromEntries(bathWordItems.map(([key,en])=>[key,en]))};
const japanese={...existingJapanese,...Object.fromEntries(bathWordItems.map(([key,,jp])=>[key,jp]))};
const original='toothbrush cup towel soap toothpaste comb toast banana milk cereal spoon plate mug fork chopsticks apple bowl napkin sink tray rack basket table boy girl book remote blanket blocks car tissue crayons doll teddy-bear cat turtle rabbit cookie-wrapper cat-drawing bookshelf mom sofa toybox bin pajamas pillow socks alarm-clock nightcap bed dad drawer night-table'.split(' ');
const food='apple banana milk bread egg tomato carrot potato chicken pork beef fish strawberry'.split(' ');
const added='bread egg tomato carrot potato chicken pork beef fish strawberry'.split(' ');
const vocabulary=[...food,'house',...bathWords];
assert.equal(original.length,53);
assert.equal(new Set(original).size,53);
assert.deepEqual(Object.keys(existingNames),[...original,...added,'house'],'existing vocabulary or registration order changed');
assert.deepEqual(Object.keys(existingJapanese),[...original,...added,'house'],'existing Japanese vocabulary changed');
assert.equal(Object.keys(existingNames).length,64,'pre-addition Item Match count changed');
assert.deepEqual(Object.keys(names),[...original,...added,'house',...bathWords],'shared Bath Time words are missing or reordered');
assert.deepEqual(Object.keys(japanese),Object.keys(names),'Japanese vocabulary is missing or duplicated');
assert.equal(Object.keys(names).length,71);
assert.deepEqual(bathWordItems,[
  ['shampoo','Shampoo','シャンプー','bath-time-item-shampoo-pump-v2.webp'],
  ['sponge','Sponge','スポンジ','bath-time-item-sponge-v1.webp'],
  ['rubber-duck','Rubber duck','あひるのおもちゃ','bath-time-item-rubber-duck-v1.webp'],
  ['washbowl','Washbowl','せんめんき','bath-time-item-washbowl-v1.webp'],
  ['shower','Shower','シャワー','bath-time-item-shower-v1.webp'],
  ['bathtub','Bathtub','バスタブ','item-match-bathtub-v1.webp'],
  ['hook','Hook','フック','item-match-hook-v1.webp']
]);
assert.equal(new Set(bathWords).size,7,'duplicate Bath Time word ID');
assert(bathWords.every(word=>!(word in existingNames)),'Bath Time word ID already registered');
assert(bathWordItems.every(([,en])=>!Object.values(existingNames).some(value=>value.toLowerCase()===en.toLowerCase())),'Bath Time English label already registered');
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
const allCards=[...staticCards,...dynamicCards,...bathWords];
assert.equal(allCards.length,71,'each vocabulary entry needs exactly one card');
assert.equal(new Set(allCards).size,71,'duplicate Item Match cards');
assert.deepEqual(new Set(allCards),new Set(Object.keys(names)),'word tables and cards differ');
assert.match(html,/bathTimeWordItems\.forEach\(\(\[word,label,jp,src\]\)=>\{ wordNames\[word\]=label; wordJapanese\[word\]=jp;/,'new words must use the existing label and speech maps');
assert.match(html,/bathTimeWordItems\.forEach\([^\n]+wordBoard\.insertBefore\(card,wordFinish\); \}\);/,'new words must join the Item Match card pool');
for(const [key,, ,image] of bathWordItems) {
  assert(fs.existsSync(path.join(root,image)),`Missing shared image: ${image}`);
  if(key!=='bathtub' && key!=='hook') assert.match(html,new RegExp(`<button class="living-item bath-time-item" data-bath-time-item="${key}"[^>]*><img[^>]* src="${image.replaceAll('.','\\.')}"`),`${key}: Bath Time must keep the same image reference`);
}
for(const [key,scale] of Object.entries({shampoo:1.4,sponge:1,'rubber-duck':1.05,washbowl:1.8,shower:1.3})) {
  const css=html.match(new RegExp(`\\.word-card\\[data-word="${key}"\\] img \\{([^}]+)\\}`))?.[1] || '';
  if(scale===1) assert.doesNotMatch(css,/scale\(/,`${key}: existing card image size should be reused`);
  else assert.match(css,new RegExp(`scale\\(${scale}\\)`),`${key}: incorrect image scale`);
}
for(const [key,scale] of Object.entries({bathtub:1.12,hook:1.35})) {
  const css=html.match(new RegExp(`\\.word-card\\[data-word="${key}"\\] img \\{([^}]+)\\}`))?.[1] || '';
  assert.match(css,new RegExp(`scale\\(${scale}\\)`),`${key}: incorrect image scale`);
}
assert.match(board,/<button class="word-card" data-word="house" type="button" aria-label="House"><img src="word-item-house-v2\.png\.webp" alt=""><\/button>/,'House card must use the shared illustration');
assert(fs.existsSync(path.join(root,'word-item-house-v2.png.webp')),'Shared House illustration is missing');
assert.match(html,/\.word-card img, \.word-card \.word-sprite \{ width:91%; height:91%; object-fit:contain;/,'House art must use existing card image sizing');
assert.match(html,/\.screen-header \.home-icon \{ display:block; width:30px; height:30px; object-fit:contain;/,'Home art must fit inside the existing button');
assert.equal([...html.matchAll(/class="home-icon" src="word-item-house-v2\.png\.webp"/g)].length,11,'Every home button, including Bath Time, must share the Item Match House asset');
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
assert.match(html, /if\(card===wordCurrent\) \{ card\.classList\.add\('matched'\); advanceWordCombo\(\); correctSound\(\);/);
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
    stopSpeech(){},clearWordComboAnimation(){},selectWord(){},setTimeout(){}
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

console.log('PASS Item Match: 64 existing + 7 Bath Time = 71 unique words, 12-card rounds, shared assets, speech and answer paths');
