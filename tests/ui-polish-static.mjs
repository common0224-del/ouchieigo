import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const html=fs.readFileSync(path.resolve(import.meta.dirname,'../index.html'),'utf8');
const houseAsset='word-item-house-v2.png.webp';
assert(fs.existsSync(path.resolve(import.meta.dirname,'..',houseAsset)),'Shared House artwork is missing');
for(const id of ['home','breakfast-home','living-home','bedroom-home','shopping-home','match-mode-home','word-home','action-home','think-proto-home']) {
  assert.match(html,new RegExp(`<button[^>]+id="${id}"[^>]*><img class="home-icon" src="${houseAsset.replaceAll('.','\\.')}" alt="" aria-hidden="true"></button>`),`${id} must use the shared house illustration`);
}
assert.doesNotMatch(html,/home-icon-art|word-item-house-v1\.png\.webp/,'Older House artwork must not remain in the app');
assert.doesNotMatch(html,/🏠/,'No home button should retain the old emoji');
for(const id of ['home','breakfast-home','living-home','bedroom-home','shopping-home','match-mode-home','word-home','action-home'])
  assert.match(html,new RegExp(`document\\.querySelector\\('#${id}'\\)\\.addEventListener\\('click',\\s*returnHome\\)`),`${id} must retain its home destination`);
assert.match(html,/\$\('proto-home'\)\.addEventListener\('click', returnHome\)/,'Think & Say must retain its home destination');
const resetIds=['reset','breakfast-reset','living-reset','bedroom-reset','shopping-reset','word-reset'];
const resetRule=html.match(/    (\.app > header #reset::after[^\n]+)\n/)?.[1];
assert(resetRule,'Shared reset-arrow rule is missing');
for(const id of resetIds) {
  assert(resetRule.includes(`#${id}::after`),`${id} must share the same arrow alignment`);
  assert.match(html,new RegExp(`<button class="round[^"]*" id="${id}" type="button" aria-label="リセット">↻</button>`),`${id} button and its tap area must remain unchanged`);
}
assert.match(resetRule,/content:"↻"; font-size:21px; display:block; line-height:1; transform:translate\(0,-1px\);/,'Reset arrow must be visually centered');
assert.doesNotMatch(html,/\.app > header #shopping-reset::after \{/,'Shopping must not have a separate reset-arrow rule');
const gameIds=['game-screen','breakfast-screen','living-screen','bedroom-screen','shopping-screen','word-screen','action-screen','think-screen'];
const gameSelector=`:is(${gameIds.map(id=>`#${id}`).join(',')})`;
const gameSelectionRule=html.match(/    (:is\(#[^\n]+\)),\n    (:is\(#[^\n]+\)) \* \{ ([^}]+) \}/);
assert(gameSelectionRule,'Game-wide long-press protection is missing');
assert.equal(gameSelectionRule[1],gameSelector,'All eight game screens must be protected');
assert.equal(gameSelectionRule[2],gameSelector,'Descendants, including buttons, labels, and slots, must be protected');
for(const declaration of ['-webkit-user-select:none;','user-select:none;','-webkit-touch-callout:none;','-webkit-tap-highlight-color:transparent;'])
  assert(gameSelectionRule[3].includes(declaration),`Missing game-wide ${declaration}`);
assert(html.includes(`${gameSelector} :is(img,image) { -webkit-user-drag:none; }`),'Game images and SVG images must resist native dragging');
const staticImages=html.match(/document\.querySelectorAll\('([^']+)'\)\.forEach\(img => \{ img\.draggable=false; \}\);/)?.[1];
assert.equal(staticImages,gameIds.map(id=>`#${id} img`).join(', '),'Static images in every game screen must disable native dragging');
assert.match(html,/leftImage\.draggable = false;/,'Dynamic Think & Say left image must disable native dragging');
assert.match(html,/rightImage\.draggable = false;/,'Dynamic Think & Say right image must disable native dragging');

const labelIds=['rack','boy','basket'];
const labelWidths={rack:78,boy:55,basket:108};
const labelStyles=Object.fromEntries(labelIds.map(id=>{
  const rule=html.match(new RegExp(`#label-${id} \\{([^}]+)\\}`))?.[1];
  assert(rule,`Bathroom ${id} label is missing`);
  const left=Number(rule.match(/left:([\d.]+)%/)?.[1]);
  const top=Number(rule.match(/top:([\d.]+)%/)?.[1]);
  assert(Number.isFinite(left) && Number.isFinite(top));
  return [id,{left,top,centered:rule.includes('translateX(-50%)')}];
}));
const overlaps=(a,b)=>a.left<b.right && b.left<a.right && a.top<b.bottom && b.top<a.bottom;
for(const [width,height] of [[375,667],[390,844],[430,932]]) {
  const sceneHeight=height-68;
  const trayHeight=Math.min(142,Math.max(110,height*.17));
  const imageHeight=sceneHeight-trayHeight;
  const rects=Object.fromEntries(labelIds.map(id=>{
    const {left,top,centered}=labelStyles[id];
    const x=left/100*width-(centered?labelWidths[id]/2:0);
    const y=top/100*sceneHeight;
    const rect={left:x,top:y,right:x+labelWidths[id],bottom:y+30};
    assert(rect.left>=0 && rect.right<=width && rect.top>=0 && rect.bottom<imageHeight-35,`${width}×${height}: ${id} label outside the safe image area`);
    return [id,rect];
  }));
  assert(rects.rack.top/imageHeight>.09 && rects.rack.top/imageHeight<.16,'Towel rack label must sit over the towel center');
  assert(rects.boy.top/imageHeight>.45 && rects.boy.top/imageHeight<.53,'Boy label must sit on the abdomen, not the face');
  assert(rects.basket.top/imageHeight>.66 && rects.basket.top/imageHeight<.72,'Laundry basket label must sit along the bottom of the basket');
  for(const [i,id] of labelIds.entries()) for(const other of labelIds.slice(i+1))
    assert(!overlaps(rects[id],rects[other]),`${width}×${height}: ${id} overlaps ${other}`);
  console.log(`PASS Bathroom static ${width}×${height}: labels remain in the scene, separated, and aligned to their subjects`);
}
console.log('PASS shared home illustration, scoped reset centering, and native drag/selection suppression');
