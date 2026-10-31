import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {checkIndexSyntax} from './check-index-syntax.mjs';
import {installSilentAudio,assertSilentAudio} from './silent-audio.mjs';

const root=path.resolve('.');
checkIndexSyntax(path.join(root,'index.html'));
const require=createRequire(import.meta.url);
const {chromium,webkit}=require('playwright');
const output=path.join(root,'tests','artifacts','responsive');
fs.mkdirSync(output,{recursive:true});
const url=pathToFileURL(path.join(root,'index.html')).href;
const sizes=[[375,667],[390,844],[430,932]];
const actionDefinitions={
  put:{phrase:'Put it.',images:['action-put-boy-v5.png.webp','action-put-girl-v5.png.webp']},
  get:{phrase:'Get it.',images:['action-get-boy-v4.png.webp','action-get-girl-v4.png.webp']},
  throw:{phrase:'Throw it away.',images:['action-throw-boy-v3.png.webp','action-throw-girl-v5.png.webp']},
  'put-on':{phrase:'Put it on.',images:['action-put-on-boy-v3b.png.webp','action-put-on-girl-v3a.png.webp']},
  'take-off':{phrase:'Take it off.',images:['action-take-off-boy-v1b.png.webp','action-take-off-girl-v3a.png.webp']},
  open:{phrase:'Open it.',images:['action-open-boy-v1b.png.webp','action-open-girl-v2a.png.webp']},
  close:{phrase:'Close it.',images:['action-close-boy-v1a.png.webp','action-close-girl-v1a.png.webp']},
  'pick-up':{phrase:'Pick it up.',images:['action-pick-up-boy-v1a.png.webp','action-pick-up-girl-v1b.png.webp']},
  'turn-on':{phrase:'Turn it on.',images:['action-turn-on-boy-tv-v1.webp','action-turn-on-girl-ac-v1.webp']},
  'turn-off':{phrase:'Turn it off.',images:['action-turn-off-boy-light-v2.webp','action-turn-off-girl-game-v1.webp']},
  'take-out':{phrase:'Take it out.',images:['action-take-out-boy-toy-v1.webp','action-take-out-girl-milk-v1.webp']},
  'put-away':{phrase:'Put it away.',images:['action-put-away-boy-book-v2.webp','action-put-away-girl-toy-v1.webp']},
  push:{phrase:'Push it.',images:['action-push-boy-layout-v5.webp','action-push-girl-layout-v3.webp']},
  pull:{phrase:'Pull it.',images:['action-pull-boy-layout-v5.webp','action-pull-girl-layout-v3.webp']},
  give:{phrase:'Give it to me.',images:['action-give-boy-layout-v3.webp','action-give-girl-layout-v5.webp']},
  eat:{phrase:'Eat it.',images:['action-eat-boy-layout-v3.webp','action-eat-girl-layout-v3.webp']},
};
const actionKeys=Object.keys(actionDefinitions);
const actionJapaneseExpected={put:['おく','おく'],get:['とる','とる'],throw:['すてる','すてる'],'put-on':['みにつける','みにつける'],'take-off':['ぬぐ','ぬぐ'],open:['あける','あける'],close:['しめる','しめる'],'pick-up':['ひろう','ひろう'],'turn-on':['つける','つける'],'turn-off':['けす','けす'],'take-out':['とりだす','とりだす'],'put-away':['かたづける','かたづける'],push:['おす','おす'],pull:['ひっぱる','ひっぱる'],give:['わたす','わたす'],eat:['たべる','たべる']};
const actionImageNames=Object.values(actionDefinitions).flatMap(({images})=>images);
const actionImageBatches=Array.from({length:Math.ceil(actionImageNames.length/4)},(_,index)=>{
  const batch=actionImageNames.slice(index*4,index*4+4);
  return [...batch,...actionImageNames.slice(0,4-batch.length)];
});
assert.equal(actionKeys.length,16);
assert.equal(new Set(actionImageNames).size,32);
const actionSource=fs.readFileSync(path.join(root,'index.html'),'utf8');
const wordNames=vm.runInNewContext(`(${actionSource.match(/const wordNames=(\{[^;]+\});/)?.[1]})`);
const wordJapanese=vm.runInNewContext(`(${actionSource.match(/const wordJapanese=(\{[^;]+\});/)?.[1]})`);
const wordHintPairs=Object.keys(wordNames).map(key=>({english:wordNames[key],japanese:wordJapanese[key]}));
const actionPhrasesLiteral=actionSource.match(/const actionPhrases=(\{[^;]+\});/)?.[1];
assert(actionPhrasesLiteral,'Action Match speech phrase table is missing');
const actualActionPhrases=JSON.parse(JSON.stringify(vm.runInNewContext(`(${actionPhrasesLiteral})`)));
assert.deepEqual(actualActionPhrases,Object.fromEntries(Object.entries(actionDefinitions).map(([key,{phrase}])=>[key,phrase])),'Action Match speech phrase table differs from the 16 expected sentences');
const actionJapaneseLiteral=actionSource.match(/const actionJapanese=(\{[^;]+\});/)?.[1];
assert(actionJapaneseLiteral,'Action Match Japanese hint table is missing');
assert.deepEqual(JSON.parse(JSON.stringify(vm.runInNewContext(`(${actionJapaneseLiteral})`))),actionJapaneseExpected,'Action Match Japanese hints differ from the approved text');
function seededDraws(seed) { let state=seed>>>0; return Array.from({length:64},()=>((state=(Math.imul(1664525,state)+1013904223)>>>0)/2**32)); }
const actionFixtures=[
  {name:'seed-1',draws:seededDraws(1),expected:['action-push-boy-layout-v5.webp','action-close-boy-v1a.png.webp','action-turn-on-boy-tv-v1.webp','action-eat-girl-layout-v3.webp']},
  {name:'seed-3',draws:seededDraws(3),expected:['action-put-away-girl-toy-v1.webp','action-pull-boy-layout-v5.webp','action-throw-girl-v5.png.webp','action-get-girl-v4.png.webp']},
  {name:'seed-32',draws:seededDraws(32),expected:['action-take-off-boy-v1b.png.webp','action-open-boy-v1b.png.webp','action-put-boy-v5.png.webp','action-pick-up-girl-v1b.png.webp']},
  {name:'seed-9',draws:seededDraws(9),expected:['action-turn-off-boy-light-v2.webp','action-close-girl-v1a.png.webp','action-give-girl-layout-v5.webp','action-take-out-girl-milk-v1.webp']},
  {name:'seed-36',draws:seededDraws(36),expected:['action-pick-up-girl-v1b.png.webp','action-put-on-girl-v3a.png.webp','action-throw-girl-v5.png.webp','action-turn-off-boy-light-v2.webp']},
];
assert.deepEqual(new Set(actionFixtures.flatMap(fixture=>fixture.expected.map(name=>Object.entries(actionDefinitions).find(([,definition])=>definition.images.includes(name))?.[0]))),new Set(actionKeys),'Seeded fixtures must cover all 16 action words');
const scenes=[['bathroom','open-bathroom','game-screen','bathroom-back','scene'],['breakfast','open-breakfast','breakfast-screen','breakfast-back','breakfast-scene'],['living','open-living','living-screen','living-back','living-scene'],['bedroom','open-bedroom','bedroom-screen','bedroom-back','bedroom-scene'],['entrance','open-entrance','entrance-screen','entrance-back','scene'],['bath-time','open-bath-time','bath-time-screen','bath-time-back','scene']];
const engines=[
  ['chromium',chromium,{...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}),args:['--mute-audio']}],
  ['webkit',webkit,{}],
];
let failures=0;
let completed=0;

async function inspect(page,id,kind,width,height) {
  const result=await page.evaluate(({id,kind})=>{
    const root=document.getElementById(id),header=root.querySelector('header'),stage=kind==='scene' ? root.querySelector('section') : null;
    const rect=element=>{ const r=element.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}; };
    const r=rect(root),h=rect(header);
    const controls=[...header.querySelectorAll('button')].map(el=>({name:el.id,...rect(el)}));
    const visible=selector=>[...root.querySelectorAll(selector)].filter(el=>getComputedStyle(el).display!=='none' && getComputedStyle(el).visibility!=='hidden').map(el=>({name:el.id || el.dataset.word || el.dataset.action || el.dataset.label || el.getAttribute('aria-label'),...rect(el)}));
    const result={root:r,header:h,controls};
    if(kind==='scene') {
      const svg=stage.querySelector('svg');
      result.scene=rect(stage); result.svg=rect(svg);
      result.trayTop=result.svg.bottom;
      result.items=visible('.item:not(.done),.breakfast-item:not(.queued):not(.done),.living-item:not(.queued):not(.done)');
      result.art=result.items.map(item=>{ const element=[...stage.querySelectorAll('.item,.breakfast-item,.living-item')].find(el=>(el.id || el.dataset.label || el.getAttribute('aria-label'))===item.name); const img=element?.querySelector('img'); return img ? {name:item.name,...rect(img)} : null; }).filter(Boolean);
      result.zones=[...svg.querySelectorAll('g.target rect,g.breakfast-target rect,g.living-target rect')].map((el,index)=>({name:el.parentElement.id || `${index+1}`,...rect(el)}));
    } else if(kind==='word') result.cards=visible('.word-card:not(.queued)');
    else if(kind==='action') result.cards=visible('.action-card:not(.queued)');
    else if(kind==='place') { result.cards=visible('.place-card'); const content=root.querySelector('.home-content'); result.placeScroll={clientHeight:content.clientHeight,scrollHeight:content.scrollHeight,overflowY:getComputedStyle(content).overflowY}; }
    return result;
  },{id,kind});
  const tolerance=1.5;
  assert(result.root.y>=-tolerance && Math.abs(result.root.bottom-height)<tolerance,`${id}: screen does not fill height ${height}: ${JSON.stringify(result.root)}`);
  assert(Math.abs(result.header.y-result.root.y)<tolerance,`${id}: header not at top`);
  for(const control of result.controls) {
    assert(control.w>=48-tolerance && control.h>=48-tolerance,`${id}: ${control.name} is smaller than 48px: ${JSON.stringify(control)}`);
    assert(control.x>=result.root.x-tolerance && control.right<=result.root.right+tolerance,`${id}: ${control.name} is clipped horizontally`);
  }
  for(const element of [...(result.cards || []),...(result.items || []),...(result.art || [])]) {
    assert(element.x>=result.root.x-tolerance && element.right<=result.root.right+tolerance,`${id}: ${element.name} is clipped horizontally: ${JSON.stringify(element)}`);
    if(kind!=='place') assert(element.y>=result.header.bottom-tolerance && element.bottom<=result.root.bottom+tolerance,`${id}: ${element.name} is clipped vertically: ${JSON.stringify(element)}`);
  }
  if(kind==='word') assert.equal(result.cards.length,12,`${id}: expected 12 visible cards`);
  if(kind==='action') assert.equal(result.cards.length,4,`${id}: expected 4 visible cards`);
  if(kind==='place') {
    assert.equal(result.cards.length,7,`${id}: expected 7 place cards`);
    assert(['auto','scroll'].includes(result.placeScroll.overflowY),`${id}: place list is not scrollable`);
    if(result.cards.at(-1).bottom>result.root.bottom+tolerance) assert(result.placeScroll.scrollHeight>result.placeScroll.clientHeight,`${id}: last place card is clipped without scrolling`);
  }
  if(kind==='scene') {
    assert(Math.abs(result.scene.y-result.header.bottom)<tolerance && Math.abs(result.scene.bottom-result.root.bottom)<tolerance,`${id}: header/scene/tray has a gap`);
    assert(result.trayTop>result.header.bottom && result.trayTop<result.root.bottom,`${id}: tray is outside the screen`);
    assert(result.items.length===6,`${id}: expected six visible tray items, got ${result.items.length}`);
    for(let i=0;i<result.zones.length;i++) {
      const a=result.zones[i];
      assert(a.x>=result.svg.x-tolerance && a.right<=result.svg.right+tolerance && a.y>=result.svg.y-tolerance && a.bottom<=result.svg.bottom+tolerance,`${id}: ${a.name} zone is clipped`);
      for(let j=i+1;j<result.zones.length;j++) {
        const b=result.zones[j],overlapX=Math.min(a.right,b.right)-Math.max(a.x,b.x),overlapY=Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y);
        assert(overlapX<=tolerance || overlapY<=tolerance,`${id}: zones ${a.name} and ${b.name} overlap by ${overlapX.toFixed(1)}×${overlapY.toFixed(1)}px`);
      }
    }
  }
  console.log(`PASS ${width}×${height} ${id}: controls ${result.controls.length}, ${kind==='scene' ? `tray items ${result.items.length}, zones ${result.zones.length}` : `cards ${(result.cards || []).length}`}`);
}

async function inspectLivingLabels(page,width,height) {
  const label=`${width}×${height} Living labels`;
  const ids=['mom','toybox','bin','table'];
  const hidden=()=>page.evaluate(ids=>ids.every(id=>getComputedStyle(document.getElementById(`living-label-${id}`)).display==='none'),ids);
  assert(await hidden(),`${label}: labels are visible without hints`);
  const zonesBefore=await page.evaluate(()=>[...document.querySelectorAll('#living-scene g.living-target rect')].map(element=>{const r=element.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};}));
  await page.locator('#living-kana').click();
  const englishMomBottom=await page.locator('#living-label-mom').evaluate(element=>element.getBoundingClientRect().bottom);
  await page.locator('#living-kana').click();
  const layout=await page.evaluate(ids=>{
    const scene=document.getElementById('living-scene'),svg=scene.querySelector('svg');
    const box=element=>{const r=element.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};};
    const labels=Object.fromEntries(ids.map(id=>{const element=document.getElementById(`living-label-${id}`);return [id,{...box(element),display:getComputedStyle(element).display,pointerEvents:getComputedStyle(element).pointerEvents}];}));
    return {svg:box(svg),labels,zones:[...svg.querySelectorAll('g.living-target rect')].map(box)};
  },ids);
  const {svg,labels}=layout;
  const overlap=(a,b)=>Math.min(a.right,b.right)>Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);
  const imageRegion=(left,top,right,bottom)=>({left:svg.left+(svg.right-svg.left)*left,top:svg.top+(svg.bottom-svg.top)*top,right:svg.left+(svg.right-svg.left)*right,bottom:svg.top+(svg.bottom-svg.top)*bottom});
  for(const id of ids) {
    const rect=labels[id];
    assert.notEqual(rect.display,'none',`${label}: ${id} is hidden with bilingual hints`);
    assert.equal(rect.pointerEvents,'none',`${label}: ${id} intercepts dragging`);
    assert(rect.left>=svg.left && rect.top>=svg.top && rect.right<=svg.right && rect.bottom<=svg.bottom,`${label}: ${id} extends outside the living image`);
  }
  const momGap=svg.top+(svg.bottom-svg.top)*.117-labels.mom.bottom;
  assert(momGap>=4.5 && momGap<=10.5,`${label}: Mom label is ${momGap.toFixed(1)}px from the top of her hair`);
  assert(Math.abs((labels.mom.left+labels.mom.right)/2-(svg.left+(svg.right-svg.left)*.86))<=1,`${label}: Mom label is not centered over her face`);
  assert(Math.abs(labels.mom.bottom-englishMomBottom)<=1,`${label}: Mom label shifts vertically between hint stages`);
  assert(!overlap(labels.mom,imageRegion(.78,.12,.96,.29)),`${label}: Mom label covers her face`);
  assert(!overlap(labels.toybox,imageRegion(0,.59,.21,.78)),`${label}: Toy box label covers the cat`);
  assert(!overlap(labels.bin,imageRegion(0,.59,.21,.78)),`${label}: Trash can label covers the cat`);
  assert(overlap(labels.table,imageRegion(.16,.54,.98,.78)),`${label}: Table label is not on the tabletop`);
  assert.deepEqual(layout.zones,zonesBefore,`${label}: displaying labels moved the drop zones`);
  await page.locator('#living-kana').click();
  assert(await hidden(),`${label}: labels remained visible after hints were hidden`);
  console.log(`PASS ${label}: four labels stay in the scene and clear of Mom's face and the cat`);
}

async function inspectBreakfastLabels(page,width,height) {
  const label=`${width}×${height} Breakfast labels`;
  const ids=['girl','table'];
  const hidden=()=>page.evaluate(ids=>ids.every(id=>getComputedStyle(document.getElementById(`breakfast-label-${id}`)).display==='none'),ids);
  assert(await hidden(),`${label}: labels are visible without hints`);
  const zonesBefore=await page.evaluate(()=>[...document.querySelectorAll('#breakfast-scene g.breakfast-target rect')].map(element=>{const r=element.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};}));
  await page.locator('#breakfast-kana').click();
  const englishGirlBottom=await page.locator('#breakfast-label-girl').evaluate(element=>element.getBoundingClientRect().bottom);
  await page.locator('#breakfast-kana').click();
  const layout=await page.evaluate(ids=>{
    const scene=document.getElementById('breakfast-scene'),svg=scene.querySelector('svg');
    const box=element=>{const r=element.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};};
    return {svg:box(svg),caption:box(scene.querySelector('.breakfast-instruction-caption')),labels:Object.fromEntries(ids.map(id=>{const element=document.getElementById(`breakfast-label-${id}`);return [id,{...box(element),pointerEvents:getComputedStyle(element).pointerEvents}];})),zones:[...svg.querySelectorAll('g.breakfast-target rect')].map(box)};
  },ids);
  const {svg,labels}=layout;
  const overlap=(a,b)=>Math.min(a.right,b.right)>Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);
  for(const id of ids) {
    const rect=labels[id];
    assert.equal(rect.pointerEvents,'none',`${label}: ${id} intercepts dragging`);
    assert(rect.left>=svg.left && rect.top>=svg.top && rect.right<=svg.right && rect.bottom<=svg.bottom,`${label}: ${id} extends outside the breakfast image`);
    assert(!overlap(rect,layout.caption),`${label}: ${id} overlaps the instruction`);
  }
  const hairTop=svg.top+(svg.bottom-svg.top)*.167;
  const girlGap=hairTop-labels.girl.bottom;
  assert(girlGap>=4.5 && girlGap<=11,`${label}: Girl label is ${girlGap.toFixed(1)}px above her hair`);
  assert(Math.abs((labels.girl.left+labels.girl.right)/2-(svg.left+(svg.right-svg.left)*.8))<=1,`${label}: Girl label is not centered over her head`);
  assert(Math.abs(labels.girl.bottom-englishGirlBottom)<=1,`${label}: Girl label shifts vertically between hint stages`);
  const tableX=(labels.table.left-svg.left)/(svg.right-svg.left),tableY=(labels.table.top-svg.top)/(svg.bottom-svg.top);
  assert(tableX>=.19 && tableX<=.21 && tableY>=.41 && tableY<=.47,`${label}: Table label is not near the tabletop's upper-left corner`);
  assert.deepEqual(layout.zones,zonesBefore,`${label}: displaying labels moved the drop zones`);
  await page.locator('#breakfast-kana').click();
  assert(await hidden(),`${label}: labels remained visible after hints were hidden`);
  console.log(`PASS ${label}: Girl and Table labels stay near their subjects without covering them`);
}

async function inspectBedroomLabels(page,width,height) {
  const label=`${width}×${height} Bedroom labels`;
  const ids=['bookshelf','bed','dad','drawer','night-table','boy','basket'];
  const snapshot=()=>page.evaluate(ids=>{
    const scene=document.getElementById('bedroom-scene'),svg=scene.querySelector('svg');
    const box=element=>{const r=element.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};};
    return {svg:box(svg),imageHref:svg.querySelector('image').getAttribute('href'),caption:box(scene.querySelector('.living-instruction-caption')),
      labels:Object.fromEntries(ids.map(id=>{const element=document.getElementById(`bedroom-label-${id}`);return [id,{...box(element),display:getComputedStyle(element).display,pointerEvents:getComputedStyle(element).pointerEvents}];})),
      zones:[...svg.querySelectorAll('g.living-target rect')].map(element=>({target:element.parentElement.dataset.target,...box(element)})),
      nightNumber:box(svg.querySelector('g.living-target[data-target="night-table"] circle'))};
  },ids);
  const overlap=(a,b)=>Math.min(a.right,b.right)>Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);
  const initial=await snapshot();
  assert.equal(initial.imageHref,'bedroom-stage-v4a.png.webp',`${label}: the bedroom did not switch to its new background`);
  assert(ids.every(id=>initial.labels[id].display==='none'),`${label}: labels are visible without hints`);
  for(const step of [1,2]) {
    await page.locator('#bedroom-kana').click();
    const {svg,caption,labels,zones,nightNumber}=await snapshot();
    assert.deepEqual(zones,initial.zones,`${label}: hint stage ${step} moved the drop zones`);
    const imageRegion=(left,top,right,bottom)=>({left:svg.left+(svg.right-svg.left)*left,top:svg.top+(svg.bottom-svg.top)*top,right:svg.left+(svg.right-svg.left)*right,bottom:svg.top+(svg.bottom-svg.top)*bottom});
    for(const [index,id] of ids.entries()) {
      const rect=labels[id];
      assert.notEqual(rect.display,'none',`${label}: ${id} is hidden at hint stage ${step}`);
      assert.equal(rect.pointerEvents,'none',`${label}: ${id} intercepts dragging`);
      assert(rect.left>=svg.left-1 && rect.top>=svg.top-1 && rect.right<=svg.right+1 && rect.bottom<=svg.bottom+1,`${label}: ${id} extends outside the image`);
      assert(!overlap(rect,caption),`${label}: ${id} overlaps the instruction`);
      for(const other of ids.slice(index+1)) assert(!overlap(rect,labels[other]),`${label}: ${id} overlaps ${other}`);
    }
    const dadGap=svg.top+(svg.bottom-svg.top)*.125-labels.dad.bottom;
    assert(dadGap>=7 && dadGap<=9,`${label}: Dad label is ${dadGap.toFixed(1)}px above his hair`);
    assert(!overlap(labels.dad,imageRegion(.77,.13,.96,.32)),`${label}: Dad label covers his face`);
    assert(!overlap(labels.boy,imageRegion(.69,.39,.88,.52)),`${label}: Boy label covers his face`);
    assert(!overlap(labels.bed,imageRegion(.22,.31,.39,.39)),`${label}: Bed label covers the cat`);
    const relativeTop=id=>(labels[id].top-svg.top)/(svg.bottom-svg.top);
    assert(relativeTop('bed')>=.20 && relativeTop('bed')<=.22,`${label}: Bed label is not above the pillow`);
    assert(relativeTop('night-table')>=.15 && relativeTop('night-table')<=.17,`${label}: Night table label is not above the table`);
    assert(!overlap(labels['night-table'],nightNumber),`${label}: Night table label overlaps number 5`);
    assert(relativeTop('drawer')>=.35 && relativeTop('drawer')<=.37,`${label}: Drawer label is not on the upper drawer`);
    assert(relativeTop('boy')>=.55 && relativeTop('boy')<=.57,`${label}: Boy label is not on his torso`);
    assert(relativeTop('basket')>=.68 && relativeTop('basket')<=.70,`${label}: Laundry basket label is not on its lower front`);
    const expectedZones={bookshelf:[15,90,205,525],bed:[210,390,610,740],dad:[800,180,1070,540],drawer:[15,555,205,820],'night-table':[620,340,780,535],boy:[675,545,990,1080],basket:[60,830,310,1060]};
    assert.equal(zones.length,ids.length,`${label}: expected seven bedroom drop zones`);
    for(const zone of zones) {
      const expected=expectedZones[zone.target];
      assert(expected,`${label}: unexpected zone ${zone.target}`);
      const actual=[(zone.left-svg.left)/(svg.right-svg.left),(zone.top-svg.top)/(svg.bottom-svg.top),(zone.right-svg.left)/(svg.right-svg.left),(zone.bottom-svg.top)/(svg.bottom-svg.top)];
      assert(actual.every((value,index)=>Math.abs(value-expected[index]/(index%2 ? 1448 : 1086))<.005),`${label}: ${zone.target} drop zone no longer matches the new scene`);
      assert(zone.right-zone.left>=48 && zone.bottom-zone.top>=48,`${label}: ${zone.target} drop zone is smaller than 48px`);
      for(const other of zones) if(other!==zone) assert(!overlap(zone,other),`${label}: ${zone.target} and ${other.target} drop zones overlap`);
    }
  }
  await page.locator('#bedroom-kana').click();
  const reset=await snapshot();
  assert(ids.every(id=>reset.labels[id].display==='none'),`${label}: labels remained visible after hints were hidden`);
  console.log(`PASS ${label}: seven labels stay in the scene, clear of faces, lamp, cat, and caption`);
}

async function inspectWordCaption(page,engineName,width,height) {
  const getStep=()=>page.evaluate(()=>document.body.classList.contains('text-bilingual') ? 2 : document.body.classList.contains('text-english') ? 1 : 0);
  const originalStep=await getStep();
  const button=page.locator('#word-kana');
  while(await getStep()!==0) await button.click();
  const snapshot=()=>page.evaluate(()=>{
    const board=document.querySelector('#word-board');
    const row=board.querySelector('.word-info-row');
    const caption=board.querySelector('.word-caption');
    const captionContent=board.querySelector('.word-caption-content');
    const combo=board.querySelector('.word-combo');
    const comboContent=board.querySelector('.word-combo-content');
    const comboCount=board.querySelector('#word-combo-count');
    const comboLabel=board.querySelector('.word-combo-label');
    const english=board.querySelector('#word-caption-english');
    const japanese=board.querySelector('#word-caption-jp');
    const rect=element=>{ const r=element.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
    const captionStyle=getComputedStyle(caption);
    return {
      board:rect(board),row:rect(row),caption:rect(caption),captionContent:rect(captionContent),combo:rect(combo),comboContent:rect(comboContent),comboCount:rect(comboCount),comboLabel:rect(comboLabel),captionEnglish:rect(english),captionJapanese:rect(japanese),cards:[...board.querySelectorAll('.word-card:not(.queued)')].map(card=>{
        const art=card.querySelector('img,.word-sprite');
        const band=card.querySelector('.word-labels');
        const ja=band.querySelector('.word-label-ja');
        const en=band.querySelector('.word-label-en');
        return {card:rect(card),art:rect(art),band:rect(band),bandVisible:band.getClientRects().length>0,
          jaVisible:ja.getClientRects().length>0,enVisible:en.getClientRects().length>0,
          jaFits:ja.scrollWidth<=ja.clientWidth+1,enFits:en.scrollWidth<=en.clientWidth+1};
      }),
      titleCount:board.querySelectorAll('.word-title').length,
      captionVisible:caption.getClientRects().length>0,
      englishVisible:english.getClientRects().length>0,
      japaneseVisible:japanese.getClientRects().length>0,
      captionDisplay:captionStyle.display,captionBackground:captionStyle.backgroundImage,
      captionBorder:parseFloat(captionStyle.borderLeftWidth),captionPadding:parseFloat(captionStyle.paddingLeft),
      captionRadius:parseFloat(captionStyle.borderTopLeftRadius),captionShadow:captionStyle.boxShadow,
      rowZIndex:Number(getComputedStyle(row).zIndex),rowPointerEvents:getComputedStyle(row).pointerEvents,rowOverflow:getComputedStyle(row).overflowY,
    };
  });
  const baseline=await snapshot();
  const label=`${width}×${height} Item Match`;
  const geometry=(state,step)=>{
    const top=Math.min(...state.cards.map(entry=>entry.card.y));
    const offset=value=>+(value-state.board.y).toFixed(2);
    return {stage:step,boardTop:+state.board.y.toFixed(2),rowTop:offset(state.row.y),rowBottom:offset(state.row.bottom),
      captionWidth:state.captionVisible ? +state.caption.width.toFixed(2) : null,comboWidth:+state.combo.width.toFixed(2),
      cardTop:offset(top),horizontalGap:state.captionVisible ? +(state.combo.x-state.caption.right).toFixed(2) : null,
      rowCardGap:+(top-state.row.bottom).toFixed(2)};
  };
  assert.equal(baseline.titleCount,0,`${label}: in-game Word Match title remains`);
  assert.equal(baseline.captionVisible,false,`${label}: caption shown at text stage 0`);
  assert.equal(baseline.captionDisplay,'none',`${label}: hidden hint card leaves an empty frame at stage 0`);
  const checkCards=(state,step)=>{
    assert.equal(state.cards.length,12,`${label}: stage ${step} changed the number of visible cards`);
    state.cards.forEach((entry,index)=>{
      const before=baseline.cards[index];
      for(const key of ['x','y','width','height']) {
        assert(Math.abs(entry.card[key]-before.card[key])<0.5,`${label}: stage ${step} moved card ${index} (${key})`);
        assert(Math.abs(entry.art[key]-before.art[key])<0.5,`${label}: stage ${step} moved or resized card art ${index} (${key})`);
      }
    });
  };
  const checkLabels=(state,step)=>state.cards.forEach((entry,index)=>{
    assert.equal(entry.bandVisible,step!==0,`${label}: card ${index} label band visibility is wrong at stage ${step}`);
    assert.equal(entry.jaVisible,step!==0,`${label}: card ${index} Japanese label visibility is wrong at stage ${step}`);
    assert.equal(entry.enVisible,step===2,`${label}: card ${index} English label visibility is wrong at stage ${step}`);
    if(!entry.bandVisible) return;
    assert(entry.band.x>=entry.card.x-0.5 && entry.band.right<=entry.card.right+0.5 && entry.band.y>=entry.card.y-0.5 && entry.band.bottom<=entry.card.bottom+0.5,`${label}: card ${index} label band extends outside card at stage ${step}`);
    assert(entry.card.bottom-entry.band.bottom<=4,`${label}: card ${index} label band is not at the bottom`);
    assert(entry.jaFits && (step===1 || entry.enFits),`${label}: card ${index} label text overflows at stage ${step}`);
  });
  const checkTopRow=(state,step)=>{
    const firstCardTop=Math.min(...state.cards.map(entry=>entry.card.y));
    assert(Math.abs(state.row.x-(state.board.x+16))<0.5 && Math.abs(state.row.right-(state.board.right-16))<0.5,`${label}: stage ${step} top row changed its horizontal margins`);
    assert(Math.abs(state.row.y-state.board.y)<0.5 && Math.abs(state.row.height-55)<0.5,`${label}: stage ${step} top row no longer fills the reserved top gap`);
    assert(Math.abs(firstCardTop-(state.board.y+55))<0.5,`${label}: stage ${step} first cards moved`);
    assert(Math.abs(state.row.bottom-firstCardTop)<0.5,`${label}: stage ${step} row extends into the first cards (${JSON.stringify(geometry(state,step))})`);
    assert(state.rowOverflow==='hidden' && state.rowPointerEvents==='none' && state.rowZIndex>1,`${label}: stage ${step} text shadow can leave the top gap or row intercepts card taps`);
    assert(Math.abs(state.combo.y-(state.row.y+7.5))<0.5 && Math.abs(state.combo.height-40)<0.5,`${label}: stage ${step} combo is not centered in the top gap`);
    assert(state.comboContent.x>=state.combo.x-0.5 && state.comboContent.right<=state.combo.right+0.5,`${label}: stage ${step} combo text is clipped horizontally`);
    assert(state.comboContent.y>=state.combo.y-0.5 && state.comboContent.bottom<=state.combo.bottom+0.5,`${label}: stage ${step} combo text is clipped vertically`);
    assert(state.comboContent.y>=state.board.y+7 && state.comboContent.bottom<=firstCardTop-7,`${label}: stage ${step} combo text is too close to the header or first cards`);
    const bumpMargin=state.comboCount.width*.09;
    assert(state.comboCount.x-bumpMargin>=state.combo.x-0.5 && state.comboCount.right+bumpMargin<=state.combo.right+0.5,`${label}: stage ${step} combo bump can leave its 30% region`);
    assert(state.comboCount.y-state.comboCount.height*.09>=state.board.y+5 && state.comboCount.bottom+state.comboCount.height*.09<=firstCardTop-5,`${label}: stage ${step} animated combo can reach the header or first cards`);
    assert(state.comboLabel.x>=state.combo.x-0.5 && state.comboLabel.right<=state.combo.right+0.5,`${label}: stage ${step} COMBO! is clipped`);
    if(step===0) return;
    assert(Math.abs(state.caption.y-state.combo.y)<0.5 && Math.abs(state.caption.height-state.combo.height)<0.5,`${label}: stage ${step} hint and combo do not share a vertical center line`);
    assert.equal(state.captionDisplay,'flex',`${label}: stage ${step} hint card is not shown`);
    assert(state.captionBackground.includes('linear-gradient') && state.captionBorder>=2 && state.captionRadius>=12 && state.captionShadow!=='none',`${label}: stage ${step} hint card lost its cream surface, border, or shadow`);
    assert(Math.abs(state.caption.width/(state.caption.width+state.combo.width)-.7)<.01,`${label}: stage ${step} caption/combo width is not 70:30`);
    assert(state.combo.x-state.caption.right>=7.5,`${label}: stage ${step} caption and combo overlap`);
    const hintInset=state.captionBorder+state.captionPadding;
    assert(state.captionContent.x>=state.caption.x+hintInset-0.5 && state.captionContent.right<=state.caption.right-hintInset+0.5,`${label}: stage ${step} hint text enters the card padding`);
    assert(state.captionContent.y>=state.caption.y-0.5 && state.captionContent.bottom<=state.caption.bottom+0.5,`${label}: stage ${step} hint text is clipped vertically`);
    assert(state.captionContent.y>=state.board.y+7 && state.captionContent.bottom<=firstCardTop-7,`${label}: stage ${step} hint text is too close to the header or first cards`);
    for(const [name,box] of [['English',state.captionEnglish],['Japanese',state.captionJapanese]]) {
      if(name==='English' && step===1) continue;
      assert(box.y>=state.caption.y-0.5 && box.bottom<=state.caption.bottom+0.5,`${label}: stage ${step} ${name} text extends outside the caption`);
      assert(box.x>=state.caption.x+hintInset-0.5 && box.right<=state.caption.right-hintInset+0.5,`${label}: stage ${step} ${name} text enters the hint-card padding`);
    }
    if(step===2) assert(state.captionEnglish.right<=state.captionJapanese.x,`${label}: English and Japanese overlap`);
  };
  checkLabels(baseline,0); checkTopRow(baseline,0);
  await button.click();
  const english=await snapshot();
  assert.equal(english.captionVisible,true,`${label}: English caption missing at stage 1`);
  assert.equal(english.englishVisible,false,`${label}: English text shown at Japanese-only stage 1`);
  assert.equal(english.japaneseVisible,true,`${label}: Japanese text missing at stage 1`);
  checkCards(english,1); checkLabels(english,1); checkTopRow(english,1);
  await button.click();
  const bilingual=await snapshot();
  console.log(`${label} geometry ${JSON.stringify([geometry(baseline,0),geometry(english,1),geometry(bilingual,2)])}`);
  assert.equal(bilingual.captionVisible,true,`${label}: bilingual caption missing at stage 2`);
  assert.equal(bilingual.englishVisible,true,`${label}: English text missing at stage 2`);
  assert.equal(bilingual.japaneseVisible,true,`${label}: Japanese text missing at stage 2`);
  checkCards(bilingual,2); checkLabels(bilingual,2); checkTopRow(bilingual,2);
  const longestPair=await page.evaluate(pairs=>{
    const english=document.querySelector('#word-caption-english'),japanese=document.querySelector('#word-caption-jp');
    const content=document.querySelector('.word-caption-content');
    const previous=[english.textContent,japanese.textContent];
    let longest=null;
    for(const pair of pairs) {
      english.textContent=pair.english; japanese.textContent=pair.japanese;
      const width=content.offsetWidth;
      if(!longest || width>longest.width) longest={...pair,width};
    }
    [english.textContent,japanese.textContent]=previous;
    window.dispatchEvent(new Event('resize'));
    return longest;
  },wordHintPairs);
  const originalCount=await page.locator('#word-combo-count').textContent();
  const originalEnglish=await page.locator('#word-caption-english').textContent();
  const originalJapanese=await page.locator('#word-caption-jp').textContent();
  for(const count of [1,9,99,999,9999]) {
    await page.evaluate(({pair,count})=>{
      document.querySelector('#word-caption-english').textContent=pair.english;
      document.querySelector('#word-caption-jp').textContent=pair.japanese;
      document.querySelector('#word-combo-count').textContent=String(count);
      window.dispatchEvent(new Event('resize'));
    },{pair:longestPair,count});
    const extreme=await snapshot();
    checkCards(extreme,2); checkTopRow(extreme,2);
    if(count===9999) await page.screenshot({path:path.join(output,`${engineName}-${width}x${height}-word-max-hint-combo.png`)});
  }
  await page.evaluate(({english,japanese,count})=>{
    document.querySelector('#word-caption-english').textContent=english;
    document.querySelector('#word-caption-jp').textContent=japanese;
    document.querySelector('#word-combo-count').textContent=count;
    window.dispatchEvent(new Event('resize'));
  },{english:originalEnglish,japanese:originalJapanese,count:originalCount});
  await button.click();
  const hidden=await snapshot();
  assert.equal(hidden.captionVisible,false,`${label}: caption remains at stage 0 after cycling`);
  checkCards(hidden,0); checkLabels(hidden,0); checkTopRow(hidden,0);
  for(let step=0;step<originalStep;step++) await button.click();
  console.log(`PASS ${label}: stages 0/1/2 preserve card and artwork rectangles; labels stay inside cards without text overflow`);
}

async function inspectWordFoodCards(page,width,height) {
  const foods=['apple','banana','milk','bread','egg','tomato','carrot','potato','chicken','pork','beef','fish','strawberry'];
  const measured=await page.evaluate(async keys=>{
    const cards=[...document.querySelectorAll('#word-board .word-card')];
    const queued=new Map(cards.map(card=>[card,card.classList.contains('queued')]));
    const result=[];
    try {
      for(let start=0;start<keys.length;start+=12) {
        const batch=keys.slice(start,start+12);
        cards.forEach(card=>card.classList.add('queued'));
        const shown=batch.map(key=>cards.find(card=>card.dataset.word===key));
        shown.forEach(card=>card?.classList.remove('queued'));
        await Promise.all(shown.map(card=>card?.querySelector('img')?.decode().catch(()=>{})));
        for(const card of shown) {
          if(!card) { result.push(null); continue; }
          const art=card.querySelector('img,.word-sprite');
          const outer=card.getBoundingClientRect(),inner=art?.getBoundingClientRect();
          result.push({key:card.dataset.word,source:art?.tagName==='IMG' ? art.getAttribute('src') : getComputedStyle(art).backgroundImage,
            loaded:art?.tagName!=='IMG' || art.naturalWidth>0,fit:art?.tagName==='IMG' ? getComputedStyle(art).objectFit : getComputedStyle(art).backgroundSize,
            inside:Boolean(inner && inner.left>=outer.left-1 && inner.right<=outer.right+1 && inner.top>=outer.top-1 && inner.bottom<=outer.bottom+1),
            cardWidth:outer.width,cardHeight:outer.height});
        }
      }
    } finally {
      cards.forEach(card=>card.classList.toggle('queued',queued.get(card)));
    }
    return result;
  },foods);
  assert.equal(measured.length,13);
  for(let index=0;index<foods.length;index++) {
    const entry=measured[index],name=foods[index];
    assert(entry && entry.key===name,`${width}×${height}: ${name} card is missing`);
    assert(entry.loaded,`${width}×${height}: ${name} image did not load`);
    assert(entry.inside,`${width}×${height}: ${name} artwork leaves its card`);
    assert(entry.cardWidth>=48 && entry.cardHeight>=48,`${width}×${height}: ${name} card is too small`);
    if(entry.source.endsWith('.webp')) assert.equal(entry.fit,'contain',`${name} image may stretch or crop`);
    if(name==='banana') assert(entry.source.includes('think-say-banana-v1.png.webp') && entry.fit==='contain','Banana does not use the shared image without cropping');
    if(name==='milk' || name==='bread') assert(entry.source.includes('breakfast-items-v2.png.webp') && entry.fit==='300% 200%',`${name} sprite is not using the shared sheet`);
  }
  console.log(`PASS ${width}×${height} Item Match: all 13 food cards load and their artwork stays inside the card`);
}

async function inspectActionSelection(page,engineName,width,height,fixture,opening) {
  const cards=await page.evaluate(()=>[...document.querySelectorAll('#action-screen .action-card:not(.queued)')].map(card=>{
    const rect=card.getBoundingClientRect();
    return {name:card.querySelector('img').getAttribute('src'),action:card.dataset.action,y:rect.y,hidden:card.getAttribute('aria-hidden'),tabIndex:card.tabIndex};
  }));
  const label=`${engineName} ${width}×${height} ${fixture.name}, opening ${opening}`;
  assert.equal(cards.length,4,`${label}: expected four visible Action Match cards`);
  assert.equal(new Set(cards.map(card=>card.action)).size,4,`${label}: action words are duplicated`);
  assert(!(cards.some(card=>card.action==='pull') && cards.some(card=>card.action==='open')),`${label}: Pull and Open appeared together`);
  assert.deepEqual(cards.map(card=>card.name),fixture.expected,`${label}: seeded selection or visual/DOM order is incorrect`);
  for(let i=0;i<cards.length;i++) {
    assert.equal(cards[i].hidden,null,`${label}: visible card is hidden from accessibility`);
    assert.equal(cards[i].tabIndex,0,`${label}: visible card is missing from keyboard order`);
    if(i) assert(cards[i].y>cards[i-1].y,`${label}: DOM order differs from visual top-to-bottom order`);
  }
  console.log(`PASS ${label}: four distinct words in seeded visual and accessibility order`);
  return cards;
}

async function inspectActionHintLabels(page) {
  const labels=await page.locator('#action-screen .action-card').evaluateAll(cards=>cards.map(card=>({
    action:card.dataset.action,
    gender:card.querySelector('img').getAttribute('src').includes('-girl-') ? 1 : 0,
    en:card.querySelector('.action-label-en')?.textContent,
    ja:card.querySelector('.action-label-ja')?.textContent,
    count:card.querySelectorAll('.action-labels').length
  })));
  assert.equal(labels.length,32,'Action Match: expected hint labels on all 32 cards');
  for(const label of labels) {
    assert.equal(label.count,1,`${label.action} has duplicate or missing label groups`);
    assert.equal(label.en,actionDefinitions[label.action].phrase,`${label.action} English differs from speech`);
    assert.equal(label.ja,actionJapaneseExpected[label.action][label.gender],`${label.action} Japanese differs from the approved text`);
    assert(!/[一-龯々]/u.test(label.ja),`${label.action} Japanese contains kanji`);
  }
}

async function assertActionHintStep(page,step,width,height,baselineImages) {
  const result=await page.evaluate(()=>{
    const screen=document.querySelector('#action-screen'),button=document.querySelector('#action-hint');
    const rect=el=>{ const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; };
    const cards=[...screen.querySelectorAll('.action-card:not(.queued):not(.matched)')].map(card=>{
      const image=rect(card.querySelector('img'));
      const labels={en:card.querySelector('.action-label-en'),ja:card.querySelector('.action-label-ja')};
      const r=rect(card),band=card.querySelector('.action-labels'),seen={};
      for(const [kind,el] of Object.entries(labels)) seen[kind]=el.getClientRects().length ? {box:rect(el),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth} : null;
      return {name:card.querySelector('img').getAttribute('src'),action:card.dataset.action,card:r,image,band:band.getClientRects().length ? rect(band) : null,labels:seen};
    });
    return {step:screen.dataset.actionHintStep,pressed:button.getAttribute('aria-pressed'),description:button.getAttribute('aria-label'),button:rect(button),cards};
  });
  const context=`${width}×${height} hint step ${step}`;
  assert.equal(result.step,String(step),`${context}: wrong hint step`);
  assert.equal(result.pressed,String(step!==0),`${context}: wrong aria-pressed`);
  assert.equal(result.description,['日本語を表示','英語も表示','文字を消す'][step],`${context}: wrong button description`);
  assert(result.button.width>=48 && result.button.height>=48,`${context}: hint button is too small`);
  for(const card of result.cards) {
    if(baselineImages) {
      const baseline=baselineImages.get(card.name);
      assert(baseline,`${context}: no baseline image rectangle for ${card.name}`);
      for(const key of ['x','y','width','height']) assert(Math.abs(card.image[key]-baseline[key])<=.5,`${context}: ${card.name} image ${key} changed when hints were toggled`);
    }
    assert.equal(Boolean(card.band),step!==0,`${context}: hint band visibility is wrong`);
    assert.equal(Boolean(card.labels.ja),step>=1,`${context}: Japanese visibility is wrong`);
    assert.equal(Boolean(card.labels.en),step===2,`${context}: English visibility is wrong`);
    if(card.band) {
      assert(Math.abs(card.band.x-card.card.x)<=4 && Math.abs(card.band.right-card.card.right)<=4,`${context}: band does not span the card width`);
      assert(Math.abs(card.band.y-card.card.y)<=4,`${context}: action hint band is not at the card top`);
    }
    for(const label of Object.values(card.labels).filter(Boolean)) {
      const box=label.box;
      assert(box.x>=card.card.x-1 && box.right<=card.card.right+1 && box.y>=card.card.y-1 && box.bottom<=card.card.bottom+1,`${context}: hint label leaves its card`);
      assert(label.scrollWidth<=label.clientWidth+1,`${context}: hint text is clipped`);
      const arrowTop=card.card.y+card.card.height/2;
      const arrow={x:card.card.x+card.card.width/2-19,right:card.card.x+card.card.width/2+19,y:arrowTop-11,bottom:arrowTop+11};
      assert(box.right<=arrow.x || box.x>=arrow.right || box.bottom<=arrow.y || box.y>=arrow.bottom,`${context}: hint label covers the double arrow`);
      assert(box.y>=card.band.y-1 && box.bottom<=card.band.bottom+1,`${context}: label leaves the hint band`);
    }
    if(card.labels.en && card.labels.ja) assert(card.labels.en.box.right<=card.labels.ja.box.x,`${context}: English and Japanese labels overlap`);
  }
  return new Map(result.cards.map(card=>[card.name,card.image]));
}

async function checkActionHintCycle(page,width,height) {
  await inspectActionHintLabels(page);
  const baseline=await assertActionHintStep(page,0,width,height);
  for(const step of [1,2,0]) {
    await page.locator('#action-hint').click();
    await assertActionHintStep(page,step,width,height,baseline);
  }
}

async function checkAllActionHintGeometry(page,engineName,width,height,selected) {
  await checkActionHintCycle(page,width,height);
  for(const batch of actionImageBatches) {
    await showActionImages(page,batch);
    const baseline=await assertActionHintStep(page,0,width,height);
    await page.locator('#action-hint').click(); // 日本語
    await assertActionHintStep(page,1,width,height,baseline);
    await page.locator('#action-hint').click(); // 日本語と英語
    await assertActionHintStep(page,2,width,height,baseline);
    await page.locator('#action-hint').click(); // 消す
  }
  await showActionImages(page,selected.map(card=>card.name));
  await page.locator('#action-hint').click(); // 比較用に両方のラベルを表示
  await page.locator('#action-hint').click();
  await page.screenshot({path:path.join(output,`${engineName}-${width}x${height}-action-hints.png`)});
  await page.locator('#action-hint').click(); // 消す
  await assertActionHintStep(page,0,width,height);
}

async function inspectMatchedSlots(page,selected,label) {
  await page.evaluate(names=>{
    const visible=new Set(names);
    for(const card of document.querySelectorAll('#action-screen .action-card')) {
      card.classList.toggle('queued',!visible.has(card.querySelector('img').getAttribute('src')));
    }
  },selected.map(card=>card.name));
  let matchedName=null;
  for(const card of selected) {
    await page.locator(`#action-screen .action-card:has(img[src="${card.name}"])`).click();
    const matched=await page.evaluate(()=>[...document.querySelectorAll('#action-screen .action-card.matched')].map(card=>card.querySelector('img').getAttribute('src')));
    if(matched.length) { matchedName=matched[0]; break; }
  }
  assert(matchedName,`${label}: none of the four cards was accepted as correct`);
  await page.waitForTimeout(700);
  const after=await page.evaluate(()=>[...document.querySelectorAll('#action-screen .action-card:not(.queued)')].map(card=>({name:card.querySelector('img').getAttribute('src'),matched:card.classList.contains('matched'),hidden:card.getAttribute('aria-hidden'),tabIndex:card.tabIndex,y:card.getBoundingClientRect().y})));
  assert.deepEqual(after.map(card=>card.name),selected.map(card=>card.name),`${label}: cards were reordered after a correct answer`);
  for(let i=0;i<after.length;i++) {
    if(after[i].name===matchedName) {
      assert(after[i].matched && after[i].hidden==='true' && after[i].tabIndex===-1,`${label}: matched card is still accessible`);
    } else {
      assert(Math.abs(after[i].y-selected[i].y)<=1.5,`${label}: remaining card ${after[i].name} moved after a correct answer`);
    }
  }
  console.log(`PASS ${label}: correct answer keeps four grid slots and remaining-card order`);
}

async function showActionImages(page,names) {
  await page.evaluate(names=>{
    const visible=new Set(names);
    for(const card of document.querySelectorAll('#action-screen .action-card')) card.classList.toggle('queued',!visible.has(card.querySelector('img').getAttribute('src')));
  },names);
}

async function inspectActionImages(page,engineName,width,height,names,batchNumber) {
  await showActionImages(page,names);
  await page.waitForFunction(()=>[...document.querySelectorAll('#action-screen .action-card:not(.queued) img')].every(img=>img.complete && img.naturalWidth>0),null,{timeout:12000});
  const cards=await page.evaluate(()=>{
    const rect=element=>{ const r=element.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}; };
    const pseudo=(card,selector)=>{ const style=getComputedStyle(card,selector); return {content:style.content,width:style.width,height:style.height,left:style.left,top:style.top,position:style.position,pointerEvents:style.pointerEvents,backgroundImage:style.backgroundImage}; };
    return [...document.querySelectorAll('#action-screen .action-card:not(.queued)')].map(card=>{
      const img=card.querySelector('img');
      const image=rect(img),scale=Math.min(image.w/img.naturalWidth,image.h/img.naturalHeight),renderedWidth=img.naturalWidth*scale,renderedHeight=img.naturalHeight*scale;
      const imageStyle=getComputedStyle(img),cardStyle=getComputedStyle(card);
      return {name:img.getAttribute('src'),action:card.dataset.action,panels:Number(card.dataset.panels),legacyDivider:card.classList.contains('action-divider-blue'),card:rect(card),image,rendered:{x:image.x+(image.w-renderedWidth)/2,y:image.y+(image.h-renderedHeight)/2,w:renderedWidth,h:renderedHeight,right:image.x+(image.w+renderedWidth)/2,bottom:image.y+(image.h+renderedHeight)/2},imageStyle:{position:imageStyle.position,objectFit:imageStyle.objectFit,pointerEvents:imageStyle.pointerEvents,transformOrigin:imageStyle.transformOrigin},cardStyle:{overflowX:cardStyle.overflowX,overflowY:cardStyle.overflowY,borderRadius:cardStyle.borderRadius},imageParentIsCard:img.parentElement===card,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,clientWidth:card.clientWidth,clientHeight:card.clientHeight,before:pseudo(card,'::before'),after:pseudo(card,'::after')};
    });
  });
  assert.equal(cards.length,4,`${engineName} ${width}×${height}: expected four visible Action Match cards`);
  assert.deepEqual(new Set(cards.map(card=>card.name)),new Set(names),`${engineName} ${width}×${height}: wrong image batch is visible`);
  const near=(a,b)=>Math.abs(a-b)<=1.5;
  const offset=(value,span)=>value.endsWith('%') ? Number.parseFloat(value)*span/100 : Number.parseFloat(value);
  for(const card of cards) {
    const label=`${engineName} ${width}×${height} ${card.name}, image batch ${batchNumber}`;
    assert(card.imageParentIsCard,`${label}: image must remain a direct child of its card`);
    assert(card.card.w>=48 && card.card.h>=48,`${label}: tap target is smaller than 48px`);
    assert(card.complete && card.naturalWidth>0 && card.naturalHeight>0,`${label}: image did not load`);
    assert(card.image.w>60 && card.image.h>40,`${label}: image is blank or collapsed: ${JSON.stringify(card)}`);
    // The approved zoom may enlarge the image element beyond its card. The
    // visible pixels must be clipped by the rounded card, never by the board.
    assert.equal(card.cardStyle.overflowX,'hidden',`${label}: horizontal image overflow can be visible outside the card`);
    assert.equal(card.cardStyle.overflowY,'hidden',`${label}: vertical image overflow can be visible outside the card`);
    assert(Number.parseFloat(card.cardStyle.borderRadius)>0,`${label}: the zoomed artwork must retain the card's rounded clipping`);
    assert.equal(card.imageStyle.position,'absolute',`${label}: image sizing depends on the grid row`);
    assert.equal(card.imageStyle.objectFit,'contain',`${label}: artwork can be stretched or cropped`);
    assert.equal(card.imageStyle.pointerEvents,'none',`${label}: artwork intercepts the card tap`);
    assert(card.rendered.w>60 && card.rendered.h>40,`${label}: rendered artwork is blank or collapsed: ${JSON.stringify(card)}`);
    const visibleWidth=Math.min(card.rendered.right,card.card.right)-Math.max(card.rendered.x,card.card.x);
    const visibleHeight=Math.min(card.rendered.bottom,card.card.bottom)-Math.max(card.rendered.y,card.card.y);
    assert(visibleWidth>60 && visibleHeight>40,`${label}: too little artwork remains visible after card clipping: ${JSON.stringify(card)}`);
    assert(visibleWidth/card.card.w>.5 && visibleHeight/card.card.h>.5,`${label}: zoom clips most of the artwork: ${JSON.stringify(card)}`);
    assert(Math.abs(card.rendered.w/card.rendered.h-card.naturalWidth/card.naturalHeight)<0.025,`${label}: rendered artwork is stretched: ${JSON.stringify(card)}`);
    assert(near(card.image.x+card.image.w/2,card.card.x+card.card.w/2),`${label}: image is not horizontally centered`);
    if(card.panels===2) {
      for(const [arrow,pseudo,expectedX] of [['left',card.before,card.clientWidth/2-10],['right',card.after,card.clientWidth/2+10]]) {
        assert.equal(pseudo.content,'""',`${label}: ${arrow} arrow is missing`);
        assert.equal(Number.parseFloat(pseudo.width),18,`${label}: ${arrow} arrow width changed`);
        assert.equal(Number.parseFloat(pseudo.height),22,`${label}: ${arrow} arrow height changed`);
        assert.equal(pseudo.position,'absolute',`${label}: ${arrow} arrow participates in image layout`);
        assert.equal(pseudo.pointerEvents,'none',`${label}: ${arrow} arrow can intercept taps`);
        assert(near(offset(pseudo.left,card.clientWidth),expectedX) && near(offset(pseudo.top,card.clientHeight),card.clientHeight/2),`${label}: ${arrow} arrow is not at the two-panel boundary: ${JSON.stringify(pseudo)}`);
        const artwork=decodeURIComponent(pseudo.backgroundImage);
        assert(artwork.includes('#d74748') && artwork.includes('#fffdf4'),`${label}: ${arrow} arrow must have the approved red fill and white outline`);
      }
      assert.equal(card.before.backgroundImage,card.after.backgroundImage,`${label}: double arrows use different artwork`);
    } else {
      assert.equal(card.panels,3,`${label}: unexpected panel count`);
      assert(!card.legacyDivider,`${label}: legacy divider duplicates the lines painted in the throw image`);
      assert.notEqual(card.before.content,'""',`${label}: current non-equal throw image must not show a left arrow`);
      assert.notEqual(card.after.content,'""',`${label}: current non-equal throw image must not show a right arrow`);
    }
  }
  for(let i=0;i<cards.length;i++) for(let j=i+1;j<cards.length;j++) {
    const a=cards[i].card,b=cards[j].card;
    const overlapWidth=Math.min(a.right,b.right)-Math.max(a.x,b.x);
    const overlapHeight=Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y);
    assert(overlapWidth<=1 || overlapHeight<=1,`${engineName} ${width}×${height}: Action Match cards overlap: ${cards[i].name} / ${cards[j].name}`);
  }
  const taps=await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('#action-screen .action-card:not(.queued)[data-panels="2"]')];
    window.__actionTapHits={};
    for(const card of cards) card.addEventListener('click',event=>{ const name=card.querySelector('img').getAttribute('src'); window.__actionTapHits[name]=(window.__actionTapHits[name]||0)+1; event.preventDefault(); event.stopImmediatePropagation(); },{capture:true,once:true});
    return cards.map(card=>{ const r=card.getBoundingClientRect(); return {name:card.querySelector('img').getAttribute('src'),x:r.x+r.width/2,y:r.y+r.height/2}; });
  });
  for(const tap of taps) {
    await page.mouse.click(tap.x,tap.y);
    const hit=await page.evaluate(name=>window.__actionTapHits[name]||0,tap.name);
    assert.equal(hit,1,`${engineName} ${width}×${height} ${tap.name}: double arrow blocked the card tap`);
  }
  await page.screenshot({path:path.join(output,`${engineName}-${width}x${height}-action-images-batch${batchNumber}.png`)});
  console.log(`PASS ${engineName} ${width}×${height} Action Match image batch ${batchNumber}: four loaded images, sizes, boundaries, and tap targets`);
  return cards;
}

async function finishActionGame(page,label) {
  for(let step=0;step<4;step++) {
    if(await page.locator('#action-finish.show').count()) break;
    const names=await page.locator('#action-screen .action-card:not(.queued):not(.matched) img').evaluateAll(images=>images.map(img=>img.getAttribute('src')));
    const before=await page.locator('#action-screen .action-card.matched').count();
    let advanced=false;
    for(const name of names) {
      await page.locator(`#action-screen .action-card:has(img[src="${name}"])`).click();
      if(await page.locator('#action-screen .action-card.matched').count()>before) { advanced=true; break; }
    }
    assert(advanced,`${label}: no remaining card was accepted`);
    await page.waitForTimeout(700);
  }
  assert.equal(await page.locator('#action-screen .action-card.matched').count(),4,`${label}: game did not finish after four correct answers`);
  assert.equal(await page.locator('#action-finish.show').count(),1,`${label}: finish screen is missing`);
}

async function checkHintExitResets(page,engineName) {
  const label=`${engineName} 375×667 hint exit`;
  const sharedStep=()=>page.evaluate(()=>document.body.classList.contains('text-bilingual') ? 2 : document.body.classList.contains('text-english') ? 1 : 0);
  const checkShared=async(step,context)=>assert.equal(await sharedStep(),step,`${label}: ${context} shared text step`);
  const checkAction=async(step,context)=>assert.equal(await page.locator('#action-screen').getAttribute('data-action-hint-step'),String(step),`${label}: ${context} Action Match step`);
  const checkThink=async(pressed,context)=>assert.equal(await page.locator('#think-hint').getAttribute('aria-pressed'),String(pressed),`${label}: ${context} Think & Say hint`);

  await page.evaluate(()=>localStorage.setItem('ouchieigo-settings-v1',JSON.stringify({speechRate:1.1,textDisplayStep:2})));
  await page.reload({waitUntil:'load'});
  await assertSilentAudio(page);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ouchieigo-settings-v1')).textDisplayStep),2,`${label}: legacy saved hint was not present for the startup check`);
  assert.equal(await page.locator('#word-speed').inputValue(),'1.1',`${label}: saved speech rate was lost`);
  await checkShared(0,'startup ignores the legacy saved value');

  await page.locator('#open-word').click(); await page.locator('#open-item-match').click();
  await page.locator('#word-kana').click(); await checkShared(1,'Item Match hint enabled');
  await page.locator('#word-back').click(); await checkShared(0,'Item Match back');
  await page.locator('#open-item-match').click(); await checkShared(0,'Item Match reentry after back');
  await page.locator('#word-kana').click(); await page.locator('#word-kana').click();
  await page.locator('#word-home').click(); await checkShared(0,'Item Match home');
  await page.locator('#open-word').click(); await page.locator('#open-item-match').click(); await checkShared(0,'Item Match reentry after home');
  await page.locator('#word-back').click();

  await page.locator('#open-action-match').click();
  await page.locator('#action-hint').click(); await checkAction(1,'Action Match hint enabled');
  await page.locator('#action-back').click(); await checkAction(0,'Action Match back');
  await page.locator('#open-action-match').click(); await checkAction(0,'Action Match reentry after back');
  await page.locator('#action-hint').click(); await page.locator('#action-hint').click();
  await page.locator('#action-home').click(); await checkAction(0,'Action Match home');
  await page.locator('#open-word').click(); await page.locator('#open-action-match').click(); await checkAction(0,'Action Match reentry after home');
  await page.locator('#action-home').click();

  await page.locator('#open-listen').click(); await page.locator('#open-bathroom').click();
  await page.locator('#kana').click(); await checkShared(1,'bathroom hint enabled');
  await page.locator('#bathroom-back').click(); await checkShared(0,'bathroom to place selection');
  await page.locator('#open-breakfast').click(); await checkShared(0,'breakfast starts without hints');
  await page.locator('#breakfast-kana').click(); await page.locator('#breakfast-kana').click(); await checkShared(2,'breakfast bilingual hint enabled');
  await page.locator('#breakfast-back').click(); await checkShared(0,'breakfast to place selection');
  await page.locator('#open-bedroom').click(); await checkShared(0,'bedroom starts without hints');
  await page.locator('#bedroom-kana').click(); await checkShared(1,'bedroom hint enabled');
  await page.locator('#bedroom-back').click(); await checkShared(0,'bedroom to place selection');
  await page.locator('#open-shopping').click();
  await page.locator('#shopping-kana').click();
  await page.locator('#shopping-back').click(); await checkShared(0,'shopping to place selection');
  assert.equal(await page.locator('#shopping-screen').getAttribute('data-shopping-hint-step'),'0',`${label}: shopping hint persisted after leaving`);
  await page.locator('#back-games').click(); await checkShared(0,'place selection to home');
  await page.locator('#open-listen').click(); await page.locator('#open-living').click(); await checkShared(0,'living reentry after home');
  await page.locator('#living-kana').click(); await page.locator('#living-kana').click();
  await checkShared(2,'living bilingual hint enabled');
  await page.locator('#living-home').click(); await checkShared(0,'living home');
  await page.locator('#open-listen').click(); await page.locator('#open-living').click(); await checkShared(0,'living reentry after home');
  await page.locator('#living-home').click();

  await page.locator('#open-think').click();
  await page.locator('#think-hint').click(); await checkThink(true,'Think & Say hint enabled');
  await page.locator('#think-proto-back').click(); await checkThink(false,'Think & Say back');
  await page.locator('#open-think').click(); await checkThink(false,'Think & Say reentry after back');
  await page.locator('#think-hint').click(); await page.locator('#think-proto-home').click(); await checkThink(false,'Think & Say home');
  await page.locator('#open-think').click(); await checkThink(false,'Think & Say reentry after home');
  await page.locator('#think-proto-home').click();
  console.log(`PASS ${label}: return/home and Listen & Do scene changes reset hints; legacy saved text step is ignored`);
}

async function finishWordForHintReset(page) {
  for(let count=1;count<=12;count++) {
    const answer=await page.evaluate(()=>{
      const name=document.querySelector('#word-caption-english').textContent;
      const card=[...document.querySelectorAll('#word-board .word-card:not(.queued):not(.matched)')].find(candidate=>candidate.dataset.label===name);
      return card?.dataset.word || null;
    });
    assert(answer,`Item Match: no card matches question ${count}`);
    const previous=await page.locator('#word-caption-english').innerText();
    await page.locator(`#word-board .word-card[data-word="${answer}"]`).click();
    await page.waitForFunction(({count,previous})=>{
      const matched=document.querySelectorAll('#word-board .word-card.matched').length;
      return matched>=count && (document.querySelector('#word-finish').classList.contains('show') || document.querySelector('#word-caption-english').textContent!==previous);
    },{count,previous},{timeout:4000});
  }
  assert.equal(await page.locator('#word-finish.show').count(),1,'Item Match did not reach the finish screen');
}

async function finishListenForHintReset(page,sceneName) {
  for(let round=0;round<12;round++) {
    const before=await page.evaluate(name=>window.__ouchieigoTest.state(name),sceneName);
    if(before.finish) { assert.equal(before.done,before.total,`${sceneName}: finished early`); return; }
    assert(before.item && before.target,`${sceneName}: missing current item or target`);
    const selector=await page.evaluate(({name,item})=>window.__ouchieigoTest.selector(name,item),{name:sceneName,item:before.item});
    const item=page.locator(`#${before.sceneId} ${selector}`);
    const itemBox=await item.boundingBox();
    assert(itemBox,`${sceneName}: current item ${before.item} is not visible`);
    const destination=await page.evaluate(({sceneId,target})=>{
      const scene=document.getElementById(sceneId),box=scene.querySelector(`g[data-target="${target}"] rect`).getBoundingClientRect(),stage=scene.getBoundingClientRect();
      const left=Math.max(box.left,stage.left+27),right=Math.min(box.right,stage.right-27);
      const top=Math.max(box.top,stage.top+27),bottom=Math.min(box.bottom,stage.bottom-27);
      if(right<=left || bottom<=top) throw new Error(`${sceneId}: target ${target} is not reachable`);
      return {x:(left+right)/2,y:(top+bottom)/2};
    },{sceneId:before.sceneId,target:before.target});
    await page.mouse.move(itemBox.x+itemBox.width/2,itemBox.y+itemBox.height/2);
    await page.mouse.down();
    let pointer={...destination};
    await page.mouse.move(pointer.x,pointer.y,{steps:5});
    for(let attempt=0;attempt<3;attempt++) {
      const center=await item.evaluate(element=>{ const r=(element.querySelector('img') || element).getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; });
      const dx=destination.x-center.x,dy=destination.y-center.y;
      if(Math.hypot(dx,dy)<=2) break;
      pointer={x:pointer.x+dx,y:pointer.y+dy};
      await page.mouse.move(pointer.x,pointer.y,{steps:2});
    }
    await page.mouse.up();
    await page.waitForFunction(({name,done})=>{
      const state=window.__ouchieigoTest.state(name);
      return state.done===done+1 && (state.finish || !state.transitioning);
    },{name:sceneName,done:before.done},{timeout:7000});
  }
  throw new Error(`${sceneName}: exceeded expected task count before Play again`);
}

async function checkPlayAgainHintResets(page,engineName) {
  const label=`${engineName} 375×667 Play again hint reset`;
  await page.goto(`${url}?debug=1&automation=1`,{waitUntil:'load'});
  await assertSilentAudio(page);
  const sharedStep=()=>page.evaluate(()=>document.body.classList.contains('text-bilingual') ? 2 : document.body.classList.contains('text-english') ? 1 : 0);

  await page.locator('#open-word').click(); await page.locator('#open-item-match').click();
  await page.locator('#word-kana').click(); await page.locator('#word-kana').click();
  await finishWordForHintReset(page);
  assert.equal(await sharedStep(),2,`${label}: Item Match lost hints before Play again`);
  await page.locator('#word-play-again').click();
  assert.equal(await sharedStep(),0,`${label}: Item Match Play again kept hint stage`);
  assert.equal(await page.locator('#word-kana').getAttribute('aria-pressed'),'false',`${label}: Item Match button stayed pressed`);
  assert(await page.locator('#word-board .word-card:not(.queued) .word-labels').first().isHidden(),`${label}: Item Match label stayed visible`);
  await page.locator('#word-home').click();

  for(const [name,openId,screenId,backId] of scenes) {
    await page.locator('#open-listen').click(); await page.locator(`#${openId}`).click();
    const buttonId={bathroom:'kana',breakfast:'breakfast-kana',living:'living-kana',bedroom:'bedroom-kana',entrance:'entrance-kana','bath-time':'bath-time-kana'}[name];
    const finishId={bathroom:'finish-panel',breakfast:'breakfast-finish',living:'living-finish',bedroom:'bedroom-finish',entrance:'entrance-finish','bath-time':'bath-time-finish'}[name];
    const againId={bathroom:'play-again',breakfast:'breakfast-play-again',living:'living-play-again',bedroom:'bedroom-play-again',entrance:'entrance-play-again','bath-time':'bath-time-play-again'}[name];
    const captionSelector={bathroom:'#instruction-caption',breakfast:'#breakfast-screen .breakfast-instruction-caption',living:'#living-screen .living-instruction-caption',bedroom:'#bedroom-screen .living-instruction-caption',entrance:'#entrance-screen .living-instruction-caption','bath-time':'#bath-time-screen .living-instruction-caption'}[name];
    await page.locator(`#${buttonId}`).click(); await page.locator(`#${buttonId}`).click();
    await finishListenForHintReset(page,name);
    assert.equal(await page.locator(`#${finishId}.show`).count(),1,`${label}: ${name} did not finish`);
    assert.equal(await sharedStep(),2,`${label}: ${name} lost hints before Play again`);
    await page.locator(`#${againId}`).click();
    assert.equal(await sharedStep(),0,`${label}: ${name} Play again kept hint stage`);
    assert.equal(await page.locator(`#${buttonId}`).getAttribute('aria-pressed'),'false',`${label}: ${name} button stayed pressed`);
    assert(await page.locator(captionSelector).isHidden(),`${label}: ${name} caption stayed visible`);
    await page.locator(`#${backId}`).click(); await page.locator('#back-games').click();
  }
  console.log(`PASS ${label}: Item Match and all six life scenes reset on Play again`);
}

async function checkShoppingHints(page,engineName,width,height) {
  const label=`${engineName} ${width}×${height} shopping hints`;
  await page.locator('#open-shopping').click();
  await page.waitForFunction(()=>!document.querySelector('#shopping-scene').classList.contains('scene-loading'),null,{timeout:12000});
  const snapshot=()=>page.evaluate(()=>{
    const root=document.querySelector('#shopping-screen');
    const rect=element=>{const r=element.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const cards=[...root.querySelectorAll('.shopping-card')];
    const hint=root.querySelector('#shopping-instruction-hint');
    const shown=(element,parent)=>getComputedStyle(parent).display!=='none' && getComputedStyle(element).display!=='none';
    return {step:root.dataset.shoppingHintStep,pressed:root.querySelector('#shopping-kana').getAttribute('aria-pressed'),
      scene:rect(root.querySelector('#shopping-scene')),header:rect(root.querySelector('.screen-header')),
      cards:cards.map(card=>rect(card)),kinds:cards.map(card=>card.dataset.shoppingKind),values:cards.map(card=>card.dataset.shoppingValue),art:cards.map(card=>rect(card.querySelector('.shopping-card-art,.shopping-card-number'))),
      slots:[...root.querySelectorAll('.shopping-slot')].map(rect),hint:rect(hint),hintShown:getComputedStyle(hint).display!=='none',
      japaneseShown:cards.every(card=>shown(card.querySelector('.shopping-card-hint-ja'),card.querySelector('.shopping-card-hint'))),
      englishShown:cards.every(card=>shown(card.querySelector('.shopping-card-hint-en'),card.querySelector('.shopping-card-hint'))),
      instructionJapaneseShown:shown(hint.querySelector('.shopping-instruction-ja'),hint),
      instructionEnglishShown:shown(hint.querySelector('.shopping-instruction-en'),hint),
      bands:cards.map(card=>{const band=card.querySelector('.shopping-card-hint'); return {rect:rect(band),shown:getComputedStyle(band).display!=='none',overflow:band.scrollWidth>band.clientWidth+1};}),
      labels:cards.map(card=>{const en=card.querySelector('.shopping-card-hint-en'),ja=card.querySelector('.shopping-card-hint-ja'); return {en:rect(en),ja:rect(ja),enOverflow:en.scrollWidth>en.clientWidth+1,jaOverflow:ja.scrollWidth>ja.clientWidth+1,enSize:getComputedStyle(en).fontSize,jaSize:getComputedStyle(ja).fontSize};}),
      instructionOverflow:hint.scrollHeight>hint.clientHeight+1 || hint.scrollWidth>hint.clientWidth+1};
  });
  const base=await snapshot();
  assert.equal(base.step,'0',`${label}: initial stage`);
  assert.equal(base.cards.length,10,`${label}: expected ten cards`);
  assert.equal(base.kinds.filter(kind=>kind==='item').length,5,`${label}: expected five item cards`);
  assert.equal(base.kinds.filter(kind=>kind==='number').length,5,`${label}: expected five number cards`);
  const itemKeys=new Set(['apple','banana','milk','bread','egg','tomato','carrot','potato','chicken','pork','beef','fish','strawberry']);
  assert.equal(new Set(base.values.slice(0,5)).size,5,`${label}: repeated item choice`);
  assert(base.values.slice(0,5).every(key=>itemKeys.has(key)),`${label}: unknown item choice`);
  assert.equal(new Set(base.values.slice(5)).size,5,`${label}: repeated number choice`);
  assert.equal(base.hintShown,false,`${label}: hint visible initially`);
  assert.equal(base.englishShown,false,`${label}: card English visible initially`);
  assert.equal(base.japaneseShown,false,`${label}: card Japanese visible initially`);
  assert.equal(base.instructionEnglishShown,false,`${label}: instruction English visible initially`);
  assert.equal(base.instructionJapaneseShown,false,`${label}: instruction Japanese visible initially`);
  const expected=width<380 ? {width:68,height:74,gap:2,artWidth:46,slotWidth:90,slotHeight:80}
    : width<410 ? {width:74,height:80,gap:4,artWidth:52,slotWidth:93,slotHeight:96}
    : {width:82,height:88,gap:5,artWidth:60,slotWidth:103,slotHeight:106};
  const expectedHintHeight=width<380 ? 48 : width<410 ? 52 : 55;
  const intersects=(a,b)=>a.x<b.right && a.right>b.x && a.y<b.bottom && a.bottom>b.y;
  for(let index=0;index<base.cards.length;index++) {
    const card=base.cards[index];
    assert(Math.abs(card.width-expected.width)<1 && Math.abs(card.height-expected.height)<1,`${label}: card ${index} has the wrong dimensions`);
    assert(card.height>=card.width,`${label}: card ${index} is not square or portrait`);
    assert(card.width>=48 && card.height>=48,`${label}: card ${index} is smaller than 48px`);
    assert(card.y>=base.scene.y && card.bottom<=base.scene.bottom,`${label}: card ${index} leaves the scene`);
    assert(!intersects(card,base.header),`${label}: card ${index} overlaps the top bar`);
    for(const slot of base.slots) assert(!intersects(card,slot),`${label}: card ${index} overlaps a slot`);
    if(index%5) assert(Math.abs(card.y-base.cards[index-1].bottom-expected.gap)<1,`${label}: card ${index} has the wrong vertical gap`);
    if(base.kinds[index]==='item') assert(base.art[index].width>=expected.artWidth-1,`${label}: card ${index} illustration became too small`);
    assert(Math.abs((base.art[index].y+base.art[index].height/2)-(card.y+card.height/2))<1,`${label}: card ${index} visual is not centered without hints`);
  }
  for(const slot of base.slots) assert(slot.width>=48 && slot.height>=48,`${label}: slot smaller than 48px`);
  for(const slot of base.slots) {
    assert(Math.abs(slot.width-expected.slotWidth)<1 && Math.abs(slot.height-expected.slotHeight)<1,`${label}: slot dimensions changed`);
    assert(slot.y>=base.scene.y && slot.bottom<=base.scene.bottom,`${label}: slot leaves the scene`);
  }
  assert(!intersects(base.slots[0],base.slots[1]),`${label}: the two slots overlap`);
  const tenFits=await page.evaluate(()=>{
    const column=document.querySelector('#shopping-numbers'),sample=column.querySelector('.shopping-card').cloneNode(true);
    const number=sample.querySelector('.shopping-card-number'); number.textContent='10'; number.dataset.shoppingNumber='10';
    column.append(sample);
    const cardRect=sample.getBoundingClientRect(),numberRect=number.getBoundingClientRect(); sample.remove();
    return numberRect.left>=cardRect.left+2 && numberRect.right<=cardRect.right-2;
  });
  assert(tenFits,`${label}: two-digit 10 does not fit in the number card`);
  for(const step of [1,2,0]) {
    await page.locator('#shopping-kana').click();
    await page.waitForTimeout(180);
    const state=await snapshot();
    assert.equal(state.step,String(step),`${label}: hint stage`);
    assert.equal(state.pressed,String(step!==0),`${label}: pressed state`);
    assert.deepEqual(state.cards,base.cards,`${label}: card rectangles changed with hints`);
    for(let i=0;i<state.art.length;i++) {
      const visual=state.art[i],card=state.cards[i],original=base.art[i];
      const expectedRise=step===0 ? 0 : step===1 ? 7 : width>=410 ? 12.5 : 12;
      assert(Math.abs(visual.width-original.width)<.1 && Math.abs(visual.height-original.height)<.1,`${label}: card ${i} visual size changed with hints`);
      assert(Math.abs(visual.x-original.x)<.1,`${label}: card ${i} visual moved horizontally`);
      assert(Math.abs((card.y+card.height/2)-(visual.y+visual.height/2)-expectedRise)<1,`${label}: card ${i} visual is at the wrong hint-stage height`);
    }
    assert.deepEqual(state.slots,base.slots,`${label}: slot rectangles changed with hints`);
    assert.equal(state.hintShown,step!==0,`${label}: instruction hint visibility`);
    assert.equal(state.englishShown,step!==0,`${label}: card English visibility`);
    assert.equal(state.japaneseShown,step===2,`${label}: card Japanese visibility`);
    assert.equal(state.instructionEnglishShown,step!==0,`${label}: instruction English visibility`);
    assert.equal(state.instructionJapaneseShown,step===2,`${label}: instruction Japanese visibility`);
    if(step!==0) {
      assert(Math.abs(state.hint.height-expectedHintHeight)<1,`${label}: instruction band height changed`);
      assert(state.hint.y>=state.scene.y && state.hint.bottom<=state.scene.bottom,`${label}: instruction band leaves scene`);
      assert(!intersects(state.hint,state.header),`${label}: instruction band overlaps the top bar`);
      assert.equal(state.instructionOverflow,false,`${label}: instruction text overflows`);
      for(let i=0;i<state.bands.length;i++) {
        const band=state.bands[i];
        assert.equal(band.shown,true,`${label}: card band ${i} is hidden`);
        assert.equal(band.overflow,false,`${label}: card band ${i} clips text`);
        assert(band.rect.x>=state.cards[i].x-1 && band.rect.right<=state.cards[i].right+1 && band.rect.bottom<=state.cards[i].bottom+1,`${label}: card band ${i} leaves card`);
        assert(band.rect.y>=state.cards[i].y+state.cards[i].height*.65,`${label}: card band ${i} covers too much art or number`);
        assert(state.art[i].bottom<=band.rect.y+1,`${label}: card ${i} art or number overlaps the label area`);
        assert.equal(state.labels[i].enOverflow,false,`${label}: card ${i} English is clipped`);
        assert(state.labels[i].en.x>=state.cards[i].x+1 && state.labels[i].en.right<=state.cards[i].right-1,`${label}: card ${i} English leaves the card`);
        const expectedEnglishSize=state.values[i]==='strawberry' ? 11 : state.values[i]==='chicken' ? 11.5 : 12;
        assert(Math.abs(parseFloat(state.labels[i].enSize)-expectedEnglishSize)<.1,`${label}: card ${i} English font size`);
        if(step===2) {
          assert(band.rect.height>=24 && band.rect.height<=26,`${label}: card band ${i} is not 24–26px tall`);
          assert.equal(state.labels[i].jaOverflow,false,`${label}: card ${i} Japanese is clipped`);
          assert(state.labels[i].ja.x>=state.cards[i].x+1 && state.labels[i].ja.right<=state.cards[i].right-1,`${label}: card ${i} Japanese leaves the card`);
          assert(state.labels[i].en.bottom<=state.labels[i].ja.y+1,`${label}: card ${i} English and Japanese overlap`);
          assert(Math.abs(parseFloat(state.labels[i].jaSize)-(width>=410 ? 10 : 9))<.1,`${label}: card ${i} Japanese font size`);
        }
      }
      if(step===2) {
        const edgeCases=await page.evaluate(()=>{
          const itemColumn=document.querySelector('#shopping-items'),numberColumn=document.querySelector('#shopping-numbers');
          const test=(column,value,english,japanese)=>{
            const sample=column.querySelector('.shopping-card').cloneNode(true);
            sample.dataset.shoppingValue=value;
            sample.style.position='absolute'; sample.style.top='0'; sample.style.left='0';
            sample.querySelector('.shopping-card-hint-en').textContent=english;
            sample.querySelector('.shopping-card-hint-ja').textContent=japanese;
            if(value==='10') { const digit=sample.querySelector('.shopping-card-number'); digit.textContent='10'; digit.dataset.shoppingNumber='10'; }
            column.append(sample);
            const card=sample.getBoundingClientRect(),en=sample.querySelector('.shopping-card-hint-en'),ja=sample.querySelector('.shopping-card-hint-ja');
            const enRect=en.getBoundingClientRect(),jaRect=ja.getBoundingClientRect(),band=sample.querySelector('.shopping-card-hint').getBoundingClientRect();
            const digit=value==='10' ? sample.querySelector('.shopping-card-number').getBoundingClientRect() : null;
            const result={enFits:en.scrollWidth<=en.clientWidth+1 && enRect.left>=card.left+1 && enRect.right<=card.right-1,
              jaFits:ja.scrollWidth<=ja.clientWidth+1,labelsSeparate:enRect.bottom<=jaRect.top+1,
              digitVisible:!digit || digit.bottom<=band.top+1};
            sample.remove(); return result;
          };
          return {strawberry:test(itemColumn,'strawberry','strawberry','いちご'),chicken:test(itemColumn,'chicken','chicken','とりにく'),
            potato:test(itemColumn,'potato','potato','じゃがいも'),banana:test(itemColumn,'banana','banana','バナナ'),ten:test(numberColumn,'10','ten','じゅう')};
        });
        for(const [name,result] of Object.entries(edgeCases)) {
          assert(result.enFits && result.jaFits && result.labelsSeparate,`${label}: ${name} labels clip or overlap`);
          assert(result.digitVisible,`${label}: number 10 is hidden too much by its band`);
        }
      }
    }
    if(step===0) assert(state.bands.every(band=>!band.shown),`${label}: card bands remain visible after the third press`);
  }
  await page.locator('#shopping-back').click();
  await page.locator('#open-shopping').click();
  assert.equal((await snapshot()).step,'0',`${label}: re-entry retained hints`);
  await page.locator('#shopping-back').click();
  console.log(`PASS ${label}: fixed card/art/slot geometry, hint cycle, re-entry reset`);
}

for(const [engineName,engine,launchOptions] of engines) {
  if(engineName==='webkit' && !fs.existsSync(engine.executablePath())) {
    console.log(`SKIP webkit: Playwright WebKit is not installed (${engine.executablePath()}). Chromium and other tests continue.`);
    continue;
  }
  let browser;
  try { browser=await engine.launch({headless:true,...launchOptions}); }
  catch(error) { failures++; console.error(`FAIL ${engineName}: browser did not launch: ${error.stack || error}`); continue; }
  try {
    for(const [width,height] of sizes) {
      const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
      await installSilentAudio(page);
      await page.addInitScript(()=>{
        const originalRandom=Math.random;
        window.__setActionTestRandom=draws=>{ let index=0; Math.random=()=>draws[index++%draws.length]; };
        window.__restoreActionTestRandom=()=>{ Math.random=originalRandom; };
      });
      let current='startup';
      try {
        await page.goto(url,{waitUntil:'load'});
        await assertSilentAudio(page);
        const capture=async(id,kind)=>{ current=`${engineName} ${width}×${height} ${id}`; if(kind==='scene') await page.waitForFunction(screenId=>!document.querySelector(`#${screenId} section`)?.classList.contains('scene-loading'),id,{timeout:12000}); await inspect(page,id,kind,width,height); await page.screenshot({path:path.join(output,`${engineName}-${width}x${height}-${id}.png`)}); };
        await capture('home-screen','home');
        await page.locator('#open-word').click(); await capture('match-mode-screen','mode');
        await page.locator('#open-item-match').click(); await capture('word-screen','word');
        await inspectWordCaption(page,engineName,width,height);
        await inspectWordFoodCards(page,width,height);
        await page.locator('#word-home').click();
        const selectedWords=new Set();
        for(const fixture of actionFixtures) {
          const openings=[];
          for(const opening of [1,2]) {
            await page.locator('#open-word').click();
            await page.evaluate(draws=>window.__setActionTestRandom(draws),fixture.draws);
            await page.locator('#open-action-match').click();
            current=`${engineName} ${width}×${height} Action Match ${fixture.name}, opening ${opening}`;
            if(fixture===actionFixtures[0] && opening===1) {
              await capture('action-screen','action');
              const panelCounts=await page.locator('#action-screen .action-card').evaluateAll(cards=>({two:cards.filter(card=>card.dataset.panels==='2').length,three:cards.filter(card=>card.dataset.panels==='3').length,total:cards.length}));
              assert.deepEqual(panelCounts,{two:32,three:0,total:32},`${current}: Action Match panel metadata must cover 32 two-panel images`);
            }
            const selected=await inspectActionSelection(page,engineName,width,height,fixture,opening);
            for(const card of selected) selectedWords.add(card.action);
            if(fixture===actionFixtures[0] && opening===1) {
              const inspected=new Set();
              for(const [index,batch] of actionImageBatches.entries()) {
                for(const card of await inspectActionImages(page,engineName,width,height,batch,index+1)) inspected.add(card.name);
              }
              assert.deepEqual(inspected,new Set(actionImageNames),`${current}: not all 32 Action Match images were inspected`);
              await showActionImages(page,selected.map(card=>card.name));
              await checkAllActionHintGeometry(page,engineName,width,height,selected);
            }
            openings.push(selected);
            if(opening===1) {
              if(fixture===actionFixtures[0]) await page.locator('#action-hint').click();
              await inspectMatchedSlots(page,selected,current);
              if(fixture===actionFixtures[0]) {
                await assertActionHintStep(page,1,width,height); // 問題が進んでも段階を保持
                await page.locator('#action-hint').click();
                await assertActionHintStep(page,2,width,height);
                await finishActionGame(page,current);
                await assertActionHintStep(page,2,width,height);
                await page.evaluate(draws=>window.__setActionTestRandom(draws),fixture.draws);
                await page.locator('#action-play-again').click();
                await assertActionHintStep(page,0,width,height);
                const restarted=await inspectActionSelection(page,engineName,width,height,fixture,'Play again');
                assert.deepEqual(restarted.map(card=>card.name),selected.map(card=>card.name),`${current}: Play again did not reset the seeded selection`);
                assert.equal(await page.locator('#action-screen .action-card.matched').count(),0,`${current}: Play again retained matched cards`);
                assert.equal(await page.locator('#action-screen .action-card.queued').count(),28,`${current}: Play again did not reset hidden cards`);
                assert.equal(await page.locator('#action-finish.show').count(),0,`${current}: Play again retained finish screen`);
              }
            }
            await page.locator('#action-home').click();
          }
          assert.deepEqual(openings[1],openings[0],`${current}: same random draws changed the visible order after reopening`);
        }
        assert.deepEqual(selectedWords,new Set(actionKeys),`${engineName} ${width}×${height}: seeded games did not cover all 16 actions`);
        await page.evaluate(()=>window.__restoreActionTestRandom());
        await page.locator('#open-listen').click(); await capture('place-screen','place');
        for(const [name,openId,screenId,backId] of scenes) {
          await page.locator(`#${openId}`).click(); await capture(screenId,'scene');
          if(name==='breakfast') await inspectBreakfastLabels(page,width,height);
          if(name==='living') await inspectLivingLabels(page,width,height);
          if(name==='bedroom') await inspectBedroomLabels(page,width,height);
          await page.locator(`#${backId}`).click();
        }
        current=`${engineName} ${width}×${height} shopping hints`;
        await checkShoppingHints(page,engineName,width,height);
        if(width===375) { current=`${engineName} 375×667 hint exit`; await checkHintExitResets(page,engineName); current=`${engineName} 375×667 Play again`; await checkPlayAgainHintResets(page,engineName); }
        completed++;
      } catch(error) {
        failures++;
        const file=path.join(output,`${engineName}-${width}x${height}-FAILED.png`);
        await page.screenshot({path:file}).catch(()=>{});
        console.error(`FAIL ${current}: ${error.stack || error}`);
        console.error(`Screenshot: ${file}`);
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
}
if(failures) process.exitCode=1;
else console.log(`RESPONSIVE LAYOUT PASSED: ${completed} browser/size runs × 10 screens, all 32 Action Match images, shopping hints, Play again, and reopening. Screenshots: ${output}`);
