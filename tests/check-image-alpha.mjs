import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
// The five opaque stage backgrounds are deliberately exempt. Every other
// root-level WebP is an illustration/sprite expected to have clear corners.
const opaqueStageImages=new Set([
  'bathroom-stage-v4.jpg.webp',
  'bathroom-stage-v5.jpg.webp',
  'breakfast-stage-v7.jpg.webp',
  'living-stage-v2.png.webp',
  'bedroom-stage-v2.png.webp',
]);
const allWebp=fs.readdirSync(root).filter(name=>name.endsWith('.webp'));
for(const name of opaqueStageImages) assert(allWebp.includes(name),`除外対象の背景画像が存在しません: ${name}`);
const published=allWebp.filter(name=>!opaqueStageImages.has(name));
const extra=process.argv.slice(2).map(file=>path.resolve(file));
const files=[...published.map(name=>path.join(root,name)),...extra];
assert.equal(allWebp.length,published.length+opaqueStageImages.size,'公開用WebPの分類に漏れがあります');
const arch=process.arch==='arm64'?'arm64':'x86-64';
const bundledDecoder=path.join(root,'.tools',`libwebp-1.4.0-mac-${arch}`,'bin','dwebp');
const decoder=fs.existsSync(bundledDecoder)?bundledDecoder:'dwebp';

// dwebp -pam exposes the decoded RGBA bytes without requiring a browser or Pillow.
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'ouchieigo-alpha-'));
let failed=0;
try {
  for(const [index,file] of files.entries()) {
    const pam=path.join(temporary,`${index}.pam`);
    try {
      execFileSync(decoder,['-quiet','-pam',file,'-o',pam],{stdio:'pipe'});
      const pixels=fs.readFileSync(pam);
      const end=pixels.indexOf(Buffer.from('ENDHDR\n'));
      assert(end>0,`PAMヘッダーを読めません: ${file}`);
      const header=pixels.subarray(0,end).toString('ascii');
      const width=Number(header.match(/\bWIDTH (\d+)/)?.[1]);
      const height=Number(header.match(/\bHEIGHT (\d+)/)?.[1]);
      assert(header.includes('DEPTH 4') && width>0 && height>0,'RGBA画像として復号できません');
      const dataOffset=end+'ENDHDR\n'.length;
      assert.equal(pixels.length-dataOffset,width*height*4,'画素データのサイズが不正です');
      const alphaAt=(x,y)=>pixels[dataOffset+(y*width+x)*4+3];
      const corners=[alphaAt(0,0),alphaAt(width-1,0),alphaAt(0,height-1),alphaAt(width-1,height-1)];
      let transparent=0;
      for(let i=dataOffset+3;i<pixels.length;i+=4) if(pixels[i]<=8) transparent++;
      // Lossy WebP may make an otherwise clear corner alpha=1, so permit <=8.
      assert(corners.every(value=>value<=8),`四隅のアルファ値 ${JSON.stringify(corners)}（8以下が必要）`);
      assert(transparent>=width*height*0.01,`透明部分 ${transparent}/${width*height}（1%以上が必要）`);
      console.log(`PASS 透過 ${path.basename(file)}: ${width}×${height}, 四隅 ${corners.join('/')}`);
    } catch(error) {
      failed++;
      console.error(`FAIL 透過 ${file}: ${error.message}`);
    } finally { if(fs.existsSync(pam)) fs.unlinkSync(pam); }
  }
} finally { fs.rmdirSync(temporary); }
if(failed) process.exitCode=1;
else console.log(`IMAGE ALPHA PASSED: 透過 ${published.length} 枚、背景除外 ${opaqueStageImages.size} 枚${extra.length?` + 候補 ${extra.length} 枚`:''}`);
