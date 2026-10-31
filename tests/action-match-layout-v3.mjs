import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const versions={'push-boy':'v5','push-girl':'v3','pull-boy':'v5','pull-girl':'v3','give-boy':'v3','give-girl':'v5','eat-boy':'v3','eat-girl':'v3'};
assert.match(html,/\.action-card img \{[^}]*width:100%; height:100%; object-fit:contain;/,
  'Action Match images must retain the contain layout');
assert.match(html,/\.action-card\[data-panels="2"\]::before, \.action-card\[data-panels="2"\]::after \{[^}]*width:18px; height:22px;/,
  'The center arrow dimensions changed');
assert.match(html,/\.action-card\[data-panels="2"\]::before \{ left:calc\(50% - 10px\); \}/);
assert.match(html,/\.action-card\[data-panels="2"\]::after \{ left:calc\(50% \+ 10px\); \}/);
for(const [name,version] of Object.entries(versions)) {
  const image=`action-${name}-layout-${version}.webp`;
  assert(html.includes(`img[src="${image}"] { --action-image-scale:1.00; --action-image-y:0%; }`),
    `${image}: CSS scale or position changed`);
  assert(html.includes(`<img src="${image}" alt="">`),`${image}: card image reference is missing`);
}

const arch=process.arch==='arm64'?'arm64':'x86-64';
const bundled=path.join(root,'.tools',`libwebp-1.4.0-mac-${arch}`,'bin','dwebp');
const decoder=fs.existsSync(bundled)?bundled:'dwebp';
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'action-layout-final-'));
try {
  for(const [index,[name,version]] of Object.entries(versions).entries()) {
    const publicPath=path.join(root,`action-${name}-layout-${version}.webp`);
    const privatePath=path.join(root,'private-prototypes',`action-match-${name}-layout-${version}.webp`);
    assert(fs.existsSync(privatePath),`${name}: private approved original is missing`);
    assert.deepEqual(fs.readFileSync(publicPath),fs.readFileSync(privatePath),
      `${name}: public image was altered during copy`);
    const pam=path.join(temporary,`${index}.pam`);
    execFileSync(decoder,['-quiet','-pam',publicPath,'-o',pam],{stdio:'pipe'});
    const bytes=fs.readFileSync(pam);
    const end=bytes.indexOf(Buffer.from('ENDHDR\n'));
    assert(end>0,`${name}: cannot decode PAM header`);
    const header=bytes.subarray(0,end).toString('ascii');
    assert.match(header,/DEPTH 4/);
    assert.match(header,/WIDTH 800/);
    assert.match(header,/HEIGHT 450/);
    const offset=end+'ENDHDR\n'.length;
    assert.equal(bytes.length-offset,800*450*4);
    const alpha=(x,y)=>bytes[offset+(y*800+x)*4+3];
    for(let y=0;y<450;y++) {
      assert(alpha(0,y)<=8 && alpha(799,y)<=8,`${name}: art clips the left or right edge at y=${y}`);
      if(version==='v3') for(let x=325;x<475;x++) assert(alpha(x,y)<=8,`${name}: v3 center is not transparent at ${x},${y}`);
    }
    // At 350x133 CSS px, object-fit:contain and 1.00/0% framing put the
    // two 18x22px arrows inside this conservative source-image rectangle.
    // v5 need not preserve the former full-height transparent center band.
    if(version==='v5') {
      let overlap=0;
      for(let y=187;y<=263;y++) for(let x=333;x<=467;x++) if(alpha(x,y)>8) overlap++;
      if(name==='give-girl') assert(overlap<=700,`${name}: arrow-area overlap exceeds approved outline contact (${overlap})`);
      else assert(overlap<=32,`${name}: art enters the arrow area (${overlap})`);
    }
  }
} finally { fs.rmSync(temporary,{recursive:true,force:true}); }
console.log('PASS Action Match final layout: 8 exact copies, 800×450 alpha, edge clearance and CSS arrow area');
