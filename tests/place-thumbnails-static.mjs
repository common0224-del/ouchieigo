import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
assert(css,'App CSS is missing');
assert.match(css,/\.place-illustration \{[^}]*inset:0 0 0 50%;[^}]*background-size:100% 100%,auto 250%;[^}]*background-repeat:no-repeat;/);
assert.match(css,/\.place-copy \{[^}]*width:63%;[^}]*min-height:136px;/);
assert.match(css,/\.place-card \{[^}]*min-height:136px;[^}]*border-radius:25px;/);
assert.match(css,/@media \(max-height:700px\) \{[\s\S]*?\.place-card, \.place-copy \{ min-height:118px; \}/);

// Face bounds and scene landmarks are approximate coordinates in the existing 900x1200 artwork.
// This is a crop-geometry check, not a replacement for visual review on a device.
const scenes=[
  {id:'bathroom',selector:'.place-illustration',image:'bathroom-stage-v4.jpg.webp',x:100,y:25,zoom:250,face:[670,315,875,495],cue:[500,300]},
  {id:'breakfast',selector:'.place-card.place-breakfast .place-illustration',image:'breakfast-stage-v7.jpg.webp',x:100,y:22,zoom:280,face:[650,275,845,455],cue:[600,535]},
  {id:'living',selector:'.place-card.place-living .place-illustration',image:'living-stage-v2.png.webp',x:100,y:10,zoom:360,face:[708,143,845,285],cue:[600,330]},
  {id:'bedroom',selector:'.place-card.place-bedroom .place-illustration',image:'bedroom-stage-v4a.png.webp',x:86,y:48,zoom:320,face:[625,455,780,620],cue:[500,500]},
  {id:'entrance',selector:'.place-card.place-entrance .place-illustration',image:'entrance-stage-v1e.png.webp',x:100,y:33,zoom:260,face:[695,305,830,505],cue:[550,420]},
  {id:'shopping',selector:'.place-card.place-shopping .place-illustration',image:'shopping-scene-bg-v2a.png.webp',x:25,y:30,zoom:285,face:[365,305,525,475],cue:[180,500]},
];

for(const scene of scenes) {
  assert(fs.existsSync(path.join(root,scene.image)),`${scene.id}: thumbnail source is missing`);
  const rule=css.match(new RegExp(`${scene.selector.replaceAll('.','\\.')} \\{([^}]+)\\}`))?.[1];
  assert(rule,`${scene.id}: thumbnail CSS is missing`);
  assert(rule.includes(`url('${scene.image}')`),`${scene.id}: wrong image`);
  assert(rule.includes(`background-position:center,${scene.x}% ${scene.y}%;`),`${scene.id}: wrong crop position`);
  assert(rule.includes(`background-size:100% 100%,auto ${scene.zoom}%;`),`${scene.id}: wrong crop size`);
  assert.match(html,new RegExp(`<button class="place-card(?: place-${scene.id})?" id="open-${scene.id}"[^>]*>[\\s\\S]*?<div class="place-illustration" aria-hidden="true"></div>`),`${scene.id}: place-card structure changed`);
}

for(const [viewportWidth,viewportHeight] of [[375,667],[390,844],[430,932]]) {
  const cardWidth=viewportWidth-34;
  const cardHeight=viewportHeight<=700?118:136;
  const panelWidth=cardWidth/2;
  for(const scene of scenes) {
    const imageHeight=cardHeight*scene.zoom/100;
    const imageWidth=imageHeight*900/1200;
    const offsetX=(panelWidth-imageWidth)*scene.x/100;
    const offsetY=(cardHeight-imageHeight)*scene.y/100;
    const toX=x=>offsetX+x/900*imageWidth;
    const toY=y=>offsetY+y/1200*imageHeight;
    const [left,top,right,bottom]=scene.face;
    assert(toX(left)>panelWidth*.35 && toX(right)<panelWidth,`${scene.id} ${viewportWidth}x${viewportHeight}: face leaves the visible right side`);
    assert(toY(top)>=0 && toY(bottom)<=cardHeight,`${scene.id} ${viewportWidth}x${viewportHeight}: face is vertically cropped`);
    const faceHeightRatio=(bottom-top)/1200*imageHeight/cardHeight;
    assert(faceHeightRatio>=.35 && faceHeightRatio<=.45,`${scene.id} ${viewportWidth}x${viewportHeight}: face size is outside the intended range`);
    assert(toX(scene.cue[0])>=0 && toX(scene.cue[0])<=panelWidth && toY(scene.cue[1])>=0 && toY(scene.cue[1])<=cardHeight,`${scene.id} ${viewportWidth}x${viewportHeight}: scene cue is cropped out`);
  }
  console.log(`PASS place thumbnails ${viewportWidth}x${viewportHeight}: six faces and scene cues fit their right panels`);
}
