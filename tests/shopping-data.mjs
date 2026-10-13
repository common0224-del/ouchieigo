import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const html=fs.readFileSync(path.resolve('index.html'),'utf8');
const shuffleSource=html.match(/^      const shuffle = list => .+;$/m)?.[0];
const start=html.indexOf('      // Shopping question generation is kept separate until the shopping screen is built.');
const end=html.indexOf('      function setBreakfastSlot',start);
assert(shuffleSource && start>=0 && end>start,'Shopping data or the existing shuffle() was not found');
const shoppingSource=html.slice(start,end);
assert(!shoppingSource.includes('Math.random'),'Shopping generation must call the existing shuffle(), not Math.random directly');

function loadShopping(randomValue) {
  const fixedMath=Object.create(Math);
  fixedMath.random=()=>randomValue;
  return vm.runInNewContext(`${shuffleSource}\n${shoppingSource}\n({shoppingItemData,shoppingInstruction,buildShoppingQuestions})`,{Math:fixedMath});
}

const expectedItems={
  apple:{singular:'apple',plural:'apples',japanese:'りんご',counter:'こ'},
  banana:{singular:'banana',plural:'bananas',japanese:'バナナ',counter:'ぼん'},
  milk:{singular:'carton of milk',plural:'cartons of milk',japanese:'ぎゅうにゅうパック',counter:'こ'},
  bread:{singular:'slice of bread',plural:'slices of bread',japanese:'パン',counter:'まい'},
  egg:{singular:'egg',plural:'eggs',japanese:'たまご',counter:'こ'},
};
const numberWords=['one','two','three','four','five','six','seven','eight','nine','ten'];
const {shoppingItemData,shoppingInstruction}=loadShopping(0);
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(shoppingItemData).map(([key,item])=>[key,{cardEnglish:item.cardEnglish,image:item.image,sprite:item.sprite || null}])))),{
  apple:{cardEnglish:'apple',image:'breakfast-item-apple-v1.png.webp',sprite:null},
  banana:{cardEnglish:'banana',image:'think-say-banana-v1.png.webp',sprite:null},
  milk:{cardEnglish:'milk',image:'breakfast-items-v2.png.webp',sprite:'100% 0'},
  bread:{cardEnglish:'bread',image:'breakfast-items-v2.png.webp',sprite:'0 0'},
  egg:{cardEnglish:'egg',image:'shopping-item-egg-v1a.png.webp',sprite:null},
});
for(const [key,item] of Object.entries(expectedItems)) {
  for(let count=1;count<=10;count++) {
    const quantity=`${numberWords[count-1]} ${count===1 ? item.singular : item.plural}`;
    const object=`${item.japanese}を ${count}${item.counter}`;
    const expected=[
      {english:`Get ${quantity}.`,japanese:`${object} とって。`},
      {english:`Please put ${quantity} in the basket.`,japanese:`${object} かごに いれてね。`},
      {english:`Can you get ${quantity}, please?`,japanese:`${object} とってくれる？`},
    ];
    for(let pattern=0;pattern<3;pattern++) {
      assert.deepEqual(JSON.parse(JSON.stringify(shoppingInstruction(key,count,pattern))),expected[pattern],`${key}, ${count}, pattern ${pattern}`);
    }
  }
}
for(const [key,count,pattern] of [['unknown',1,0],['apple',0,0],['apple',11,0],['apple',1,3]]) {
  assert.throws(()=>shoppingInstruction(key,count,pattern),{name:'RangeError'});
}

for(const randomValue of [0,0.17,0.5,0.83,0.999]) {
  const {buildShoppingQuestions}=loadShopping(randomValue);
  const questions=JSON.parse(JSON.stringify(buildShoppingQuestions()));
  assert.equal(questions.length,5);
  assert.deepEqual(new Set(questions.map(question=>question.itemKey)),new Set(Object.keys(expectedItems)));
  for(const question of questions) {
    assert(Number.isInteger(question.count) && question.count>=1 && question.count<=10);
    assert([0,1,2].includes(question.patternIndex));
    assert.equal(question.itemChoices.length,4);
    assert.equal(new Set(question.itemChoices).size,4);
    assert(question.itemChoices.includes(question.itemKey));
    assert(question.itemChoices.every(key=>key in expectedItems));
    assert.equal(question.numberChoices.length,4);
    assert.equal(new Set(question.numberChoices).size,4);
    assert(question.numberChoices.includes(question.count));
    assert(question.numberChoices.every(number=>Number.isInteger(number) && number>=1 && number<=10));
    const instruction=shoppingInstruction(question.itemKey,question.count,question.patternIndex);
    assert.equal(question.englishInstruction,instruction.english);
    assert.equal(question.japaneseInstruction,instruction.japanese);
  }
  // A fixed random stream may legitimately repeat quantities; do not require distinct games.
  if(randomValue===0) assert(new Set(questions.map(question=>question.count)).size<5);
}

console.log('PASS shopping data: five unique items, counts 1–10, 150 bilingual phrases, four unique choices per side, fixed-random draws');
