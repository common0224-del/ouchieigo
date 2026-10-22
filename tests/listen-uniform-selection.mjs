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

const originalBedroomPairs=[
  'pajamas:boy','book:night-table','pillow:bed','pillow:dad','socks:boy',
  'alarm-clock:night-table','alarm-clock:dad','nightcap:basket','blanket:dad','doll-toy:night-table',
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
  ['doll-toy','bed','おにんぎょうと ぬいぐるみを ベッドに おいて。','Put the doll and stuffed toy on the bed.'],
  ['nightcap','drawer','ナイトキャップを ひきだしに しまって。','Put the nightcap in the drawer.'],
];
assert.equal(tasks.bedroom.length,20,'Bedroom must contain the original 10 plus 10 new tasks');
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
assert.equal(new Set(bedroomPairs).size,20,'Bedroom must not duplicate an item/target pair');
assert.deepEqual(new Set(tasks.bedroom.map(task=>task.target)),
  new Set(['bookshelf','bed','dad','drawer','night-table','boy','basket']),
  'All seven Bedroom destinations must be correct answers');
for(const item of ['pajamas','socks']) {
  assert.deepEqual(new Set(tasks.bedroom.filter(task=>task.item===item).map(task=>task.target)),
    new Set(['boy','basket','drawer']),`${item} must have three destinations`);
}
console.log('PASS bedroom additions: 20 unique tasks, 7 destinations, 10 exact captions and 3 English variants each');

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
