import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import './action-match-layout-v3.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const board=source.match(/<section class="action-board"[^>]*>([\s\S]*?)<div class="breakfast-finish"/)?.[1];
assert(board,'Action Match card board is missing');
assert.match(source,/#action-screen \.action-labels \{[^}]*top:0;/,'Action Match hints must be anchored at the top');
assert.match(source,/#action-screen \.action-labels \{[^}]*height:20px;/,'Action Match top hint band must leave room for faces');
assert.match(source,/#action-screen \.action-card img \{ transform:translateY\(var\(--action-image-y,0%\)\) scale\(var\(--action-image-scale,1\)\); transform-origin:center; \}/,'Action Match must use a shared, centered image framing rule');
assert.doesNotMatch(source,/#action-screen \.action-card:is\([^}]*\.action-labels \{[^}]*bottom:0;/,'No Action Match card may move its hint band to the bottom');

// Keep the approved per-image zoom map explicit and independent of private prototypes.
const approvedFraming=`
action-put-boy-v5.png.webp 1.16 1%
action-put-girl-v5.png.webp 1.18 2%
action-get-boy-v4.png.webp 1.08 2%
action-get-girl-v4.png.webp 1.08 2%
action-throw-boy-v3.png.webp 1.12 1%
action-throw-girl-v5.png.webp 1.12 1%
action-put-on-boy-v3b.png.webp 1.08 11%
action-put-on-girl-v3a.png.webp 1.05 0%
action-take-off-boy-v1b.png.webp 1.10 7%
action-take-off-girl-v3a.png.webp 1.05 0%
action-open-boy-v1b.png.webp 1.12 2%
action-open-girl-v2a.png.webp 1.00 0%
action-close-boy-v1a.png.webp 1.12 2%
action-close-girl-v1a.png.webp 1.00 0%
action-pick-up-boy-v1a.png.webp 1.08 0%
action-pick-up-girl-v1b.png.webp 1.05 0%
action-turn-on-boy-tv-v1.webp 1.12 0%
action-turn-on-girl-ac-v1.webp 1.06 10%
action-turn-off-boy-light-v2.webp 1.05 24px
action-turn-off-girl-game-v1.webp 1.00 0%
action-take-out-boy-toy-v1.webp 1.10 1%
action-take-out-girl-milk-v1.webp 1.08 2%
action-put-away-boy-book-v2.webp 1.10 2%
action-put-away-girl-toy-v1.webp 1.03 0%
action-push-boy-layout-v5.webp 1.00 0%
action-push-girl-layout-v3.webp 1.00 0%
action-pull-boy-layout-v5.webp 1.00 0%
action-pull-girl-layout-v3.webp 1.00 0%
action-give-boy-layout-v3.webp 1.00 0%
action-give-girl-layout-v5.webp 1.00 0%
action-eat-boy-layout-v3.webp 1.00 0%
action-eat-girl-layout-v3.webp 1.00 0%`.trim().split('\n').map(line=>line.split(' '));
const cssFraming=[...source.matchAll(/#action-screen \.action-card img\[src="([^"]+)"\] \{ --action-image-scale:([\d.]+); --action-image-y:([\d.]+(?:%|px)); \}/g)].map(([,file,scale,y])=>[file,scale,y]);
assert.deepEqual(cssFraming,approvedFraming,'All 32 Action Match images must use their approved zoom and vertical offsets');
assert.doesNotMatch(source,/#action-screen \.action-card img[^\n]*translateX\(/,'Action Match framing must not shift the two-panel boundary horizontally');

const expectedNew={
  'turn-on':{phrase:'Turn it on.',ja:'つける',images:['action-turn-on-boy-tv-v1.webp','action-turn-on-girl-ac-v1.webp']},
  'turn-off':{phrase:'Turn it off.',ja:'けす',images:['action-turn-off-boy-light-v2.webp','action-turn-off-girl-game-v1.webp']},
  'take-out':{phrase:'Take it out.',ja:'とりだす',images:['action-take-out-boy-toy-v1.webp','action-take-out-girl-milk-v1.webp']},
  'put-away':{phrase:'Put it away.',ja:'かたづける',images:['action-put-away-boy-book-v2.webp','action-put-away-girl-toy-v1.webp']},
  push:{phrase:'Push it.',ja:'おす',images:['action-push-boy-layout-v5.webp','action-push-girl-layout-v3.webp']},
  pull:{phrase:'Pull it.',ja:'ひっぱる',images:['action-pull-boy-layout-v5.webp','action-pull-girl-layout-v3.webp']},
  give:{phrase:'Give it to me.',ja:'わたす',images:['action-give-boy-layout-v3.webp','action-give-girl-layout-v5.webp']},
  eat:{phrase:'Eat it.',ja:'たべる',images:['action-eat-boy-layout-v3.webp','action-eat-girl-layout-v3.webp']},
};
const cards=[...board.matchAll(/<button class="action-card" data-action="([^"]+)" data-panels="([^"]+)"[^>]*><img src="([^"]+)"/g)].map(([,action,panels,image])=>({action,panels,image}));
const phrases=vm.runInNewContext(`(${source.match(/const actionPhrases=(\{[^;]+\});/)?.[1]})`);
const japanese=vm.runInNewContext(`(${source.match(/const actionJapanese=(\{[^;]+\});/)?.[1]})`);
const approvedJapanese={put:'おく',get:'とる',throw:'すてる','put-on':'みにつける','take-off':'ぬぐ',open:'あける',close:'しめる','pick-up':'ひろう','turn-on':'つける','turn-off':'けす','take-out':'とりだす','put-away':'かたづける',push:'おす',pull:'ひっぱる',give:'わたす',eat:'たべる'};
assert.deepEqual(Object.keys(japanese),Object.keys(approvedJapanese),'Action Match Japanese hints must cover exactly 16 actions');
for(const [action,hint] of Object.entries(approvedJapanese)) {
  assert.deepEqual([...japanese[action]],[hint,hint],`${action}: boy and girl must use the same action-only Japanese hint`);
  assert(/^[ぁ-ゔー]+$/u.test(hint),`${action}: Japanese hint must contain only hiragana`);
}
assert(source.includes("actionHintButton.addEventListener('click',()=>setActionHintStep((actionHintStep+1)%3))"),'The text button must retain its three-step cycle');
assert(source.includes('#action-screen:is([data-action-hint-step="1"],[data-action-hint-step="2"]) .action-labels { display:flex; }'),'The Japanese and bilingual stages must show the top hint band');
assert.match(source,/#action-screen\[data-action-hint-step="1"\] \.action-label-ja,\s*#action-screen\[data-action-hint-step="2"\] \.action-label-ja,\s*#action-screen\[data-action-hint-step="2"\] \.action-label-en \{ display:block; \}/,'The three stages must reveal only their intended languages');
const longestJapanese=Math.max(...Object.values(approvedJapanese).map(hint=>[...hint].length));
assert(longestJapanese*13<(375-28-6)/2-9,'The longest Japanese hint cannot fit its half of a 375px card');
assert.equal(cards.length,32,'Action Match must register 32 images');
assert.equal(Object.keys(phrases).length,16,'Action Match must register 16 actions');
assert(!cards.some(card=>card.action==='bring'),'Bring must not have Action Match cards');
assert(!Object.hasOwn(phrases,'bring') && !Object.hasOwn(japanese,'bring'),'Bring must not have Action Match speech or hints');
assert.equal(phrases.give,'Give it to me.','Give must remain registered');
assert(!Object.values(phrases).includes('Hand it to me.'),'The rejected Hand it to me. phrase must not be registered');
assert.deepEqual(new Set(cards.map(card=>card.action)),new Set(Object.keys(phrases)));
assert(cards.every(card=>card.panels==='2'),'Every Action Match image must have two panels');
assert.equal(new Set(cards.map(card=>card.image)).size,32,'Action Match images must be unique');
for(const [action,definition] of Object.entries(expectedNew)) {
  assert.equal(phrases[action],definition.phrase,`${action}: spoken English differs`);
  assert.deepEqual([...japanese[action]],[definition.ja,definition.ja],`${action}: Japanese hints differ`);
  assert.deepEqual(cards.filter(card=>card.action===action).map(card=>card.image),definition.images,`${action}: boy/girl image pairing differs`);
  for(const image of definition.images) {
    const file=path.join(root,image);
    assert(fs.existsSync(file),`${image}: file is missing`);
    const bytes=fs.readFileSync(file);
    assert(bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP',`${image}: invalid WebP`);
    if(['push','pull','give','eat'].includes(action)) {
      assert.equal(bytes.toString('ascii',12,16),'VP8X',`${image}: expected extended WebP with alpha`);
      assert(bytes[20]&0x10,`${image}: WebP alpha flag is missing`);
      const width=bytes[24]+(bytes[25]<<8)+(bytes[26]<<16)+1;
      const height=bytes[27]+(bytes[28]<<8)+(bytes[29]<<16)+1;
      assert.deepEqual([width,height],[800,450],`${image}: expected 800×450 WebP`);
    }
  }
}
for(const action of Object.keys(phrases)) {
  const pair=cards.filter(card=>card.action===action);
  assert.equal(pair.length,2,`${action}: expected boy/girl pair`);
  assert(pair[0].image.includes('-boy-') && pair[1].image.includes('-girl-'),`${action}: boy/girl image order differs`);
  for(const card of pair) assert(fs.existsSync(path.join(root,card.image)),`${card.image}: registered image is missing`);
  assert.equal(japanese[action]?.length,2,`${action}: expected boy/girl hints`);
}
assert(source.includes('const actions=chooseActionTypes();'),'Four-action random selection must use the conflict-aware selector');
assert(source.includes("const actionConflicts=[['pull','open']];"),'The Pull/Open exclusion pair is missing');
assert(source.includes('actionCards.filter(card=>card.dataset.action===action)'),'Gender image selection changed');
assert(source.includes("'#action-play-again').addEventListener('click',()=>{ unlockAudio(); prepareActionCards(); selectAction(); }"),'Play Again must draw a new round');
const actionHeader=source.match(/<main class="app" id="action-screen"[\s\S]*?<\/header>/)?.[0];
assert(actionHeader,'Action Match header is missing');
assert.deepEqual([...actionHeader.matchAll(/id="(action-(?:home|reset|hint|speaker))"/g)].map(match=>match[1]),['action-home','action-reset','action-hint','action-speaker'],'Action Match header controls must match the other games');
assert.match(actionHeader,/<button class="round compact-control" id="action-reset" type="button" aria-label="リセット">↻<\/button>/);
assert(/#action-reset[^\{]*\{ background:linear-gradient\(145deg,#d9f1ff,#8ac8e9\); font-size:0; \}/.test(source),'Action Match reset must share the existing button background');
assert(/#action-reset::after[^\{]*\{ content:"↻"; font-size:21px; display:block; line-height:1; transform:translate\(0,-1px\); \}/.test(source),'Action Match reset must share the existing icon styling');
for(const width of [375,390,430]) assert(2*7+48+90+4*48+5*4<=width,`${width}px: Action Match controls cannot fit the top bar`);

const functionLine=name=>{
  const start=source.indexOf(`      function ${name}(`);
  assert(start>=0,`${name}: implementation is missing`);
  const opening=source.indexOf(' {',start)+1;
  let depth=0;
  for(let index=opening;index<source.length;index++) {
    if(source[index]==='{') depth++;
    if(source[index]==='}' && --depth===0) return source.slice(start,index+1);
  }
  assert.fail(`${name}: implementation is incomplete`);
};
// Exercise the actual selector with deterministic Fisher-Yates draws.
const actions=Object.keys(phrases);
const shuffle=(list,random)=>{
  const result=[...list];
  for(let index=result.length-1;index>0;index--) {
    const swapIndex=Math.floor(random()*(index+1));
    [result[index],result[swapIndex]]=[result[swapIndex],result[index]];
  }
  return result;
};
let actionRandom=()=>0;
const chooseTypes=vm.runInNewContext(`${functionLine('chooseActionTypes')}; chooseActionTypes`,{
  actionPhrases:phrases,actionConflicts:[['pull','open']],shuffle:list=>shuffle(list,actionRandom)
});
let conflictRetries=0;
const opening=seed=>{
  let state=seed>>>0;
  let draws=0;
  const random=()=>{ draws++; return ((state=(Math.imul(1664525,state)+1013904223)>>>0)/2**32); };
  actionRandom=random;
  const chosen=chooseTypes();
  if(draws>actions.length-1) conflictRetries++;
  assert.equal(chosen.length,4,`seed ${seed}: wrong action count`);
  assert(!(chosen.includes('pull') && chosen.includes('open')),`seed ${seed}: Pull and Open appeared together`);
  const selected=chosen.map(action=>shuffle(cards.filter(card=>card.action===action),random)[0]);
  return shuffle(selected,random);
};
const seen=new Set();
const seenActions=new Set();
for(let seed=1;seed<=5000;seed++) {
  const selected=opening(seed);
  assert.equal(selected.length,4);
  assert.equal(new Set(selected.map(card=>card.action)).size,4,`seed ${seed}: duplicate action`);
  assert.deepEqual(opening(seed).map(card=>card.image),selected.map(card=>card.image),`seed ${seed}: Play Again differs`);
  selected.forEach(card=>{ seen.add(card.image); seenActions.add(card.action); });
}
assert.deepEqual(seen,new Set(cards.map(card=>card.image)),'Some action images are never selected');
assert.deepEqual(seenActions,new Set(actions),'Some existing or new actions are never selected');
assert(!seenActions.has('bring'),'Bring reached the random selector');
assert(seenActions.has('give') && seenActions.has('pull') && seenActions.has('open'),'Give, Pull and Open must remain reachable');
assert(conflictRetries>0,'Seeded tests never exercised a Pull/Open rejection');
let blockedDraws=0;
const blockedSelector=vm.runInNewContext(`${functionLine('chooseActionTypes')}; chooseActionTypes`,{
  actionPhrases:phrases,actionConflicts:[['pull','open']],
  shuffle:list=>{ blockedDraws++; return ['pull','open',...list.filter(key=>key!=='pull'&&key!=='open')]; }
});
const fallback=blockedSelector();
assert.equal(fallback.length,4,'A repeated invalid draw must terminate with four actions');
assert(!(fallback.includes('pull') && fallback.includes('open')),'Fallback selection allowed Pull and Open together');
assert.equal(blockedDraws,25,'The conflict retry limit or finite fallback changed');

// Exercise the actual Action Match reset and card handlers without a browser.
const handlerLine=pattern=>{
  const line=source.match(pattern)?.[0];
  assert(line,`Action Match handler is missing: ${pattern}`);
  return line;
};
const cardHandler=handlerLine(/^      document\.querySelectorAll\('\[data-action\]'\)\.forEach\([^\n]+$/m);
const resetHandler=handlerLine(/^      document\.querySelector\('#action-reset'\)\.addEventListener\([^\n]+$/m);
const playAgainHandler=handlerLine(/^      document\.querySelector\('#action-play-again'\)\.addEventListener\([^\n]+$/m);
const makeClasses=()=>{
  const names=new Set();
  return {add:name=>names.add(name),remove:(...values)=>values.forEach(value=>names.delete(value)),
    contains:name=>names.has(name),toggle:(name,on)=>on ? names.add(name) : names.delete(name)};
};
const actionTestCards=cards.map(({action,image})=>{
  const attributes=new Map();
  return {dataset:{action},image,classList:makeClasses(),tabIndex:0,
    setAttribute:(name,value)=>attributes.set(name,value),removeAttribute:name=>attributes.delete(name),
    getAttribute:name=>attributes.get(name),addEventListener(type,listener){ assert.equal(type,'click'); this.click=listener; }};
});
const ordered=[...actionTestCards], finishPanel={classList:makeClasses()}, resetButton={}, playAgainButton={};
for(const button of [resetButton,playAgainButton]) button.addEventListener=(type,listener)=>{assert.equal(type,'click');button.click=listener;};
const timers=new Map();
let nextTimer=1, audioStopped=0, correctSounds=0, wrongSounds=0, finishSounds=0, hintStep=0, selectionVersion=0, shuffleCalls=0, forcedConflicts=0;
const actionContext={
  actionCards:actionTestCards,actionFinish:finishPanel,actionPhrases:phrases,actionSpeaker:{setAttribute(){}},
  actionConflicts:[['pull','open']],
  actionBoard:{querySelectorAll:()=>ordered.filter(card=>!card.classList.contains('queued')&&!card.classList.contains('matched')),
    insertBefore(card){ const index=ordered.indexOf(card); if(index>=0) ordered.splice(index,1); ordered.push(card); }},
  document:{querySelector:selector=>selector==='#action-reset' ? resetButton : selector==='#action-play-again' ? playAgainButton : null,
    querySelectorAll:selector=>selector==='[data-action]' ? actionTestCards : []},
  shuffle:list=>{ shuffleCalls++; if(selectionVersion===3 && list.length===actions.length && forcedConflicts++%2===0) return ['pull','open',...list.filter(key=>key!=='pull'&&key!=='open')]; return selectionVersion===1 ? [...list].reverse() : selectionVersion===2 ? [...list.slice(1),list[0]] : [...list]; },
  setTimeout:(callback,delay)=>{ const id=nextTimer++; timers.set(id,{callback,delay}); return id; },
  clearTimeout:id=>timers.delete(id),
  stopSpeech(){audioStopped++;},resetHintStages(){hintStep=0;},unlockAudio(){},
  correctSound(){correctSounds++;},wrongSound(){wrongSounds++;},finishSound(){finishSounds++;}
};
vm.createContext(actionContext);
vm.runInContext(`let actionCurrent='put', actionAdvanceTimer=null, actionWrongTimer=null;
  function speakAction() { spoken.push(actionCurrent); }
  ${['clearActionTimers','chooseActionTypes','prepareActionCards','resetAction','finishAction','selectAction'].map(functionLine).join('\n')}
  ${resetHandler}\n${playAgainHandler}\n${cardHandler}
  this.api={start:()=>{ prepareActionCards(); selectAction(); },current:()=>actionCurrent};`,
  Object.assign(actionContext,{spoken:[]}));
const visible=()=>ordered.filter(card=>!card.classList.contains('queued'));
const visibleImages=()=>visible().map(card=>card.image);
const runTimer=delay=>{
  const entry=[...timers.entries()].find(([,timer])=>timer.delay===delay);
  assert(entry,`Expected a ${delay}ms Action Match timer`);
  timers.delete(entry[0]); entry[1].callback();
};
actionContext.api.start();
const originalImages=visibleImages(), openingAction=actionContext.api.current();
assert.equal(originalImages.length,4);
assert.equal(new Set(visible().map(card=>card.dataset.action)).size,4);
assert.equal(shuffleCalls,7,'A new round must shuffle actions, four gender variants, card order, and first instruction');
hintStep=2;
visible().find(card=>card.dataset.action===openingAction).click();
assert.equal(timers.size,1,'Correct answer must schedule advancement');
const correctBeforeReset=correctSounds, wrongBeforeReset=wrongSounds, finishBeforeReset=finishSounds;
selectionVersion=1;
resetButton.click();
assert.equal(timers.size,0,'Reset must cancel a pending correct-answer transition');
assert.equal(shuffleCalls,14,'Reset did not rerun all seven random selections');
assert.notDeepEqual(visibleImages(),originalImages,'Fixed draws should select new actions, gender images, and order on reset');
assert(visible().every(card=>card.image.includes('-girl-')),'Fixed reset draw did not select girl variants');
assert(visible().every(card=>!card.classList.contains('matched') && card.tabIndex===0 && !card.getAttribute('aria-hidden')),'Reset did not restore all four cards');
assert.equal(actionContext.spoken.at(-1),actionContext.api.current(),'Reset did not speak the new first instruction');
assert.equal(hintStep,2,'Reset should preserve the current text stage');
assert.deepEqual([correctSounds,wrongSounds,finishSounds],[correctBeforeReset,wrongBeforeReset,finishBeforeReset],'Reset played a success or failure sound');
const firstResetImages=visibleImages();
selectionVersion=2;
resetButton.click();
assert.equal(shuffleCalls,21,'Repeated reset did not redraw a new round');
assert.notDeepEqual(visibleImages(),firstResetImages,'Fixed draws should produce another round on repeated reset');
assert.equal(timers.size,0,'Repeated reset retained a timer');
visible().find(card=>card.dataset.action!==actionContext.api.current()).click();
assert.equal(timers.size,1,'Wrong answer must schedule speech replay');
selectionVersion=0;
resetButton.click();
assert.equal(timers.size,0,'Reset must cancel pending wrong-answer speech');
assert.equal(shuffleCalls,28,'Reset after a wrong answer did not run the random selections');
assert.deepEqual(visibleImages(),originalImages,'A coincidentally identical new draw must be allowed');
assert(audioStopped>=3,'Reset must stop current speech');
for(let index=0;index<4;index++) {
  const current=actionContext.api.current();
  const card=visible().find(item=>item.dataset.action===current && !item.classList.contains('matched'));
  assert(card,`No card for instruction ${current}`);
  card.click(); runTimer(600);
}
assert(finishPanel.classList.contains('show'),'Four correct answers must still finish the game');
assert.equal(finishSounds,finishBeforeReset+1);
selectionVersion=1;
resetButton.click();
assert(!finishPanel.classList.contains('show'),'Reset must dismiss the finish screen');
assert.notDeepEqual(visibleImages(),originalImages,'Reset after completion must redraw the round');
assert.equal(shuffleCalls,38,'Reset after completion did not redraw the round');
const beforePlayAgain=visibleImages();
selectionVersion=2;
playAgainButton.click();
assert.equal(hintStep,0,'Play Again must reset the text stage');
assert.notDeepEqual(visibleImages(),beforePlayAgain,'Fixed Play Again draw must differ from the previous round');
assert.equal(shuffleCalls,45,'Play Again did not rerun all random selections');
assert.equal(new Set(visible().map(card=>card.dataset.action)).size,4);
assert(visible().every(card=>!card.classList.contains('matched') && card.tabIndex===0),'Play Again did not restore four usable cards');
selectionVersion=3;
for(const [entry,run] of [['start',()=>actionContext.api.start()],['reset',()=>resetButton.click()],['Play Again',()=>playAgainButton.click()]]) {
  forcedConflicts=0;
  run();
  assert.equal(forcedConflicts,2,`${entry}: did not redraw after a Pull/Open conflict`);
  const selectedActions=visible().map(card=>card.dataset.action);
  assert.equal(new Set(selectedActions).size,4,`${entry}: did not retain four distinct actions`);
  assert(!(selectedActions.includes('pull') && selectedActions.includes('open')),`${entry}: Pull/Open conflict was not excluded`);
}
console.log('PASS Action Match: 16 actions, 32 images, Pull/Open exclusion across 5000 seeds, reset redraw and Play Again');
