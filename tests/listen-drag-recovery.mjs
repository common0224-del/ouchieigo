import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {checkIndexSyntax} from './check-index-syntax.mjs';
import {installSilentAudio,assertSilentAudio} from './silent-audio.mjs';

const syntax=checkIndexSyntax(path.resolve('index.html'));
console.log(`構文チェック PASS: index.html のスクリプト ${syntax.scripts}件、関数 ${syntax.functions}件、.speech-debug 系 CSS ${syntax.debugSelectors}件。重複なし。`);
const require=createRequire(import.meta.url);
const {chromium,webkit}=require('playwright');
const appUrl=`${pathToFileURL(path.resolve('index.html')).href}?debug=1&automation=1`;
const sceneNames=['bathroom','breakfast','living','bedroom'];
const engines=process.env.RUN_WEBKIT==='1' ? [['webkit',webkit,{}]] : [['chromium',chromium,{...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}),args:['--mute-audio']}]];
const artifactDirectory=path.resolve('tests','artifacts');
const delay=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
let currentOperation={scene:'startup',round:0,action:'open browser'}, currentViewport='';

async function state(page,sceneName) { return page.evaluate(name=>window.__ouchieigoTest.state(name),sceneName); }
async function events(page) { return page.evaluate(()=>window.__ouchieigoTest.events()); }
async function assertNoUnexpectedActivity(page,phase) {
  const recorded=await events(page);
  assert.equal(recorded.recovery.length,0,`${phase}: normal play invoked game recovery: ${JSON.stringify(recorded.recovery)}`);
  const hidden=recorded.speech.filter(event=>event.scene && !event.visible);
  assert.equal(hidden.length,0,`${phase}: hidden scene speech: ${JSON.stringify(hidden)}`);
}

async function pointFor(page,sceneName,kind,position='center') {
  const snapshot=await state(page,sceneName);
  return page.evaluate(({sceneId,name,target,outside,position,wrongTarget})=>{
    const scene=document.getElementById(sceneId),svg=scene.querySelector('svg');
    if(outside) { const stage=scene.getBoundingClientRect(),art=svg.getBoundingClientRect(); return {x:art.left+art.width/2,y:Math.min(stage.bottom-25,art.bottom+65)}; }
    const other=wrongTarget ? [...svg.querySelectorAll('g[data-target]')].find(group=>group.dataset.target!==target) : null;
    const rect=(other || svg.querySelector(`g[data-target="${target}"]`))?.querySelector('rect');
    if(!rect) throw new Error(`${name}: rendered target ${target} not found`);
    const box=rect.getBoundingClientRect(), stage=scene.getBoundingClientRect();
    // A full item remains on screen during dragging, so use the reachable part
    // of a drawn zone when that zone touches a screen edge.
    const left=Math.max(box.left,stage.left+27), right=Math.min(box.right,stage.right-27);
    const top=Math.max(box.top,stage.top+27), bottom=Math.min(box.bottom,stage.bottom-27);
    if(right<=left || bottom<=top) throw new Error(`${name}: rendered target ${target} cannot be reached by an item center`);
    const fractions={center:[.5,.5],left:[.15,.5],right:[.85,.5],top:[.5,.15],bottom:[.5,.85]};
    const [fx,fy]=fractions[position];
    return {x:left+(right-left)*fx,y:top+(bottom-top)*fy};
  },{sceneId:snapshot.sceneId,name:sceneName,target:snapshot.target,outside:kind==='outside',wrongTarget:kind==='wrong-target',position});
}

async function itemLocator(page,sceneName,item) {
  const selector=await page.evaluate(({name,itemName})=>window.__ouchieigoTest.selector(name,itemName),{name:sceneName,itemName:item});
  return page.locator(selector);
}

async function artworkCenter(item) {
  return item.evaluate(element=>{
    const artwork=element.querySelector('img') || element, rect=artwork.getBoundingClientRect();
    return {x:rect.left+rect.width/2,y:rect.top+rect.height/2};
  });
}

async function alignArtworkCenter(page,item,destination) {
  let pointer={...destination};
  await page.mouse.move(pointer.x,pointer.y,{steps:5});
  for(let attempt=0;attempt<3;attempt++) {
    const center=await artworkCenter(item), dx=destination.x-center.x, dy=destination.y-center.y;
    if(Math.hypot(dx,dy)<=1.5) return center;
    pointer={x:pointer.x+dx,y:pointer.y+dy};
    await page.mouse.move(pointer.x,pointer.y,{steps:2});
  }
  const center=await artworkCenter(item);
  assert(Math.hypot(destination.x-center.x,destination.y-center.y)<=2.5,
    `artwork center could not reach rendered target: wanted=${JSON.stringify(destination)}, actual=${JSON.stringify(center)}`);
  return center;
}

async function dragCurrent(page,sceneName,kind='correct',position='center') {
  const before=await state(page,sceneName), item=await itemLocator(page,sceneName,before.item), itemBox=await item.boundingBox();
  assert(itemBox,`${sceneName}: current item ${before.item} is not visible`);
  const destination=await pointFor(page,sceneName,kind==='correct' ? 'correct' : kind==='wrong-target' ? 'wrong-target' : 'outside',position);
  await page.mouse.move(itemBox.x+itemBox.width/2,itemBox.y+itemBox.height/2);
  await page.mouse.down();
  const started=await state(page,sceneName);
  assert.equal(started.active,true,`${sceneName}: pointerdown did not start drag; item may be covered by another element`);
  const visibleCenter=kind==='correct' ? await alignArtworkCenter(page,item,destination) : null;
  if(!visibleCenter) await page.mouse.move(destination.x,destination.y,{steps:5});
  await page.mouse.up();
  if(visibleCenter) {
    const judgedCenter=await page.locator(`#${before.sceneId} .drop-debug-point`).evaluate(marker=>{
      const rect=marker.getBoundingClientRect(); return {x:rect.left+rect.width/2,y:rect.top+rect.height/2};
    });
    assert(Math.hypot(judgedCenter.x-visibleCenter.x,judgedCenter.y-visibleCenter.y)<=3,
      `${sceneName}: drop verdict did not use the visibly enlarged artwork center`);
  }
  return before;
}

async function dragWrongItem(page,sceneName) {
  const before=await state(page,sceneName);
  const selector=await page.evaluate(name=>{
    const current=window.__ouchieigoTest.state(name), currentSelector=window.__ouchieigoTest.selector(name,current.item), root=document.querySelector(`#${current.sceneId}`);
    const candidates=[...root.querySelectorAll('button')].filter(element=>element.matches('[data-item],[data-breakfast-item],[data-living-item],[data-bedroom-item]')&&!element.matches(currentSelector)&&!element.classList.contains('done')&&!element.classList.contains('queued'));
    const element=candidates[0];
    if(!element) return null;
    for(const attribute of ['data-item','data-breakfast-item','data-living-item','data-bedroom-item']) if(element.hasAttribute(attribute)) return `[${attribute}="${element.getAttribute(attribute)}"]`;
    return null;
  },sceneName);
  if(!selector) return false;
  const item=page.locator(selector), itemBox=await item.boundingBox(), destination=await pointFor(page,sceneName,'correct');
  assert(itemBox,`${sceneName}: wrong item is not visible`);
  await page.mouse.move(itemBox.x+itemBox.width/2,itemBox.y+itemBox.height/2);
  await page.mouse.down();
  await page.mouse.move(destination.x,destination.y,{steps:5});
  await page.mouse.up();
  await delay(120);
  const after=await state(page,sceneName);
  assert.equal(after.current,before.current,`${sceneName}: incorrect drop advanced the task`);
  assert.equal(after.done,before.done,`${sceneName}: incorrect drop completed an item`);
  assert.equal(after.active,false,`${sceneName}: incorrect drop left an active drag`);
  assert(after.grabbable>0,`${sceneName}: incorrect drop left no grabbable item`);
  return true;
}

async function interruptDrag(page,sceneName,eventType) {
  const before=await state(page,sceneName), item=await itemLocator(page,sceneName,before.item), itemBox=await item.boundingBox();
  assert(itemBox,`${sceneName}: interrupted item is not visible`);
  await page.mouse.move(itemBox.x+itemBox.width/2,itemBox.y+itemBox.height/2);
  await page.mouse.down();
  await page.mouse.move(itemBox.x+itemBox.width/2-45,itemBox.y-70,{steps:3});
  await item.dispatchEvent(eventType,{pointerId:1,pointerType:'mouse',clientX:itemBox.x,clientY:itemBox.y});
  await page.mouse.up();
  await delay(120);
  const after=await state(page,sceneName);
  assert.equal(after.active,false,`${sceneName}: ${eventType} left an active drag`);
  assert.equal(after.done,before.done,`${sceneName}: ${eventType} completed an item`);
  assert(after.grabbable>0,`${sceneName}: ${eventType} did not restore the item`);
}

async function checkEventOrders(page,sceneName) {
  const begin=async()=>{
    const before=await state(page,sceneName), item=await itemLocator(page,sceneName,before.item), box=await item.boundingBox();
    assert(box,`${sceneName}: current item is not visible`);
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
    await page.mouse.down();
    return {before,item,box};
  };
  const dispatch=async(item,type,point,buttons)=>item.dispatchEvent(type,{pointerId:1,pointerType:'mouse',button:0,buttons,clientX:point.x,clientY:point.y});
  const unchanged=async(before,reason)=>{
    const after=await state(page,sceneName);
    assert.equal(after.active,false,`${sceneName}: ${reason} left a drag active`);
    assert.equal(after.done,before.done,`${sceneName}: ${reason} incorrectly accepted a drop`);
  };
  let attempt=await begin();
  let destination=await pointFor(page,sceneName,'correct');
  await alignArtworkCenter(page,attempt.item,destination);
  await dispatch(attempt.item,'lostpointercapture',destination,1);
  assert.equal((await state(page,sceneName)).captureLost,true,`${sceneName}: capture loss was not tracked`);
  await page.mouse.up();
  assert.equal((await state(page,sceneName)).done,attempt.before.done+1,`${sceneName}: pointerup after capture loss was not accepted`);
  await dispatch(attempt.item,'pointerup',destination,0);
  assert.equal((await state(page,sceneName)).done,attempt.before.done+1,`${sceneName}: duplicate pointerup advanced twice`);
  await waitForCorrectProgress(page,sceneName,attempt.before,'capture-loss');

  attempt=await begin(); destination=await pointFor(page,sceneName,'correct');
  await alignArtworkCenter(page,attempt.item,destination);
  await dispatch(attempt.item,'pointermove',destination,0);
  assert.equal((await state(page,sceneName)).releaseObserved,true,`${sceneName}: buttons===0 was not observed`);
  assert.equal((await state(page,sceneName)).done,attempt.before.done,`${sceneName}: buttons===0 accepted without pointerup`);
  await page.mouse.up();
  assert.equal((await state(page,sceneName)).done,attempt.before.done+1,`${sceneName}: pointerup after buttons===0 was not accepted`);
  await waitForCorrectProgress(page,sceneName,attempt.before,'buttons-zero');

  attempt=await begin(); destination=await pointFor(page,sceneName,'correct');
  await alignArtworkCenter(page,attempt.item,destination);
  await dispatch(attempt.item,'pointermove',destination,0);
  await dispatch(attempt.item,'lostpointercapture',destination,0);
  assert.equal((await state(page,sceneName)).captureLost,true,`${sceneName}: buttons===0 before capture loss was not tracked`);
  await page.mouse.up();
  assert.equal((await state(page,sceneName)).done,attempt.before.done+1,`${sceneName}: buttons===0 → capture loss → pointerup failed`);
  await waitForCorrectProgress(page,sceneName,attempt.before,'buttons-zero-before-capture-loss');

  attempt=await begin(); destination=await pointFor(page,sceneName,'correct');
  await alignArtworkCenter(page,attempt.item,destination);
  await dispatch(attempt.item,'lostpointercapture',destination,0);
  await dispatch(attempt.item,'pointercancel',destination,0);
  await page.mouse.up();
  await unchanged(attempt.before,'pointercancel while awaiting pointerup');

  attempt=await begin(); destination=await pointFor(page,sceneName,'correct');
  await alignArtworkCenter(page,attempt.item,destination);
  await dispatch(attempt.item,'lostpointercapture',destination,0);
  await delay(180);
  assert.equal((await state(page,sceneName)).active,false,`${sceneName}: missing pointerup did not time out`);
  await page.mouse.up();
  await unchanged(attempt.before,'pointerup timeout');

  attempt=await begin(); destination=await pointFor(page,sceneName,'correct');
  await alignArtworkCenter(page,attempt.item,destination);
  await dispatch(attempt.item,'lostpointercapture',destination,1);
  await delay(2080);
  assert.equal((await state(page,sceneName)).active,false,`${sceneName}: active capture loss did not time out`);
  await page.mouse.up();
  await unchanged(attempt.before,'active capture-loss timeout');

  attempt=await begin(); destination=await pointFor(page,sceneName,'correct');
  const outside=await pointFor(page,sceneName,'outside');
  await page.mouse.move(outside.x,outside.y,{steps:5});
  await dispatch(attempt.item,'pointerup',destination,0);
  assert.equal((await state(page,sceneName)).done,attempt.before.done+1,`${sceneName}: pointerup final coordinates were not applied`);
  await page.mouse.up();
  assert.equal((await state(page,sceneName)).done,attempt.before.done+1,`${sceneName}: delayed pointerup advanced twice`);
  await waitForCorrectProgress(page,sceneName,attempt.before,'final-coordinate');

  attempt=await begin();
  await page.mouse.move(attempt.box.x+attempt.box.width/2-40,attempt.box.y-65,{steps:3});
  await page.evaluate(name=>window.__ouchieigoTest.resetScene(name),sceneName);
  await page.mouse.up();
  const resetState=await state(page,sceneName);
  assert.equal(resetState.active,false,`${sceneName}: reset left a drag active`);
  assert.equal(resetState.done,0,`${sceneName}: reset did not start a fresh round`);

  attempt=await begin(); destination=await pointFor(page,sceneName,'correct');
  await alignArtworkCenter(page,attempt.item,destination);
  await page.evaluate(name=>document.querySelector(`#${name}-back`).click(),sceneName);
  assert.equal((await state(page,sceneName)).active,false,`${sceneName}: leaving kept an active drag`);
  await page.mouse.up();
  await page.evaluate(name=>window.__ouchieigoTest.showScene(name),sceneName);
  assert.equal((await state(page,sceneName)).active,false,`${sceneName}: reentry kept an active drag`);
}

async function waitForCorrectProgress(page,sceneName,before,round) {
  const deadline=Date.now()+6000;
  let actual=await state(page,sceneName);
  while(Date.now()<deadline) {
    actual=await state(page,sceneName);
    if(actual.done===before.done+1 && (actual.finish || actual.current!==before.current)) return actual;
    await delay(100);
  }
  const classification=actual.done===before.done ? 'TEST DROP WAS NOT ACCEPTED AS CORRECT' : 'APP ACCEPTED DROP BUT DID NOT ADVANCE';
  throw new Error([classification,`scene=${sceneName}`,`round=${round}`,'waiting=done count +1, then current task change or finish screen',`before=${JSON.stringify(before)}`,`actual=${JSON.stringify(actual)}`].join('\n'));
}

async function runScene(page,sceneName) {
  currentOperation={scene:sceneName,round:0,action:'initialize scene'};
  await page.evaluate(name=>window.__ouchieigoTest.showScene(name),sceneName);
  const opened=await state(page,sceneName);
  assert(opened.started && opened.visible,`${sceneName}: scene was not marked started and visible: ${JSON.stringify(opened)}`);
  await assertNoUnexpectedActivity(page,`${sceneName} open`);
  currentOperation.action='pointercancel recovery';
  await interruptDrag(page,sceneName,'pointercancel');
  currentOperation.action='lostpointercapture recovery';
  await interruptDrag(page,sceneName,'lostpointercapture');
  currentOperation.action='capture-loss and release event orders';
  await checkEventOrders(page,sceneName);
  let rounds=0, incorrectDrops=0, outsideDrops=0;
  while(!(await state(page,sceneName)).finish) {
    const before=await state(page,sceneName);
    currentOperation={scene:sceneName,round:rounds+1,action:'precondition'};
    assert(before.current,`${sceneName}: no current task before completion`);
    assert(before.grabbable>0,`${sceneName}: no grabbable item before completion`);
    if(rounds%3===0) { currentOperation.action='incorrect drop'; if(await dragWrongItem(page,sceneName)) incorrectDrops++; }
    if(rounds%2===0) {
      currentOperation.action='outside drop';
      const outsideBefore=await dragCurrent(page,sceneName,'outside');
      outsideDrops++;
      const restored=await state(page,sceneName);
      assert.equal(restored.current,outsideBefore.current,`${sceneName}: outside drop advanced the task`);
      assert.equal(restored.done,outsideBefore.done,`${sceneName}: outside drop completed an item`);
      assert.equal(restored.active,false,`${sceneName}: outside drop left an active drag`);
    }
    if(rounds===0) {
      currentOperation.action='wrong target';
      const wrongTargetBefore=await dragCurrent(page,sceneName,'wrong-target');
      const afterWrongTarget=await state(page,sceneName);
      assert.equal(afterWrongTarget.done,wrongTargetBefore.done,`${sceneName}: wrong target completed an item`);
      assert.equal(afterWrongTarget.active,false,`${sceneName}: wrong target left an active drag`);
    }
    currentOperation.action='correct drop and advance';
    const edgePositions=['center','left','right','top','bottom'];
    const position=edgePositions[rounds%edgePositions.length];
    currentOperation.action=`correct drop (${position}) and advance`;
    const currentBeforeCorrect=await dragCurrent(page,sceneName,'correct',position);
    const duringTransition=await state(page,sceneName);
    assert.equal(duringTransition.done,currentBeforeCorrect.done+1,`${sceneName}: correct drop did not mark item done`);
    assert.equal(duringTransition.transitioning,true,`${sceneName}: correct drop did not enter transition state`);
    const recoveredDuringTransition=await page.evaluate(name=>window.__ouchieigoTest.recover(name,'transition-probe'),sceneName);
    assert.equal(recoveredDuringTransition,false,`${sceneName}: recovery ran during the success transition`);
    await waitForCorrectProgress(page,sceneName,currentBeforeCorrect,rounds+1);
    await assertNoUnexpectedActivity(page,`${sceneName} round ${rounds+1}`);
    const after=await state(page,sceneName);
    assert.equal(after.active,false,`${sceneName}: correct drop left an active drag`);
    assert(after.finish || after.grabbable>0,`${sceneName}: correct drop caused a deadlock`);
    rounds++;
    assert(rounds<30,`${sceneName}: exceeded expected task count`);
  }
  const finished=await state(page,sceneName);
  assert.equal(finished.done,finished.total,`${sceneName}: finish shown before every item was completed`);
  return {rounds,incorrectDrops,outsideDrops,total:finished.total};
}

async function saveFailure(page,engineName,consoleEntries,error) {
  fs.mkdirSync(artifactDirectory,{recursive:true});
  const stamp=new Date().toISOString().replaceAll(':','-').replaceAll('.','-');
  const screenshotPath=path.join(artifactDirectory,`failure-${engineName}-${currentOperation.scene}-round-${currentOperation.round}-${stamp}.png`);
  let actual=null;
  try { actual=await state(page,currentOperation.scene); } catch (_) {}
  try { await page.screenshot({path:screenshotPath,fullPage:true}); } catch (_) {}
  console.error('\n========== AUTOMATED TEST FAILED ==========');
  console.error(`場面: ${currentOperation.scene}`);
  console.error(`画面サイズ: ${currentViewport}`);
  console.error(`操作回数: ${currentOperation.round}`);
  console.error(`操作: ${currentOperation.action}`);
  console.error(`実際の状態: ${JSON.stringify(actual)}`);
  console.error(`スクリーンショット: ${screenshotPath}`);
  console.error(`原因情報:\n${error.stack || error}`);
  console.error('ブラウザコンソール:');
  console.error(consoleEntries.length ? consoleEntries.join('\n') : '(ログなし)');
  console.error('===========================================\n');
}

let failed=false;
for(const [engineName,engine,launchOptions] of engines) {
  const browser=await engine.launch({headless:true,...launchOptions});
  try {
    for(const [width,height] of [[375,667],[390,844],[430,932]]) {
      currentViewport=`${width}×${height}`;
      const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
      await installSilentAudio(page);
      const consoleEntries=[];
      page.on('console',message=>consoleEntries.push(`[${message.type()}] ${message.text()}`));
      page.on('pageerror',error=>consoleEntries.push(`[pageerror] ${error.stack || error}`));
      try {
        await page.goto(appUrl,{waitUntil:'load'});
        await assertSilentAudio(page);
        // Include the 2.5-second recovery watchdog window while still on Home.
        await delay(3000);
        const startup=await events(page);
        assert.equal(startup.speech.length,0,`home screen startup called speak(): ${JSON.stringify(startup.speech)}`);
        await assertNoUnexpectedActivity(page,'home screen startup');
        const results={};
        for(const sceneName of sceneNames) results[sceneName]=await runScene(page,sceneName);
        console.log(`PASS ${engineName} ${currentViewport}: ホーム起動時 speak() 0件、通常プレイ中の自動回復 0件、非表示場面の読み上げ 0件。`);
        for(const [sceneName,result] of Object.entries(results)) console.log(`  ${sceneName}: ${result.rounds}/${result.total}完了、不正解${result.incorrectDrops}回、枠外${result.outsideDrops}回`);
      } catch (error) {
        failed=true;
        await saveFailure(page,engineName,consoleEntries,error);
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
}
if(failed) process.exitCode=1;
else console.log('AUTOMATED TEST PASSED: 3 sizes × 4 scenes, center and near-edge drops');
