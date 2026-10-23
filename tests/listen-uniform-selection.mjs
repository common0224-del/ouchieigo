import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const html=fs.readFileSync(path.resolve('index.html'),'utf8');
const line=pattern=>{
  const match=html.match(pattern);
  assert(match,`Listen & Do selection source is missing: ${pattern}`);
  return match[0];
};
const source=[
  line(/^      const choose = a => .+;$/m),
  line(/^      function chooseFreshTask\(sceneName,candidates\) .+$/m),
  line(/^      function chooseTaskPhrase\(task\) .+$/m),
  line(/^      function selectListenSceneTask\(descriptor\) .+$/m),
].join('\n');
assert(!line(/^      function chooseFreshTask\(sceneName,candidates\) .+$/m).includes('chooseWeightedTask'),
  'The active task picker must not use mastery or confusion weights');
assert.match(html,/function taskWeight\(task\)/,'Keep the weighted picker available for a future policy change');
assert.match(html,/function chooseWeightedTask\(candidates\)/);
assert.match(html,/localStorage\.setItem\(masteryStorageKey/,'Mastery recording must remain');
assert.match(html,/localStorage\.setItem\(confusionStorageKey/,'Confusion recording must remain');

const taskLists={bathroom:'tasks',breakfast:'breakfastTasks',living:'livingTasks',bedroom:'bedroomTasks'};
const tasks=Object.fromEntries(Object.entries(taskLists).map(([scene,name])=>{
  const match=html.match(new RegExp(`const ${name}\\s*=\\s*(\\[[\\s\\S]*?\\n      \\]);`));
  assert(match,`${scene} task data is missing`);
  return [scene,vm.runInNewContext(match[1],{}, {timeout:1000}).map((task,index)=>({...task,id:`${scene}-${index}`}))];
}));
assert.deepEqual(Object.fromEntries(Object.entries(tasks).map(([scene,list])=>[scene,list.length])),
  {bathroom:16,breakfast:32,living:30,bedroom:21},'Only the approved Listen & Do task additions and removals are allowed');
assert.equal(Object.values(tasks).reduce((total,list)=>total+list.flatMap(task=>task.phrases).length,0),297);
for(const [scene,list] of Object.entries(tasks)) {
  assert(list.every(task=>task.phrases.length===3 && task.phrases.every(Boolean)),`${scene}: every task needs three phrases`);
  assert.equal(new Set(list.map(task=>task.id)).size,list.length,`${scene}: task IDs must be unique`);
}
const expectedItemCounts={
  bathroom:{toothbrush:3,cup:3,towel:4,soap:2,toothpaste:2,comb:2},
  breakfast:{toast:2,banana:3,milk:4,cereal:3,spoon:3,napkin:2,plate:2,mug:3,fork:3,chopsticks:3,apple:4},
  living:{book:3,remote:3,blanket:2,blocks:3,car:3,cup:2,tissue:3,crayons:2,doll:3,'cookie-wrapper':3,'cat-drawing':3},
};
for(const [scene,expected] of Object.entries(expectedItemCounts)) {
  const actual=Object.fromEntries([...new Set(tasks[scene].map(task=>task.item))].map(item=>[
    item,tasks[scene].filter(task=>task.item===item).length]));
  assert.deepEqual(actual,expected,`${scene}: an existing item lost a task or gained an unapproved one`);
}
assert.match(html,/\.living-instruction-caption \.kana-text \{ white-space:pre-line; \}/,
  'Two-line Japanese instructions must retain their line break in the hint caption');
const taskFor=(scene,item,target)=>tasks[scene].filter(task=>task.item===item && task.target===target);
const soleTask=(scene,item,target)=>{
  const found=taskFor(scene,item,target);
  assert.equal(found.length,1,`${scene}: expected exactly one ${item} → ${target} task`);
  return found[0];
};
assert.deepEqual(Array.from(soleTask('bathroom','cup','boy').phrases),[
  'Use your cup to rinse your mouth.','Rinse your mouth with water from your cup.','Take your cup and rinse your mouth.']);
assert.equal(soleTask('bathroom','cup','boy').caption,'コップを つかって くちを ゆすごう。');
assert.deepEqual(Array.from(soleTask('bathroom','cup','organizer').phrases),[
  'Put your cup back on the tray.','Please put your cup back on the tray.','Can you put your cup back on the tray?']);
assert.equal(soleTask('bathroom','cup','organizer').caption,'コップを トレーに もどしてね。');
assert.deepEqual(Array.from(soleTask('bathroom','towel','boy').phrases),[
  'Wipe your face with the towel.','Please wipe your face with the towel.','Can you wipe your face with the towel?']);
assert.equal(soleTask('bathroom','towel','boy').caption,'タオルで かおを ふいてね。');
assert.equal(soleTask('bathroom','soap','boy').phrases[1],"It's time to wash your hands with soap.");
assert.equal(taskFor('breakfast','spoon','bowl').length,0);
assert.equal(taskFor('breakfast','chopsticks','bowl').length,0);
for(const item of ['spoon','chopsticks']) for(const target of ['table','sink','girl']) soleTask('breakfast',item,target);
assert.deepEqual(Array.from(soleTask('breakfast','milk','girl').phrases),[
  'Drink your milk.','It’s time to drink your milk.','Please have some milk.']);
assert.deepEqual(Array.from(soleTask('living','book','mom').phrases),[
  "Bring me the book. Let's read it together.",'Please bring me the book so we can read it together.',"Can you bring me the book? Let's read it together."]);
assert.equal(soleTask('living','book','mom').caption,'ほんを ママに もってきて。\nいっしょに よもう。');
assert.equal(soleTask('living','blanket','sofa').caption,'ブランケットを ソファに おいて。');
for(const [item,noun,japanese] of [['blocks','blocks','つみき'],['car','toy car','ミニカー']]) {
  const task=soleTask('living',item,'mom');
  assert.deepEqual(Array.from(task.phrases),[
    `Bring me the ${noun}. Let's play together.`,
    `Please bring me the ${noun} so we can play together.`,
    `Can you bring me the ${noun}? Let's play together.`]);
  assert.equal(task.caption,`${japanese}を ママに もってきて。\nいっしょに あそぼう。`);
}
assert.deepEqual(Array.from(soleTask('living','doll','mom').phrases),[
  'Bring me the doll so we can play together.',"Please bring me the doll. Let's play together.",
  'Can you bring me the doll so we can play together?']);
assert.equal(soleTask('living','doll','mom').caption,'おにんぎょうを ママに もってきて。\nいっしょに あそぼう。');
for(const target of ['toybox','sofa','mom']) {
  const task=soleTask('living','doll',target);
  assert.equal(task.randomNouns,undefined,'Living room must not alternate doll and stuffed toy');
  assert(task.phrases.every(phrase=>phrase.includes('doll')&&!phrase.includes('stuffed toy')&&!phrase.includes('{noun}')));
  assert(task.caption.includes('おにんぎょう')&&!task.caption.includes('ぬいぐるみ'));
}
assert.match(html,/<button class="living-item" data-living-item="doll" data-label="Doll" data-jp="おにんぎょう" aria-label="Doll"[^>]*><img class="breakfast-item-art" src="living-item-doll-v1\.png\.webp"/);
assert.doesNotMatch(html,/document\.querySelector\('\[data-living-item="doll"\] img'\)\.src=/);
assert.match(html,/\['doll','living-item-doll-v1\.png\.webp'\]/,'Item Match must share the doll image');
assert(fs.existsSync(path.resolve('living-item-doll-v1.png.webp')));
assert.deepEqual(Array.from(soleTask('living','cookie-wrapper','mom').phrases),[
  "I'm hungry. Can you bring me a cookie?","I'd like a cookie. Please bring me one.",
  "Can you bring me a cookie? I'd like to eat one."]);
assert.equal(soleTask('living','cookie-wrapper','mom').caption,'ママに クッキーを もってきて。\nママは クッキーが たべたいんだ。');
soleTask('living','cookie-wrapper','table');

const originalBedroomPairs=[
  'pajamas:boy','book:night-table','pillow:bed','pillow:dad','socks:boy',
  'alarm-clock:night-table','alarm-clock:dad','nightcap:basket','blanket:dad','stuffed-toy:night-table',
];
const addedBedroomTasks=[
  ['pajamas','basket','パジャマを せんたくかごに いれて。','Put your pajamas in the laundry basket.'],
  ['pajamas','drawer','パジャマを ひきだしに しまって。','Put your pajamas in the drawer.'],
  ['socks','basket','くつしたを せんたくかごに いれて。','Put your socks in the laundry basket.'],
  ['socks','drawer','くつしたを ひきだしに しまって。','Put your socks in the drawer.'],
  ['book','bookshelf','ほんを ほんだなに おいて。','Put the book on the bookshelf.'],
  ['book','bed','ほんを ベッドに おいて。','Put the book on the bed.'],
  ['pillow','boy','まくらを もって。','Hold your pillow.'],
  ['blanket','bed','もうふを ベッドに おいて。','Put the blanket on the bed.'],
  ['stuffed-toy','bed','ぬいぐるみを ベッドに おいて。','Put the stuffed toy on the bed.'],
  ['nightcap','drawer','ナイトキャップを ひきだしに しまって。','Put the nightcap in the drawer.'],
];
assert.equal(tasks.bedroom.length,21,'Bedroom must contain the original 20 plus the approved Nightcap → Boy task');
assert.deepEqual(Array.from(tasks.bedroom.slice(0,10),task=>`${task.item}:${task.target}`),originalBedroomPairs,
  'Keep the original Bedroom tasks and their stable IDs');
for(const [index,[item,target,caption,base]] of addedBedroomTasks.entries()) {
  const task=tasks.bedroom[index+10];
  assert.deepEqual([task.item,task.target,task.caption],[item,target,caption],`Bedroom addition ${index+1} is incorrect`);
  const stem=base.slice(0,-1);
  const expectedPhrases=item==='pillow' && target==='boy'
    ? ['Hold your pillow.','Please hold your pillow.','Can you hold your pillow, please?']
    : [base,`Please ${stem[0].toLowerCase()}${stem.slice(1)}.`,`Can you ${stem[0].toLowerCase()}${stem.slice(1)}?`];
  assert.deepEqual(Array.from(task.phrases),expectedPhrases,
    `Bedroom addition ${index+1} must have three equivalent English instructions`);
}
const bedroomPairs=tasks.bedroom.map(task=>`${task.item}:${task.target}`);
assert.equal(new Set(bedroomPairs).size,21,'Bedroom must not duplicate an item/target pair');
for(const target of ['night-table','bed']) {
  const task=soleTask('bedroom','stuffed-toy',target);
  assert(task.phrases.every(phrase=>phrase.includes('stuffed toy')&&!phrase.includes('doll')));
  assert(task.caption.includes('ぬいぐるみ')&&!task.caption.includes('おにんぎょう'));
}
assert.match(html,/data-bedroom-item="stuffed-toy" data-label="Stuffed toy" data-jp="ぬいぐるみ" aria-label="Stuffed toy"[^>]*><img class="breakfast-item-art" src="think-say-teddy-bear-v1\.png\.webp"/);
assert.match(html,/\['teddy-bear','think-say-teddy-bear-v1\.png\.webp'\]/,'Item Match must share the teddy bear image');
assert(fs.existsSync(path.resolve('think-say-teddy-bear-v1.png.webp')));
assert.doesNotMatch(html,/data-bedroom-item="doll-toy"|item:'doll-toy'/);
assert.deepEqual(Array.from(soleTask('bedroom','nightcap','boy').phrases),[
  'Put on your nightcap.','Please put on your nightcap.','Can you put on your nightcap?']);
assert.equal(soleTask('bedroom','nightcap','boy').caption,'ナイトキャップを かぶってね。');
soleTask('bedroom','nightcap','basket');
soleTask('bedroom','blanket','dad');
soleTask('bedroom','blanket','bed');
assert.deepEqual(new Set(tasks.bedroom.map(task=>task.target)),
  new Set(['bookshelf','bed','dad','drawer','night-table','boy','basket']),
  'All seven Bedroom destinations must be correct answers');
for(const item of ['pajamas','socks']) {
  assert.deepEqual(new Set(tasks.bedroom.filter(task=>task.item===item).map(task=>task.target)),
    new Set(['boy','basket','drawer']),`${item} must have three destinations`);
}
console.log('PASS Listen & Do approved content: 99 tasks, 297 phrases, exact additions/edits/removals');

function runtime() {
  let random=0;
  const math=Object.create(Math);
  math.random=()=>random;
  const recentTaskIds={bathroom:[],breakfast:[],living:[],bedroom:[]};
  const consecutiveMistakes={bathroom:0,breakfast:0,living:0,bedroom:0};
  const mastery={},confusions={};
  const listenInteractionControllers={};
  const functions=vm.runInNewContext(`${source}\n({chooseFreshTask,chooseTaskPhrase,selectListenSceneTask})`,
    {Math:math,recentTaskIds,consecutiveMistakes,mastery,confusions,listenInteractionControllers},{timeout:1000});
  return {...functions,recentTaskIds,consecutiveMistakes,mastery,confusions,setRandom:value=>{random=value;}};
}

const bedroomState=runtime();
const completedItems=new Set();
let selectedBedroomTask=null;
const bedroomDescriptor={
  name:'bedroom',tasks:tasks.bedroom,
  itemFor:item=>({classList:{contains:name=>name==='done' && completedItems.has(item)}}),
  setCurrent:task=>{selectedBedroomTask=task;},setPhrase:()=>{},onSelect:()=>{},updateCaption:()=>{},
};
bedroomState.selectListenSceneTask(bedroomDescriptor);
assert.equal(selectedBedroomTask?.item,'pajamas','The first Bedroom task must be selectable');
completedItems.add(selectedBedroomTask.item);
bedroomState.selectListenSceneTask(bedroomDescriptor);
assert.equal(selectedBedroomTask?.item,'book','After a completed item, Bedroom must advance to an available item');
for(const task of tasks.bedroom) completedItems.add(task.item);
bedroomState.selectListenSceneTask(bedroomDescriptor);
assert.equal(selectedBedroomTask,null,'Bedroom must finish after all available items are completed');
console.log('PASS bedroom progression: completed items leave the pool and the next task remains selectable');

for(const [scene,candidates] of Object.entries(tasks)) {
  assert(candidates.length>=4,`${scene} has too few tasks to test recent-task exclusion`);
  const state=runtime();
  assert.equal(state.chooseFreshTask(scene,[]),null);
  for(const historyMode of ['new','mastered','confused']) {
    Object.keys(state.mastery).forEach(key=>delete state.mastery[key]);
    Object.keys(state.confusions).forEach(key=>delete state.confusions[key]);
    if(historyMode==='mastered') state.mastery[candidates[0].id]=99;
    if(historyMode==='confused') state.confusions.example={selectedItem:candidates[0].item,expectedTarget:candidates[0].target,count:99};
    for(let index=0;index<candidates.length;index++) {
      state.recentTaskIds[scene]=[]; // All registered tasks have identical eligibility.
      state.setRandom((index+.5)/candidates.length);
      assert.equal(state.chooseFreshTask(scene,candidates),candidates[index],
        `${scene}: ${historyMode} changed the uniform task interval at ${index}`);
    }
  }

  const recentlyUsed=candidates.slice(0,3);
  const eligible=candidates.slice(3);
  for(let index=0;index<eligible.length;index++) {
    state.recentTaskIds[scene]=recentlyUsed.map(task=>task.id);
    state.setRandom((index+.5)/eligible.length);
    assert.equal(state.chooseFreshTask(scene,candidates),eligible[index],
      `${scene}: recent-task exclusion or uniform selection failed`);
  }
  assert(state.recentTaskIds[scene].length<=3,`${scene}: recent history grew beyond three tasks`);

  for(const registered of candidates) for(let index=0;index<registered.phrases.length;index++) {
    const task={...registered};
    const random=(index+.5)/task.phrases.length;
    state.setRandom(random);
    const noun=task.randomNouns?.[Math.floor(random*task.randomNouns.length)];
    assert.equal(state.chooseTaskPhrase(task),task.phrases[index].replaceAll('{noun}',noun?.en || ''),
      `${scene}: phrase variant ${index} cannot be selected`);
    assert.equal(task.activeCaption,noun ? (task.captions?.[index] || task.caption)?.replaceAll('{nounJp}',noun.jp) : task.captions?.[index] || task.caption,
      `${scene}: the Japanese caption changed with phrase variant ${index}`);
  }
  console.log(`PASS ${scene}: ${candidates.length} equal-probability tasks, recent exclusion, mastery/confusion independence, all phrase variants`);
}
