import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {checkIndexSyntax} from './check-index-syntax.mjs';

const root=path.resolve('.');
checkIndexSyntax(path.join(root,'index.html'));
const require=createRequire(import.meta.url);
const {chromium,webkit}=require('playwright');
const output=path.join(root,'tests','artifacts','responsive');
fs.mkdirSync(output,{recursive:true});
const url=pathToFileURL(path.join(root,'index.html')).href;
const sizes=[[375,667],[390,844],[430,932]];
const scenes=[['bathroom','open-bathroom','game-screen','bathroom-back','scene'],['breakfast','open-breakfast','breakfast-screen','breakfast-back','breakfast-scene'],['living','open-living','living-screen','living-back','living-scene'],['bedroom','open-bedroom','bedroom-screen','bedroom-back','bedroom-scene']];
const engines=[
  ['chromium',chromium,process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}],
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

async function inspectActionImages(page,engineName,width,height,variant,opening) {
  await page.evaluate(index=>{
    for(const action of ['put','get','bring','throw']) {
      const cards=[...document.querySelectorAll(`#action-screen .action-card[data-action="${action}"]`)];
      if(cards.length!==2) throw new Error(`${action}: expected two image variants`);
      cards.forEach((card,cardIndex)=>card.classList.toggle('queued',cardIndex!==index));
    }
  },variant);
  await page.waitForFunction(()=>[...document.querySelectorAll('#action-screen .action-card:not(.queued) img')].every(img=>img.complete && img.naturalWidth>0),null,{timeout:12000});
  const cards=await page.evaluate(()=>{
    const rect=element=>{ const r=element.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}; };
    const pseudo=(card,selector)=>{ const style=getComputedStyle(card,selector); return {content:style.content,width:style.width,height:style.height,left:style.left,top:style.top,position:style.position,pointerEvents:style.pointerEvents}; };
    return [...document.querySelectorAll('#action-screen .action-card:not(.queued)')].map(card=>{
      const img=card.querySelector('img');
      const image=rect(img),scale=Math.min(image.w/img.naturalWidth,image.h/img.naturalHeight),renderedWidth=img.naturalWidth*scale,renderedHeight=img.naturalHeight*scale;
      const imageStyle=getComputedStyle(img);
      return {name:img.getAttribute('src'),action:card.dataset.action,panels:Number(card.dataset.panels),legacyDivider:card.classList.contains('action-divider-blue'),card:rect(card),image,rendered:{x:image.x+(image.w-renderedWidth)/2,y:image.y+(image.h-renderedHeight)/2,w:renderedWidth,h:renderedHeight,right:image.x+(image.w+renderedWidth)/2,bottom:image.y+(image.h+renderedHeight)/2},imageStyle:{position:imageStyle.position,objectFit:imageStyle.objectFit},imageParentIsCard:img.parentElement===card,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,clientWidth:card.clientWidth,clientHeight:card.clientHeight,before:pseudo(card,'::before'),after:pseudo(card,'::after')};
    });
  });
  assert.equal(cards.length,4,`${engineName} ${width}×${height}: expected four visible Action Match cards`);
  const near=(a,b)=>Math.abs(a-b)<=1.5;
  const offset=(value,span)=>value.endsWith('%') ? Number.parseFloat(value)*span/100 : Number.parseFloat(value);
  for(const card of cards) {
    const label=`${engineName} ${width}×${height} ${card.name}, opening ${opening}`;
    assert(card.imageParentIsCard,`${label}: image must remain a direct child of its card`);
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
      assert.equal(card.before.content,'""',`${label}: one center badge is required for two panels`);
      assert.equal(card.after.content,'""',`${label}: badge triangle is missing`);
      assert.equal(Number.parseFloat(card.before.width),31,`${label}: badge width changed`);
      assert.equal(Number.parseFloat(card.before.height),31,`${label}: badge height changed`);
      assert.equal(card.before.position,'absolute',`${label}: badge participates in image layout`);
      assert.equal(card.before.pointerEvents,'none',`${label}: badge can intercept taps`);
      assert.equal(card.after.pointerEvents,'none',`${label}: triangle can intercept taps`);
      assert(near(offset(card.before.left,card.clientWidth),card.clientWidth/2) && near(offset(card.before.top,card.clientHeight),card.clientHeight/2),`${label}: badge is not centered on the two-panel boundary: ${JSON.stringify(card.before)}`);
      assert.equal(card.after.position,'absolute',`${label}: triangle participates in image layout`);
      assert.equal(Number.parseFloat(card.after.width),14,`${label}: triangle width changed`);
      assert.equal(Number.parseFloat(card.after.height),16,`${label}: triangle height changed`);
      assert(near(offset(card.after.left,card.clientWidth),card.clientWidth/2+2) && near(offset(card.after.top,card.clientHeight),card.clientHeight/2),`${label}: triangle is not centered on the two-panel boundary: ${JSON.stringify(card.after)}`);
    } else {
      assert.equal(card.panels,3,`${label}: unexpected panel count`);
      assert(!card.legacyDivider,`${label}: legacy divider duplicates the lines painted in the throw image`);
      assert(!(Number.parseFloat(card.before.width)===31 && Number.parseFloat(card.before.height)===31),`${label}: current non-equal throw image must not show a triangle`);
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
    assert.equal(hit,1,`${engineName} ${width}×${height} ${tap.name}: center triangle blocked the card tap`);
  }
  await page.screenshot({path:path.join(output,`${engineName}-${width}x${height}-action-variant${variant}-open${opening}.png`)});
  console.log(`PASS ${engineName} ${width}×${height} Action Match variant ${variant+1}: four loaded images, sizes, boundaries, and tap targets`);
  return cards;
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
      let current='startup';
      try {
        await page.goto(url,{waitUntil:'load'});
        const capture=async(id,kind)=>{ current=`${engineName} ${width}×${height} ${id}`; if(kind==='scene') await page.waitForFunction(screenId=>!document.querySelector(`#${screenId} section`)?.classList.contains('scene-loading'),id,{timeout:12000}); await inspect(page,id,kind,width,height); await page.screenshot({path:path.join(output,`${engineName}-${width}x${height}-${id}.png`)}); };
        await capture('home-screen','home');
        await page.locator('#open-word').click(); await capture('match-mode-screen','mode');
        await page.locator('#open-item-match').click(); await capture('word-screen','word');
        await page.locator('#word-home').click();
        await page.locator('#open-word').click(); await page.locator('#open-action-match').click(); await capture('action-screen','action');
        const panelCounts=await page.locator('#action-screen .action-card').evaluateAll(cards=>({two:cards.filter(card=>card.dataset.panels==='2').length,three:cards.filter(card=>card.dataset.panels==='3').length,total:cards.length}));
        assert.deepEqual(panelCounts,{two:6,three:2,total:8},`${engineName} ${width}×${height}: Action Match panel metadata must cover six two-panel and two throw images`);
        current=`${engineName} ${width}×${height} Action Match images, first opening`;
        const first=[];
        for(const variant of [0,1]) first.push(await inspectActionImages(page,engineName,width,height,variant,1));
        assert.equal(new Set(first.flat().map(card=>card.name)).size,8,`${current}: all eight Action Match images were not inspected`);
        await page.locator('#action-home').click();
        await page.locator('#open-word').click(); await page.locator('#open-action-match').click();
        current=`${engineName} ${width}×${height} Action Match images, second opening`;
        for(const variant of [0,1]) {
          const second=await inspectActionImages(page,engineName,width,height,variant,2);
          for(let i=0;i<second.length;i++) {
            assert.equal(second[i].name,first[variant][i].name,`${current}: image order changed`);
            for(const part of ['card','image']) for(const coordinate of ['x','y','w','h']) {
              assert(Math.abs(second[i][part][coordinate]-first[variant][i][part][coordinate])<=1.5,`${current}: ${second[i].name} ${part}.${coordinate} changed after reopening`);
            }
          }
        }
        await page.locator('#action-home').click(); await page.locator('#open-listen').click(); await capture('place-screen','place');
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
else console.log(`RESPONSIVE LAYOUT PASSED: ${completed} browser/size runs × 9 screens, all 8 Action Match images, and reopening. Screenshots: ${output}`);
