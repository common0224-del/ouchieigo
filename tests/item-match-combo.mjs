import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const html=fs.readFileSync(path.resolve(import.meta.dirname,'../index.html'),'utf8');
const source=name=>{
  const line=html.match(new RegExp(`^      function ${name}\\([^\\n]+$`,'m'))?.[0];
  assert(line,`Missing ${name}`);
  return line;
};
const listener=html.match(/^      document\.querySelectorAll\('\.word-card'\)\.forEach\(card=>card\.addEventListener\('click',[^\n]+$/m)?.[0];
assert(listener,'Missing Item Match card listener');
assert.match(html,/let wordCombo=0, wordComboTimer=0;/);
assert.match(html,/<div class="word-info-row"><div class="word-caption"[^>]*><span class="word-caption-content">[^<]*<span id="word-caption-english"><\/span><span class="word-jp" id="word-caption-jp"><\/span><\/span><\/div><div class="word-combo" aria-live="polite"><span class="word-combo-content"><span class="word-combo-count" id="word-combo-count">0<\/span><span class="word-combo-label">COMBO!<\/span><\/span><\/div><\/div>/);
assert.doesNotMatch(html,/id="word-combo-burst"/,'the separate popup must be removed');
assert.match(source('wordWrongFeedback'),/resetWordCombo\(\); wrongSound\(\)/);
assert.match(source('resetWord'),/clearWordComboAnimation\(\)/);
assert.doesNotMatch(source('resetWord'),/resetWordCombo\(\)/,'Play Again must preserve the streak');
assert.doesNotMatch(source('finishWord'),/resetWordCombo\(\)/,'completion must preserve the streak');
assert.match(source('returnHome'),/resetWordCombo\(\)/);
assert.match(source('closeMatchMode'),/resetWordCombo\(\)/);
assert.doesNotMatch(source('closeWord'),/resetWordCombo\(\)/,'back to game selection is not Home');
assert.match(html,/#word-home'\)\.addEventListener\('click', returnHome\)/);
assert.match(html,/#word-back'\)\.addEventListener\('click', closeWord\)/);
assert.match(html,/#word-play-again'\)\.addEventListener\('click',[^\n]+resetWord\(\)/);

const makeClassList=()=>{
  const names=new Set();
  return {add:name=>names.add(name),remove:(...values)=>values.forEach(value=>names.delete(value)),contains:name=>names.has(name),toggle:(name,on)=>on ? names.add(name) : names.delete(name)};
};
const cards=Array.from({length:3},(_,i)=>({dataset:{word:`item-${i}`},classList:makeClassList(),addEventListener(type,handler){ assert.equal(type,'click'); this.click=handler; }}));
const count={classList:makeClassList(),textContent:'0',offsetWidth:40};
const finish={classList:makeClassList()};
const timers=new Map();
let nextTimer=1, correctCalls=0, wrongCalls=0, finishCalls=0;
const context={
  document:{querySelectorAll:selector=>selector==='.word-card' ? cards : []},
  wordComboCount:count,wordFinish:finish,wordBoard:{append(){}},
  setTimeout:(callback,delay)=>{ const id=nextTimer++; timers.set(id,{callback,delay}); return id; },
  clearTimeout:id=>timers.delete(id),
  unlockAudio(){},correctSound(){ correctCalls++; },wrongSound(){ wrongCalls++; },finishSound(){ finishCalls++; },
  stopSpeech(){},speakWord(){},updateWordCaption(){},fitWordInfoText(){},
  chooseWordCards:items=>new Set(items)
};
vm.createContext(context);
vm.runInContext(`let wordCombo=0, wordComboTimer=0, wordCurrent=null;\n${[
  'clearWordComboAnimation','updateWordCombo','advanceWordCombo','resetWordCombo',
  'wordWrongFeedback','resetWord','finishWord'
].map(source).join('\n')}\nfunction selectWord() { wordCurrent=cards[0]; }\n${listener}\nthis.setCurrent=card=>{ wordCurrent=card; }; this.getCombo=()=>wordCombo;`,Object.assign(context,{cards}));

context.setCurrent(cards[0]);
cards[0].click();
assert.equal(context.getCombo(),1);
assert.equal(count.textContent,'1');
assert(count.classList.contains('bump'));
assert([...timers.values()].some(timer=>timer.delay===400),'number bump must last about 0.4 seconds');
cards[0].click();
assert.equal(context.getCombo(),1,'repeated tap on matched card must not add again');
assert.equal(correctCalls,1);

context.setCurrent(cards[1]);
cards[1].click();
assert.equal(context.getCombo(),2);
assert.equal(count.textContent,'2');
assert.equal([...timers.values()].filter(timer=>timer.delay===400).length,1,'previous animation timer must be cleared');
context.finishWord();
assert(finish.classList.contains('show'));
assert.equal(context.getCombo(),2,'completion must not clear combo');
assert.equal(finishCalls,1);
context.resetWord(false);
assert(!finish.classList.contains('show'));
assert.equal(context.getCombo(),2,'Play Again must keep combo');
assert(!count.classList.contains('bump'),'stale animation must not linger into next round');
context.setCurrent(cards[2]);
cards[2].click();
assert.equal(context.getCombo(),3);
cards[0].click();
assert.equal(context.getCombo(),0,'wrong choice must reset combo');
assert.equal(wrongCalls,1);
assert.equal(count.textContent,'0');
assert(!count.classList.contains('bump'));
context.resetWord(false);
context.setCurrent(cards[0]);
cards[0].click();
assert.equal(context.getCombo(),1,'a new streak starts after the wrong answer');
context.resetWordCombo();
assert.equal(context.getCombo(),0,'home reset clears the streak');
assert.equal(count.textContent,'0');

const comboStyle=html.match(/\.word-combo \{([^}]+)\}/)?.[1];
const captionStyle=html.match(/\.word-caption \{([^}]+)\}/)?.[1];
const rowStyle=html.match(/\.word-info-row \{([^}]+)\}/)?.[1];
assert(comboStyle && captionStyle && rowStyle,'side-by-side combo and caption layout must exist');
assert.match(rowStyle,/top:0; right:16px; left:16px; height:var\(--word-card-top-gap\); display:grid; grid-template-columns:minmax\(0,7fr\) minmax\(0,3fr\)/);
assert.match(rowStyle,/z-index:6;/,'hint and combo must remain in front of the first cards');
assert.match(rowStyle,/overflow:hidden;/,'text and its shadow must be clipped before the first cards');
assert.match(rowStyle,/pointer-events:none;/,'the display row must not block card taps');
assert.match(captionStyle,/grid-column:1; box-sizing:border-box; min-width:0; height:40px; display:none; align-items:center; justify-content:center; overflow:hidden/);
assert.match(captionStyle,/padding:0 9px; border:2px solid #fff9e8; border-radius:13px; background:linear-gradient\(145deg,#fffdf4,#f9ecd8\); box-shadow:/,'hint must be a cream card with padding, rounded border, and shadow');
assert.match(html,/\.word-caption-content \{ display:inline-flex; align-items:baseline; gap:5px;/,'English and Japanese must share one horizontal line');
assert.match(comboStyle,/grid-column:2; min-width:0; height:40px; display:flex; align-items:center; justify-content:center; overflow:hidden/);
assert.match(html,/\.text-english \.word-caption, \.text-bilingual \.word-caption \{ display:flex; \}/,'Japanese-only and bilingual hints must keep the three-step cycle');
assert.match(html,/\.text-english \.word-caption #word-caption-english \{ display:none; \}/,'stage 1 must show Japanese without English');
assert.match(source('applyTextDisplay'),/updateWordCaption\(\)/,'text-state changes must also update the hint card');
assert.match(source('cycleTextDisplay'),/textDisplayStep=\(textDisplayStep\+1\)%3; applyTextDisplay\(\)/,'OFF → Japanese → bilingual → OFF must keep cycling');
assert.match(html,/\.word-combo-count \{[^}]*font-size:30px/);
assert.match(html,/\.word-combo-label \{[^}]*font-size:12px/);
assert.match(html,/\.word-caption \.word-jp \{ display:inline/,'bilingual hint must remain visible beside English');
assert.match(html,/\.word-board \{ --word-card-top-gap:55px;[^}]*padding:var\(--word-card-top-gap\) 16px 18px/,'card area must keep its 55px top gap');
assert.match(html,/function fitWordInfoText\(\) \{/);
assert.match(html,/captionContent\.offsetWidth/,'caption must fit its measured text width');
assert.match(html,/caption\.clientWidth-parseFloat\(style\.paddingLeft\)-parseFloat\(style\.paddingRight\)-4/,'hint fitting must reserve the new card padding');
assert.match(html,/comboContent\.offsetWidth\+wordComboCount\.offsetWidth\*\.18/,'combo sizing must reserve the number bump width');
assert.match(source('updateWordCombo'),/fitWordInfoText\(\)/,'combo width must be remeasured after count changes');
assert.match(source('updateWordCaption'),/fitWordInfoText\(\)/,'caption width must be remeasured after text changes');
const fitCode=html.match(/^      function fitWordInfoText\(\) \{[\s\S]*?^      \}/m)?.[0];
assert(fitCode,'measured-width fitting function is missing');
for(const [width,height] of [[375,667],[390,844],[430,932]]) {
  const innerWidth=width-32-8;
  assert(innerWidth*.7>innerWidth*.3,`${width}x${height}: caption is not the wider region`);
  const firstCardTop=55,rowTop=0,rowHeight=55,textBoxHeight=40;
  const verticalMargin=(rowHeight-textBoxHeight)/2;
  assert.equal(rowTop+rowHeight,firstCardTop,`${width}x${height}: display row must end at the first-card top edge`);
  assert(verticalMargin>=7,`${width}x${height}: text box is too close to the header or first cards`);
  for(const value of [1,9,99,999,9999]) {
    const captionContent={style:{transform:''},offsetWidth:260};
    const comboContent={style:{transform:''},get offsetWidth(){ return comboCount.offsetWidth+comboLabel.offsetWidth+3; }};
    const comboCount={textContent:String(value),style:{fontSize:'30px'},get offsetWidth(){ return this.textContent.length*Number.parseFloat(this.style.fontSize)*.6; }};
    const comboLabel={offsetWidth:48};
    const caption={clientWidth:innerWidth*.7,querySelector:()=>captionContent};
    const combo={clientWidth:innerWidth*.3,querySelector:selector=>selector==='.word-combo-content' ? comboContent : comboLabel};
    const wordBoard={querySelector:selector=>selector==='.word-caption' ? caption : combo};
    vm.runInNewContext(`${fitCode}\nfitWordInfoText();`,{wordBoard,wordComboCount:comboCount,getComputedStyle:()=>({paddingLeft:'9px',paddingRight:'9px'})});
    const scale=style=>Number.parseFloat(style.transform.match(/scale\(([^)]+)\)/)?.[1]);
    assert(captionContent.offsetWidth*scale(captionContent.style)<=caption.clientWidth-18-3.9,`${width}x${height}: longest hint enters the card padding`);
    assert((comboContent.offsetWidth+comboCount.offsetWidth*.18)*scale(comboContent.style)<=combo.clientWidth-3.9,`${width}x${height}: ${value} COMBO! or its bump is clipped`);
    if(value===1) assert.equal(comboCount.style.fontSize,'30px',`${width}x${height}: one-digit count became smaller`);
  }
}
assert.match(html,/\.word-combo-count\.bump \{ animation:word-combo-bump \.4s/);
assert.match(html,/@media \(prefers-reduced-motion:reduce\) \{ \.word-combo-count\.bump/);
console.log('PASS Item Match combo: state continuity, 70:30 measured-width display, centered top-gap row, 3 static viewport bounds');
