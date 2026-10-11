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
  bring:{phrase:'Bring it to me.',images:['action-bring-boy-v3.png.webp','action-bring-girl-v4.png.webp']},
  throw:{phrase:'Throw it away.',images:['action-throw-boy-v3.png.webp','action-throw-girl-v5.png.webp']},
  'put-on':{phrase:'Put it on.',images:['action-put-on-boy-v3b.png.webp','action-put-on-girl-v3a.png.webp']},
  'take-off':{phrase:'Take it off.',images:['action-take-off-boy-v1b.png.webp','action-take-off-girl-v3a.png.webp']},
  open:{phrase:'Open it.',images:['action-open-boy-v1b.png.webp','action-open-girl-v2a.png.webp']},
  close:{phrase:'Close it.',images:['action-close-boy-v1a.png.webp','action-close-girl-v1a.png.webp']},
  'pick-up':{phrase:'Pick it up.',images:['action-pick-up-boy-v1a.png.webp','action-pick-up-girl-v1b.png.webp']},
};
const actionKeys=Object.keys(actionDefinitions);
const actionImageNames=Object.values(actionDefinitions).flatMap(({images})=>images);
const actionImageBatches=Array.from({length:Math.ceil(actionImageNames.length/4)},(_,index)=>{
  const batch=actionImageNames.slice(index*4,index*4+4);
  return [...batch,...actionImageNames.slice(0,4-batch.length)];
});
assert.equal(actionKeys.length,9);
assert.equal(new Set(actionImageNames).size,18);
const actionSource=fs.readFileSync(path.join(root,'index.html'),'utf8');
const actionPhrasesLiteral=actionSource.match(/const actionPhrases=(\{[^;]+\});/)?.[1];
assert(actionPhrasesLiteral,'Action Match speech phrase table is missing');
const actualActionPhrases=JSON.parse(JSON.stringify(vm.runInNewContext(`(${actionPhrasesLiteral})`)));
assert.deepEqual(actualActionPhrases,Object.fromEntries(Object.entries(actionDefinitions).map(([key,{phrase}])=>[key,phrase])),'Action Match speech phrase table differs from the nine approved sentences');
const actionFixtures=[
  {name:'low',draws:[0],expected:['action-bring-girl-v4.png.webp','action-throw-girl-v5.png.webp','action-put-on-girl-v3a.png.webp','action-get-girl-v4.png.webp']},
  {name:'middle',draws:[0.45],expected:['action-open-girl-v2a.png.webp','action-pick-up-girl-v1b.png.webp','action-get-girl-v4.png.webp','action-put-girl-v5.png.webp']},
  {name:'half',draws:[0.5],expected:['action-put-boy-v5.png.webp','action-close-boy-v1a.png.webp','action-take-off-boy-v1b.png.webp','action-get-boy-v4.png.webp']},
];
assert.deepEqual(new Set(actionFixtures.flatMap(fixture=>fixture.expected.map(name=>Object.entries(actionDefinitions).find(([,definition])=>definition.images.includes(name))?.[0]))),new Set(actionKeys),'Seeded fixtures must cover all nine action words');
const scenes=[['bathroom','open-bathroom','game-screen','bathroom-back','scene'],['breakfast','open-breakfast','breakfast-screen','breakfast-back','breakfast-scene'],['living','open-living','living-screen','living-back','living-scene'],['bedroom','open-bedroom','bedroom-screen','bedroom-back','bedroom-scene']];
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
    else if(kind==='place') result.cards=visible('.place-card');
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
    assert(element.y>=result.header.bottom-tolerance && element.bottom<=result.root.bottom+tolerance,`${id}: ${element.name} is clipped vertically: ${JSON.stringify(element)}`);
  }
  if(kind==='word') assert.equal(result.cards.length,12,`${id}: expected 12 visible cards`);
  if(kind==='action') assert.equal(result.cards.length,4,`${id}: expected 4 visible cards`);
  if(kind==='place') assert.equal(result.cards.length,4,`${id}: expected 4 place cards`);
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

async function inspectActionSelection(page,engineName,width,height,fixture,opening) {
  const cards=await page.evaluate(()=>[...document.querySelectorAll('#action-screen .action-card:not(.queued)')].map(card=>{
    const rect=card.getBoundingClientRect();
    return {name:card.querySelector('img').getAttribute('src'),action:card.dataset.action,y:rect.y,hidden:card.getAttribute('aria-hidden'),tabIndex:card.tabIndex};
  }));
  const label=`${engineName} ${width}×${height} ${fixture.name}, opening ${opening}`;
  assert.equal(cards.length,4,`${label}: expected four visible Action Match cards`);
  assert.equal(new Set(cards.map(card=>card.action)).size,4,`${label}: action words are duplicated`);
  assert.deepEqual(cards.map(card=>card.name),fixture.expected,`${label}: seeded selection or visual/DOM order is incorrect`);
  for(let i=0;i<cards.length;i++) {
    assert.equal(cards[i].hidden,null,`${label}: visible card is hidden from accessibility`);
    assert.equal(cards[i].tabIndex,0,`${label}: visible card is missing from keyboard order`);
    if(i) assert(cards[i].y>cards[i-1].y,`${label}: DOM order differs from visual top-to-bottom order`);
  }
  console.log(`PASS ${label}: four distinct words in seeded visual and accessibility order`);
  return cards;
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
      const imageStyle=getComputedStyle(img);
      return {name:img.getAttribute('src'),action:card.dataset.action,panels:Number(card.dataset.panels),legacyDivider:card.classList.contains('action-divider-blue'),card:rect(card),image,rendered:{x:image.x+(image.w-renderedWidth)/2,y:image.y+(image.h-renderedHeight)/2,w:renderedWidth,h:renderedHeight,right:image.x+(image.w+renderedWidth)/2,bottom:image.y+(image.h+renderedHeight)/2},imageStyle:{position:imageStyle.position,objectFit:imageStyle.objectFit},imageParentIsCard:img.parentElement===card,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,clientWidth:card.clientWidth,clientHeight:card.clientHeight,before:pseudo(card,'::before'),after:pseudo(card,'::after')};
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
    assert(card.image.x>=card.card.x-1.5 && card.image.right<=card.card.right+1.5 && card.image.y>=card.card.y-1.5 && card.image.bottom<=card.card.bottom+1.5,`${label}: image extends beyond card: ${JSON.stringify(card)}`);
    assert.equal(card.imageStyle.position,'absolute',`${label}: image sizing depends on the grid row`);
    assert.equal(card.imageStyle.objectFit,'contain',`${label}: artwork can be stretched or cropped`);
    assert(card.rendered.w>60 && card.rendered.h>40,`${label}: rendered artwork is blank or collapsed: ${JSON.stringify(card)}`);
    assert(card.rendered.x>=card.card.x-1.5 && card.rendered.right<=card.card.right+1.5 && card.rendered.y>=card.card.y-1.5 && card.rendered.bottom<=card.card.bottom+1.5,`${label}: rendered artwork extends beyond card: ${JSON.stringify(card)}`);
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
              assert.deepEqual(panelCounts,{two:18,three:0,total:18},`${current}: Action Match panel metadata must cover 18 two-panel images`);
            }
            const selected=await inspectActionSelection(page,engineName,width,height,fixture,opening);
            for(const card of selected) selectedWords.add(card.action);
            if(fixture===actionFixtures[0] && opening===1) {
              const inspected=new Set();
              for(const [index,batch] of actionImageBatches.entries()) {
                for(const card of await inspectActionImages(page,engineName,width,height,batch,index+1)) inspected.add(card.name);
              }
              assert.deepEqual(inspected,new Set(actionImageNames),`${current}: not all 18 Action Match images were inspected`);
              await showActionImages(page,selected.map(card=>card.name));
            }
            openings.push(selected);
            if(opening===1) {
              await inspectMatchedSlots(page,selected,current);
              if(fixture===actionFixtures[0]) {
                await finishActionGame(page,current);
                await page.evaluate(draws=>window.__setActionTestRandom(draws),fixture.draws);
                await page.locator('#action-play-again').click();
                const restarted=await inspectActionSelection(page,engineName,width,height,fixture,'Play again');
                assert.deepEqual(restarted.map(card=>card.name),selected.map(card=>card.name),`${current}: Play again did not reset the seeded selection`);
                assert.equal(await page.locator('#action-screen .action-card.matched').count(),0,`${current}: Play again retained matched cards`);
                assert.equal(await page.locator('#action-screen .action-card.queued').count(),14,`${current}: Play again did not reset hidden cards`);
                assert.equal(await page.locator('#action-finish.show').count(),0,`${current}: Play again retained finish screen`);
              }
            }
            await page.locator('#action-home').click();
          }
          assert.deepEqual(openings[1],openings[0],`${current}: same random draws changed the visible order after reopening`);
        }
        assert.deepEqual(selectedWords,new Set(actionKeys),`${engineName} ${width}×${height}: seeded games did not cover all nine verbs`);
        await page.evaluate(()=>window.__restoreActionTestRandom());
        await page.locator('#open-listen').click(); await capture('place-screen','place');
        for(const [name,openId,screenId,backId] of scenes) {
          await page.locator(`#${openId}`).click(); await capture(screenId,'scene'); await page.locator(`#${backId}`).click();
        }
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
else console.log(`RESPONSIVE LAYOUT PASSED: ${completed} browser/size runs × 9 screens, all 18 Action Match images, Play again, and reopening. Screenshots: ${output}`);
