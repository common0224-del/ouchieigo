import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const html=fs.readFileSync(path.resolve('index.html'),'utf8');
const source=html.match(/const breakfastZones = (\{[^;]+\});/)?.[1];
assert(source,'Breakfast drop zones are missing');
const zones=vm.runInNewContext(`(${source})`);
assert.deepEqual(Array.from(zones.sink),[35,135,485,410]);
assert.deepEqual(Array.from(zones.girl),[735,220,1070,690]);
assert.deepEqual(Array.from(zones.table),[230,650,560,815]);
assert(/<svg viewBox="0 0 1086 1448" preserveAspectRatio="none"[^>]*>\s*<image href="breakfast-stage-v7\.jpg\.webp"/.test(html),
  'Breakfast must use its current background in the non-uniformly scaled SVG');
assert(fs.existsSync(path.resolve('breakfast-stage-v7.jpg.webp')));

const inside=([x,y],[left,top,right,bottom])=>x>=left&&x<=right&&y>=top&&y<=bottom;
const overlaps=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
for(const [name,zone] of Object.entries(zones)) {
  assert(zone[0]>=0&&zone[1]>=0&&zone[2]<=1086&&zone[3]<=1448,`${name} exceeds the SVG`);
  assert(zone[0]<zone[2]&&zone[1]<zone[3],`${name} has an empty zone`);
  for(const [other,otherZone] of Object.entries(zones)) {
    if(name<other) assert(!overlaps(zone,otherZone),`${name} overlaps ${other}`);
  }
}

// Horizontal edge samples come from the visible objects in the 900×1200 background,
// scaled into its 1086×1448 SVG viewBox. Neighboring bounding boxes meet diagonally,
// so their shared vertical fringe remains a small non-overlapping compromise.
const edgeSamples={
  plate:[[275,1000],[670,1000]],
  bowl:[[575,790],[860,790]],
  cup:[[820,1010],[1065,1010]],
};
for(const [target,points] of Object.entries(edgeSamples)) for(const point of points) {
  assert(inside(point,zones[target]),`${target} misses a visible left/right edge at ${point}`);
  for(const [other,zone] of Object.entries(zones)) {
    if(other!==target) assert(!inside(point,zone),`${target} edge is also accepted by ${other}`);
  }
}

for(const [width,height] of [[375,667],[390,844],[430,932]]) {
  const stageHeight=height-68-Math.min(142,Math.max(110,height*.17));
  for(const [target,points] of Object.entries(edgeSamples)) for(const [x,y] of points) {
    const clientX=x/1086*width,clientY=y/1448*stageHeight;
    const svgPoint=[clientX/width*1086,clientY/stageHeight*1448];
    assert(inside(svgPoint,zones[target]),`${width}×${height}: ${target} edge shifted by independent SVG scaling`);
  }
  console.log(`PASS Breakfast ${width}×${height}: plate/bowl/mug left and right edges remain in distinct zones`);
}
