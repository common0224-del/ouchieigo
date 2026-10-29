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
const tasks=literal('bathTimeTasks');
const zones=literal('bathTimeZones');
const items=literal('bathTimeItemNames');
const targets=literal('bathTimeTargetNames');
assert.deepEqual(zones.boy,[165,315,370,535]);
assert.deepEqual(zones.bathtub,[75,580,450,900]);
assert.deepEqual(zones.washing,[637,770,895,1007]);
assert.equal((zones.washing[2]-zones.washing[0])/(895-680),1.2,'Washing area width must grow by 20%');
assert((zones.washing[3]-zones.washing[1])/(975-770)>=1.15,'Washing area height must grow by approximately 20%');
assert.deepEqual(zones.hook,[690,10,900,185],'Hook needs a reachable, enlarged touch area');
assert.deepEqual(zones.dad,[475,185,845,735],'Dad must remain separated from Hook');
const expectedPairs=[
  'towel:dad','towel:hook','towel:boy',
  'shampoo:boy','shampoo:dad','shampoo:shelf',
  'soap:boy','soap:dad','soap:shelf',
  'sponge:boy','sponge:dad','sponge:shelf',
  'rubber-duck:boy','rubber-duck:bathtub','rubber-duck:shelf',
  'washbowl:dad','washbowl:bathtub','washbowl:washing',
  'shower:boy','shower:dad',
];
assert.deepEqual(tasks.map(task=>`${task.item}:${task.target}`),expectedPairs);
assert.equal(Object.keys(items).length,7);
assert.equal(Object.keys(targets).length,6);
assert.equal(tasks.length,20);
const phrases=tasks.flatMap(task=>task.phrases);
assert.equal(phrases.length,60);
assert.equal(new Set(phrases).size,60,'English instructions must be unique');
for(const [index,task] of tasks.entries()) {
  assert(items[task.item] && targets[task.target] && zones[task.target],`Task ${index+1}: invalid item or destination`);
  assert.equal(task.phrases.length,3,`Task ${index+1}: not three phrases`);
  assert(task.caption && task.phrases.every(phrase=>phrase.trim()),`Task ${index+1}: missing wording`);
}
assert.deepEqual(tasks.find(task=>task.item==='towel' && task.target==='boy').phrases,[
  'Take the towel.','Please take the towel.','Can you take the towel?',
]);
assert.deepEqual(tasks.find(task=>task.item==='shower' && task.target==='boy').phrases,[
  'Hold the shower head.','Please hold the shower head.','Can you hold the shower head?',
]);
assert.deepEqual(tasks.find(task=>task.item==='shower' && task.target==='dad').phrases,[
  'Hand Dad the shower head.','Please give the shower head to Dad.','Can you hand Dad the shower head?',
]);
assert(tasks.find(task=>task.item==='washbowl' && task.target==='bathtub').phrases.every(phrase=>phrase.toLowerCase().includes('scoop') && phrase.includes('water')),
  'Washbowl/Bathtub must mean scooping water');

const overlap=(a,b)=>Math.min(a[2],b[2])>Math.max(a[0],b[0]) && Math.min(a[3],b[3])>Math.max(a[1],b[1]);
for(const [name,rect] of Object.entries(zones)) {
  assert(rect[0]>=0 && rect[1]>=0 && rect[2]<=900 && rect[3]<=1200 && rect[0]<rect[2] && rect[1]<rect[3],`${name}: invalid zone`);
  for(const [other,second] of Object.entries(zones)) if(name<other) assert(!overlap(rect,second),`${name}/${other}: zones overlap`);
}
for(const [width,height] of [[375,667],[390,844],[430,932]]) {
  const tray=Math.min(142,Math.max(110,height*.17));
  const artHeight=height-68-tray;
  for(const [name,[x1,y1,x2,y2]] of Object.entries(zones)) {
    assert((x2-x1)*width/900>=48 && (y2-y1)*artHeight/1200>=48,`${width}×${height}: ${name} zone too small`);
    assert(y2/1200*artHeight<artHeight*.84,`${width}×${height}: ${name} reaches caption/tray`);
  }
  assert((zones.hook[2]-zones.hook[0])*width/900>=80,`${width}×${height}: Hook is too narrow`);
  assert((zones.hook[3]-zones.hook[1])*artHeight/1200>=65,`${width}×${height}: Hook is too short`);
}
// Source artwork bounds at alpha > 16, measured without changing the approved WebP files.
// The visible paintings, rather than their transparent 512×341 canvases, must fit each 48×54 card.
const paintedPixels={towel:[356,201],shampoo:[140,270],soap:[292,221],sponge:[458,268],'rubber-duck':[320,304],washbowl:[220,137],shower:[251,287]};
const scales={towel:1.25,shampoo:1.65,soap:1.45,sponge:.98,'rubber-duck':1.28,washbowl:1.95,shower:1.45};
assert(html.includes('#bath-time-scene .bath-time-item .breakfast-item-art { transform:translateX(var(--art-center-x, 0px)) scale(var(--bath-icon-scale, 1)); }'));
for(const [item,scale] of Object.entries(scales)) {
  const cssScale=String(scale).replace(/^0\./,'.');
  assert(html.includes(`#bath-time-scene [data-bath-time-item="${item}"] { --bath-icon-scale:${cssScale}; }`),`${item}: missing individual scale`);
  const [paintWidth,paintHeight]=paintedPixels[item];
  assert(paintWidth*54/512*scale<=48 && paintHeight*54/512*scale<=54,`${item}: visible art exceeds its card`);
}

// Approved public assets must stay byte-for-byte identical; private prototypes
// are intentionally not required in a public checkout.
const approvedHashes={
  'bath-time-stage-v1.webp':'fb8a74eef4db06bee00f8a5d11119921b1b54d1db524b8c0242442d71206b352',
  'bath-time-item-shampoo-pump-v2.webp':'0ff066ef564e66fb42e4ae87723dc95e455cdc3d22f94ed17d585bfabc4b1253',
  'bath-time-item-sponge-v1.webp':'45bdd02e90d98f9460c5bae9e88a65f305e28c25671423ddc5165cc1932a295e',
  'bath-time-item-rubber-duck-v1.webp':'94275b541dbcec6bd4eb646b6a370b32b31b4960c051ad88876dc61b66b3cc77',
  'bath-time-item-washbowl-v1.webp':'321402f64f0f40055bc714c16f5804862933e8ec9cfef9e450a64a8c28b6934d',
  'bath-time-item-shower-v1.webp':'84eb162d4ea7cfbdc3c8c78e1ecf0577f9082a308dbddc4a822f791be9658d84',
};
const hash=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
for(const [publicFile,approvedHash] of Object.entries(approvedHashes)) {
  assert(fs.existsSync(path.join(root,publicFile)),`${publicFile}: missing public asset`);
  assert.equal(hash(publicFile),approvedHash,`${publicFile}: approved asset was changed`);
}
assert(html.includes('<image href="bath-time-stage-v1.webp" width="900" height="1200"/>'));
for(const [item,file] of Object.entries({towel:'bathroom-item-towel-v4.png.webp',shampoo:'bath-time-item-shampoo-pump-v2.webp',soap:'bathroom-item-soap-v4.png.webp',sponge:'bath-time-item-sponge-v1.webp','rubber-duck':'bath-time-item-rubber-duck-v1.webp',washbowl:'bath-time-item-washbowl-v1.webp',shower:'bath-time-item-shower-v1.webp'})) {
  assert(fs.existsSync(path.join(root,file)),`${item}: missing image`);
  assert(html.includes(`data-bath-time-item="${item}"`),`${item}: missing card`);
  assert(html.includes(`src="${file}"`),`${item}: wrong image reference`);
}
for(const part of [
  "const bathTimeTaskData=withTaskMeta('bath-time',bathTimeTasks)",
  "'bath-time':{tasks:bathTimeTaskData,zones:bathTimeZones,itemNames:bathTimeItemNames,targetNames:bathTimeTargetNames}",
  "bathTimeQueue=items.slice(traySlotCount)",
  "if(index<traySlotCount) setBathTimeSlot(el,index)",
  "spawnBathTimeItem(slot);correctSound()",
  "if(!bathTimeCurrent) { finishBathTime(); return; }",
  "onWrong:bathTimeWrongFeedback",
  "bindListenSceneInteractions({descriptor:listenScenes['bath-time']",
  "configureTargetHints(bathTimeScene,bathTimeZones)",
  "id=\"bath-time-kana\"",
  "id=\"bath-time-play-again\"",
  "id=\"bath-time-reset\"",
  "id=\"bath-time-speaker\"",
  "SPEECH_DEBUG",
]) assert(html.includes(part),`Missing Bath Time integration: ${part}`);
const selectorSource=html.match(/^      function selectListenSceneTask\(descriptor\) .+$/m)?.[0];
assert(selectorSource,'Shared life-scene task selector is missing');
const done=new Set(), queued=new Set(['shower']);
const cards=Object.fromEntries(Object.keys(items).map(item=>[item,{classList:{contains:flag=>flag==='done'?done.has(item):flag==='queued'?queued.has(item):false}}]));
let selected;
const context=vm.createContext({listenInteractionControllers:{},chooseFreshTask:(_scene,candidates)=>candidates[0] || null,
  descriptor:{name:'bath-time',tasks,itemFor:item=>cards[item],setCurrent:task=>{selected=task;},setPhrase:()=>{},onSelect:()=>{},updateCaption:()=>{}}});
vm.runInContext(`${selectorSource}\nthis.pick=()=>selectListenSceneTask(descriptor);`,context);
const answered=[];
for(let index=0;index<7;index++) {
  context.pick();
  assert(selected && !done.has(selected.item),`Answer ${index+1}: item was repeated or game ended early`);
  answered.push(selected.item);
  done.add(selected.item);
  if(index===0) queued.delete('shower'); // The seventh card fills the first vacant tray slot.
}
assert.equal(new Set(answered).size,7,'Each Bath Time item must be answered once');
context.pick();
assert.equal(selected,null,'Bath Time must finish only after all seven items are done');
console.log('PASS Bath Time: 7 items, 6 non-overlapping zones, 20 tasks, 60 unique phrases, approved assets and shared controls');
