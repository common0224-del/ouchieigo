import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const image='bedroom-stage-v4a.png.webp';
assert(fs.existsSync(path.join(root,image)),`Bedroom background is missing: ${image}`);
assert(fs.existsSync(path.join(root,'bedroom-stage-v3.png.webp')),'The previous Bedroom background must be retained');
assert.match(html,new RegExp(`<section class="living-scene" id="bedroom-scene"[\\s\\S]*?<image href="${image.replaceAll('.','\\.')}"`));
assert(html.includes(".place-card.place-bedroom .place-illustration { background-image:linear-gradient(") && html.includes("url('bedroom-stage-v2.png.webp')"),'The place-selection image must remain unchanged');
assert.match(html,/#bedroom-label-layer \{[^}]*height:calc\(100% - var\(--tray-height\) - env\(safe-area-inset-bottom\)\)/);

const zoneLiteral=html.match(/bedroomZones=(\{[^;]+?\}), bedroomItemNames=/)?.[1];
assert(zoneLiteral,'Bedroom drop zones are missing');
const zones=vm.runInNewContext(`(${zoneLiteral})`);
const ids=['bookshelf','bed','dad','drawer','night-table','boy','basket'];
assert.deepEqual(Object.keys(zones),ids);
const intersects=(a,b)=>Math.min(a.right,b.right)>Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);
const labelWidths={bookshelf:68,bed:44,dad:40,drawer:58,'night-table':100,boy:44,basket:104};
const labelStyle=Object.fromEntries(ids.map(id=>{
  const declarations=html.match(new RegExp(`#bedroom-label-${id} \\{([^}]+)\\}`))?.[1];
  assert(declarations,`Missing Bedroom label CSS for ${id}`);
  const left=Number(declarations.match(/left:([\d.]+)%/)?.[1]);
  const top=Number(declarations.match(/top:(?:calc\()?([\d.]+)%/)?.[1]);
  const offset=Number(declarations.match(/top:calc\([\d.]+% - ([\d.]+)px\)/)?.[1] || 0);
  assert(Number.isFinite(left) && Number.isFinite(top),`Invalid Bedroom label position for ${id}`);
  return [id,{left,top,offset,centered:declarations.includes('translate(-50%,-100%)')}];
}));

for(const [width,height] of [[375,667],[390,844],[430,932]]) {
  const svgHeight=height-68-Math.min(142,Math.max(110,height*.17));
  const scaledZones=Object.fromEntries(ids.map(id=>{
    const [x1,y1,x2,y2]=zones[id];
    assert(x1>=0 && y1>=0 && x2<=1086 && y2<=1448 && x1<x2 && y1<y2,`Invalid ${id} drop zone`);
    const rect={left:x1/1086*width,top:y1/1448*svgHeight,right:x2/1086*width,bottom:y2/1448*svgHeight};
    assert(rect.right-rect.left>=48 && rect.bottom-rect.top>=48,`${width}×${height}: ${id} drop zone is under 48px`);
    return [id,rect];
  }));
  for(const [i,id] of ids.entries()) for(const other of ids.slice(i+1))
    assert(!intersects(scaledZones[id],scaledZones[other]),`${width}×${height}: ${id} overlaps ${other} drop zone`);

  for(const hintLines of [1,2]) {
    const labelHeight=hintLines===1?18:30;
    const labels=Object.fromEntries(ids.map(id=>{
      const style=labelStyle[id],labelWidth=labelWidths[id];
      let left=style.left/100*width,top=style.top/100*svgHeight-style.offset;
      if(style.centered) { left-=labelWidth/2; top-=labelHeight; }
      const rect={left,top,right:left+labelWidth,bottom:top+labelHeight};
      assert(rect.left>=0 && rect.top>=0 && rect.right<=width && rect.bottom<=svgHeight-70,`${width}×${height}: ${id} label leaves the safe image area`);
      return [id,rect];
    }));
    for(const [i,id] of ids.entries()) for(const other of ids.slice(i+1))
      assert(!intersects(labels[id],labels[other]),`${width}×${height}: ${id} overlaps ${other} in ${hintLines}-line static estimate`);
    const dadHair=.125*svgHeight;
    assert(dadHair-labels.dad.bottom>=7 && dadHair-labels.dad.bottom<=9,`${width}×${height}: Dad label is too far from his head`);
    assert(labels.boy.top>=.55*svgHeight && labels.boy.top<=.57*svgHeight,`${width}×${height}: Boy label is not on his torso`);
    assert(labels.boy.top>.52*svgHeight,`${width}×${height}: Boy label covers his face`);
    assert(labels.bed.top>=.20*svgHeight && labels.bed.top<=.22*svgHeight,`${width}×${height}: Bed label is not above the pillow`);
    assert(labels['night-table'].top>=.15*svgHeight && labels['night-table'].top<=.17*svgHeight,`${width}×${height}: Night table label is not above the table`);
    const number5={left:(780-32-27)/1086*width,right:(780-32+27)/1086*width,top:(340+32-27)/1448*svgHeight,bottom:(340+32+27)/1448*svgHeight};
    assert(!intersects(labels['night-table'],number5),`${width}×${height}: Night table label overlaps number 5`);
    assert(labels.drawer.top>=.35*svgHeight && labels.drawer.top<=.37*svgHeight,`${width}×${height}: Drawer label is not on its upper part`);
    assert(labels.basket.top>=.68*svgHeight && labels.basket.top<=.70*svgHeight,`${width}×${height}: Basket label is not on its lower front`);
  }
  console.log(`PASS Bedroom static ${width}×${height}: seven non-overlapping drop zones ≥48px; label estimates clear in both hint states`);
}
