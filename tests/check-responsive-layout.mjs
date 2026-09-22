import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {checkIndexSyntax} from './check-index-syntax.mjs';

const root=path.resolve('.');
checkIndexSyntax(path.join(root,'index.html'));
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const output=path.join(root,'tests','artifacts','responsive');
fs.mkdirSync(output,{recursive:true});
const url=pathToFileURL(path.join(root,'index.html')).href;
const sizes=[[375,667],[390,844],[430,932]];
const scenes=[['bathroom','open-bathroom','game-screen','bathroom-back','scene'],['breakfast','open-breakfast','breakfast-screen','breakfast-back','breakfast-scene'],['living','open-living','living-screen','living-back','living-scene'],['bedroom','open-bedroom','bedroom-screen','bedroom-back','bedroom-scene']];
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
let failures=0;

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
    else if(kind==='action') {
      result.cards=visible('.action-card:not(.queued)');
      result.actionSequences=[...root.querySelectorAll('.action-card')].map(card=>{
        const art=card.querySelector('.action-art');
        const cuts=card.dataset.cuts ? card.dataset.cuts.split(',').map(Number) : Array.from({length:Number(card.dataset.panels)-1},(_,i)=>100*(i+1)/Number(card.dataset.panels));
        return {name:card.dataset.action,panels:Number(card.dataset.panels),cuts,visible:getComputedStyle(card).display!=='none',art:rect(art),markers:[...card.querySelectorAll('.action-sequence-arrow')].map(marker=>({rect:rect(marker),pointerEvents:getComputedStyle(marker).pointerEvents}))};
      });
    }
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
  if(kind==='action') {
    assert.equal(result.actionSequences.length,8,`${id}: expected 8 Action Match images`);
    for(const sequence of result.actionSequences) {
      assert.equal(sequence.markers.length,sequence.panels-1,`${id}: ${sequence.name} arrow count differs from panel count`);
      if(!sequence.visible) continue;
      assert(sequence.art.w>0 && sequence.art.h>0,`${id}: ${sequence.name} artwork is not sized`);
      assert(Math.abs(sequence.art.w/sequence.art.h-16/9)<0.02,`${id}: ${sequence.name} artwork ratio changed`);
      for(let i=0;i<sequence.markers.length;i++) {
        const marker=sequence.markers[i], expectedX=sequence.art.x+sequence.art.w*sequence.cuts[i]/100, expectedY=sequence.art.y+sequence.art.h/2;
        assert(marker.rect.w>=30 && marker.rect.h>=30,`${id}: ${sequence.name} arrow ${i+1} collapsed`);
        assert(Math.abs(marker.rect.x+marker.rect.w/2-expectedX)<1.5 && Math.abs(marker.rect.y+marker.rect.h/2-expectedY)<1.5,`${id}: ${sequence.name} arrow ${i+1} is off the artwork boundary`);
        assert.equal(marker.pointerEvents,'none',`${id}: ${sequence.name} arrow ${i+1} intercepts taps`);
      }
    }
  }
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

try {
  for(const [width,height] of sizes) {
    const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
    let current='startup';
    try {
      await page.goto(url,{waitUntil:'load'});
      const capture=async(id,kind)=>{ current=`${width}×${height} ${id}`; if(kind==='scene') await page.waitForFunction(screenId=>!document.querySelector(`#${screenId} section`)?.classList.contains('scene-loading'),id,{timeout:12000}); await inspect(page,id,kind,width,height); await page.screenshot({path:path.join(output,`${width}x${height}-${id}.png`)}); };
      await capture('home-screen','home');
      await page.locator('#open-word').click(); await capture('match-mode-screen','mode');
      await page.locator('#open-item-match').click(); await capture('word-screen','word');
      await page.locator('#word-home').click();
      await page.locator('#open-word').click(); await page.locator('#open-action-match').click(); await capture('action-screen','action');
      await page.locator('#action-home').click(); await page.locator('#open-listen').click(); await capture('place-screen','place');
      for(const [name,openId,screenId,backId] of scenes) {
        await page.locator(`#${openId}`).click(); await capture(screenId,'scene'); await page.locator(`#${backId}`).click();
      }
    } catch(error) {
      failures++;
      const file=path.join(output,`${width}x${height}-FAILED.png`);
      await page.screenshot({path:file}).catch(()=>{});
      console.error(`FAIL ${current}: ${error.stack || error}`);
      console.error(`Screenshot: ${file}`);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
if(failures) process.exitCode=1;
else console.log(`RESPONSIVE LAYOUT PASSED: 3 sizes × 9 screens. Screenshots: ${output}`);
