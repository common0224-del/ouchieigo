import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const literal=name=>{
  const match=html.match(new RegExp(`const ${name}\\s*=\\s*(\\[[\\s\\S]*?\\n      \\]|\\{[^;]+?\\})(?=;|,)`));
  assert(match,`Missing ${name}`);
  return JSON.parse(JSON.stringify(vm.runInNewContext(`(${match[1]})`,{}, {timeout:1000})));
};
const tasks=literal('entranceTasks');
const zones=literal('entranceZones');
const itemNames=literal('entranceItemNames');
const targetNames=literal('entranceTargetNames');
assert.equal(tasks.length,27);
assert.equal(tasks.flatMap(task=>task.phrases).length,81);
assert.deepEqual(Object.keys(itemNames),['shoes','rain-boots','hat','jacket','bag','umbrella','keys','water-bottle','handkerchief']);
assert.deepEqual(Object.keys(targetNames),['girl','mom','cabinet','rack','bag','floor']);
assert.deepEqual(Object.keys(zones),['cabinet','mom','rack','girl','bag','floor']);
assert.deepEqual(zones.rack,[455,95,650,615],'Coat rack must cover its left and right branches without reaching Mom or Girl');
assert.deepEqual(zones.floor,[20,850,355,1000],'Floor must extend down the entrance tile without reaching the caption');
const itemJapanese={shoes:'くつ','rain-boots':'ながぐつ',hat:'ぼうし',jacket:'うわぎ',bag:'かばん',umbrella:'かさ',keys:'かぎ','water-bottle':'すいとう',handkerchief:'ハンカチ'};
const targetJapanese={girl:'おんなのこ',mom:'ママ',cabinet:'キャビネット',rack:'コートかけ',bag:'かばん',floor:'ゆか'};
for(const [target,japanese] of Object.entries(targetJapanese))
  assert.match(html,new RegExp(`id="entrance-label-${target}" data-jp="${japanese}">${targetNames[target]}</span>`));
const pairs=tasks.map(task=>`${task.item}:${task.target}`);
assert.equal(new Set(pairs).size,27,'Duplicate item/destination task');
assert.deepEqual(pairs,[
  'shoes:girl','shoes:cabinet','shoes:floor','rain-boots:girl','rain-boots:cabinet','rain-boots:floor',
  'hat:girl','hat:rack','hat:bag','hat:cabinet','jacket:girl','jacket:rack','jacket:mom',
  'bag:girl','bag:rack','bag:mom','umbrella:mom','umbrella:cabinet','umbrella:rack',
  'keys:mom','keys:cabinet','water-bottle:girl','water-bottle:mom','water-bottle:bag',
  'handkerchief:girl','handkerchief:mom','handkerchief:bag',
]);
assert.deepEqual(Object.fromEntries(Object.keys(targetNames).map(id=>[id,tasks.filter(task=>task.target===id).length])),
  {girl:7,mom:6,cabinet:5,rack:4,bag:3,floor:2});
for(const [index,task] of tasks.entries()) {
  assert(itemNames[task.item] && targetNames[task.target] && zones[task.target],`Task ${index+1} has unknown item or target`);
  assert(task.caption?.trim(),`Task ${index+1} has no Japanese caption`);
  assert.equal(task.phrases?.length,3,`Task ${index+1} needs three phrases`);
  assert.equal(new Set(task.phrases).size,3,`Task ${index+1} duplicates a phrase`);
  for(const phrase of task.phrases) assert(phrase.trim() && !phrase.includes('backpack') && !phrase.includes('tuck'),`Task ${index+1} has an invalid phrase`);
}
for(const [number,noun] of [[8,'hat'],[12,'jacket'],[15,'bag'],[19,'umbrella']]) {
  assert.deepEqual([...tasks[number-1].phrases],[
    `Hang your ${noun} on the coat rack.`,
    `Please hang your ${noun} on the coat rack.`,
    `Can you hang your ${noun} on the coat rack?`,
  ],`Task ${number}: approved coat-rack wording changed`);
}
assert.deepEqual([...tasks[26].phrases],[
  'Put your handkerchief in your bag.',
  'Please put your handkerchief in your bag.',
  'Can you put your handkerchief in your bag?',
]);
assert.equal(tasks[26].caption,'ハンカチを かばんに いれて。');
assert.match(html,/const entranceTaskData=withTaskMeta\('entrance',entranceTasks\)/);
assert.match(html,/entrance:\{tasks:entranceTaskData,zones:entranceZones,itemNames:entranceItemNames,targetNames:entranceTargetNames\}/);
assert.match(html,/function chooseFreshTask\(sceneName,candidates\).*choose\(eligible\)/);
assert.match(html,/function chooseTaskPhrase\(task\).*Math\.floor\(Math\.random\(\)\*variants\.length\)/);
const pickerSource=[
  html.match(/^      const choose = a => .+;$/m)?.[0],
  html.match(/^      function chooseFreshTask\(sceneName,candidates\) .+$/m)?.[0],
  html.match(/^      function chooseTaskPhrase\(task\) .+$/m)?.[0],
].join('\n');
assert(!pickerSource.includes('chooseWeightedTask') && !pickerSource.includes('taskWeight'),
  'Entrance must not use learning-history weights');
const drawMath=Object.create(Math);
let draw=0;
drawMath.random=()=>draw;
const pickerContext=vm.createContext({Math:drawMath,recentTaskIds:{entrance:[]},consecutiveMistakes:{entrance:0}});
vm.runInContext(`${pickerSource}\nthis.pick=(candidates)=>chooseFreshTask('entrance',candidates); this.phrase=(task)=>chooseTaskPhrase(task);`,pickerContext);
const candidates=tasks.map((task,index)=>({id:`entrance-${index}`,...task}));
for(let index=0;index<27;index++) {
  pickerContext.recentTaskIds.entrance=[];
  draw=(index+.5)/27;
  assert.equal(pickerContext.pick(candidates).id,`entrance-${index}`,`Task ${index+1} must be a uniform-draw candidate`);
}
pickerContext.recentTaskIds.entrance=['entrance-0','entrance-1','entrance-2'];
draw=0;
assert.equal(pickerContext.pick(candidates).id,'entrance-3','Recent tasks must be excluded when alternatives exist');
for(const [random,index] of [[0,0],[.4,1],[.8,2]]) {
  draw=random;
  assert.equal(pickerContext.phrase({...tasks[0]}),tasks[0].phrases[index],`Phrase ${index+1} must be selectable`);
}
assert.doesNotMatch(html,/entranceCompleted/,'Entrance must not finish based on a fixed number of correct answers');
assert.match(html,/function nextEntrance\(\) \{ selectEntranceTask\(\); if\(!entranceCurrent\) \{ finishEntrance\(\); return; \}/,
  'Entrance must finish only when the shared selector finds no unfinished, visible item');
assert.match(html,/onCorrect:\(el,slot\)=>\{spawnEntranceItem\(slot\);correctSound\(\);/,
  'A correct drop must refill the vacated tray slot before the next task');
assert.match(html,/function spawnEntranceItem\(slot\) \{ if\(!entranceQueue\.length\) return;.*el\.classList\.remove\('queued'\); setEntranceSlot\(el,slot\); \}/,
  'A waiting Entrance card must be restored to the vacated tray slot');
assert.match(html,/onWrong:entranceWrongFeedback/,'Wrong drops must use the shared restore path rather than advance completion');
const selectorSource=html.match(/^      function selectListenSceneTask\(descriptor\) .+$/m)?.[0];
assert(selectorSource,'Shared life-scene selector is missing');
const used=new Set();
const queued=new Set(['keys','water-bottle','handkerchief']);
const cards=Object.fromEntries(Object.keys(itemNames).map(item=>[item,{classList:{contains:name=>name==='done' ? used.has(item) : name==='queued' ? queued.has(item) : false}}]));
let selected;
pickerContext.listenInteractionControllers={};
pickerContext.descriptor={name:'entrance',tasks:candidates,itemFor:item=>cards[item],setCurrent:task=>{selected=task;},setPhrase:()=>{},onSelect:()=>{},updateCaption:()=>{}};
vm.runInContext(`${selectorSource}\nthis.selectVisible=()=>selectListenSceneTask(descriptor);`,pickerContext);
for(const item of ['shoes','rain-boots','hat','jacket','bag']) used.add(item);
queued.clear(); // The three waiting cards have been replenished into tray slots.
pickerContext.selectVisible();
assert(selected && !used.has(selected.item),'Five correct drops must not finish while unused cards remain');
pickerContext.selectVisible();
assert(selected && !used.has(selected.item),'A wrong drop must leave the current item selectable');
for(const item of Object.keys(itemNames)) used.add(item);
pickerContext.selectVisible();
assert.equal(selected,null,'The shared selector must finish only after all nine cards are done');
assert.match(html,/bindListenSceneInteractions\(\{descriptor:listenScenes\.entrance/,'Entrance must use the existing drag and drop system');
assert.match(html,/configureTargetHints\(entranceScene,entranceZones\)/);
assert.match(html,/id="open-entrance"/);
assert.match(html,/id="entrance-screen"/);
assert.match(html,/id="entrance-label-layer"/);
assert.match(html,/function openEntrance\(\).*speakSceneIntro/);
assert.match(html,/id="entrance-kana"/);
assert(html.includes(':is(#game-screen,#breakfast-screen,#living-screen,#bedroom-screen,#entrance-screen,#shopping-screen,#word-screen,#action-screen,#think-screen,#bath-time-screen) * { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none;'), 'Life-scene touch selection suppression must include Entrance and Bath Time');
assert.match(html,/#entrance-screen img, #shopping-screen img/);

const background='entrance-stage-v1e.png.webp';
assert(fs.existsSync(path.join(root,background)));
assert.match(html,new RegExp(`<image href="${background.replaceAll('.','\\.')}" width="900" height="1200"`));
const digest=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
assert.equal(digest(background),'b32221e4c7e6a13504d557f51ed28d1908cb1adbf894209c26a5a9860181db2a',
  'The published Entrance background must be the approved, unchanged first candidate');
for(const [item,version] of Object.entries({shoes:'v1a','rain-boots':'v1b',hat:'v1a',jacket:'v1b',bag:'v1b',umbrella:'v1a',keys:'v1a','water-bottle':'v1b',handkerchief:'v1a'})) {
  const file=`entrance-item-${item}-${version}.png.webp`;
  assert(fs.existsSync(path.join(root,file)),`Missing public item image: ${file}`);
  assert.match(html,new RegExp(`data-entrance-item="${item}"[^>]*data-label="${itemNames[item]}" data-jp="${itemJapanese[item]}"[^>]*><img[^>]*src="${file.replaceAll('.','\\.')}"[^>]*draggable="false"`));
}

const overlaps=(a,b)=>Math.min(a[2],b[2])>Math.max(a[0],b[0]) && Math.min(a[3],b[3])>Math.max(a[1],b[1]);
for(const [width,height] of [[375,667],[390,844],[430,932]]) {
  const tray=Math.min(142,Math.max(110,height*.17));
  const artHeight=height-68-tray;
  const bounds=Object.entries(zones).map(([name,rect])=>{
    const [x1,y1,x2,y2]=rect;
    assert(x1>=0 && y1>=0 && x2<=900 && y2<=1200 && x1<x2 && y1<y2,`${name}: invalid zone`);
    const scaled=[x1/900*width,y1/1200*artHeight,x2/900*width,y2/1200*artHeight];
    assert(scaled[2]-scaled[0]>=48 && scaled[3]-scaled[1]>=48,`${width}×${height}: ${name} is too small`);
    assert(scaled[3]<artHeight*.84,`${width}×${height}: ${name} extends into caption area`);
    return [name,scaled];
  });
  for(let i=0;i<bounds.length;i++) for(let j=i+1;j<bounds.length;j++)
    assert(!overlaps(bounds[i][1],bounds[j][1]),`${width}×${height}: ${bounds[i][0]} overlaps ${bounds[j][0]}`);
  const labelWidths={cabinet:86,mom:45,rack:75,girl:70,bag:50,floor:50};
  for(const lines of [1,2]) {
    const labelRects=Object.keys(targetNames).map(name=>{
      const css=html.match(new RegExp(`#entrance-label-${name} \\{([^}]+)\\}`))?.[1];
      assert(css,`Missing label coordinates: ${name}`);
      const x=Number(css.match(/left:([\d.]+)%/)?.[1])/100*width;
      const y=Number(css.match(/top:([\d.]+)%/)?.[1])/100*artHeight;
      const labelWidth=labelWidths[name], labelHeight=lines===1?18:30;
      const centered=css.includes('translateX(-50%)') || css.includes('translate(-50%,-100%)');
      const above=css.includes('translate(-50%,-100%)');
      const rect=[x-(centered?labelWidth/2:0),y-(above?labelHeight:0),x+(centered?labelWidth/2:labelWidth),y+(above?0:labelHeight)];
      assert(rect[0]>=0 && rect[1]>=0 && rect[2]<=width && rect[3]<=artHeight*.84,`${width}×${height}: ${name} label leaves safe area`);
      return [name,rect];
    });
    for(let i=0;i<labelRects.length;i++) for(let j=i+1;j<labelRects.length;j++)
      assert(!overlaps(labelRects[i][1],labelRects[j][1]),`${width}×${height}: labels ${labelRects[i][0]} / ${labelRects[j][0]} overlap`);
  }
  console.log(`PASS Entrance ${width}×${height}: 6 zones ≥48px, no overlaps, 1/2-line label estimates within image`);
}
console.log('PASS Entrance data: 27 tasks, 81 phrases, 9 items, 6 targets and shared controls');
