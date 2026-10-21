import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {checkIndexSyntax} from './check-index-syntax.mjs';
import {installSilentAudio,assertSilentAudio} from './silent-audio.mjs';

const root=path.resolve('.');
const htmlPath=path.join(root,'index.html');
const html=fs.readFileSync(htmlPath,'utf8');
checkIndexSyntax(htmlPath);
const readArray=name=>{
  const match=html.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n  \\]);`));
  assert(match,`Think & Say ${name} data not found`);
  return vm.runInNewContext(match[1],{}, {timeout:1000});
};
const leftCards=readArray('leftCards'),rightCards=readArray('rightCards'),questions=readArray('questions');
const leftByWord=new Map(leftCards.map(card=>[card.word,card]));
const rightByWord=new Map(rightCards.map(card=>[card.word,card]));
const kanji=/[\p{Script=Han}]/u;

function checkData() {
  assert.equal(leftCards.length,8);
  assert.equal(rightCards.length,18);
  assert.equal(questions.length,24);
  assert.equal(new Set(questions.map(q=>q.sentence)).size,24);
  assert.equal(new Set(questions.map(q=>`${q.leftImage}/${q.rightImage}`)).size,24,'question image pairs must identify one question in the browser test');
  for(const card of [...leftCards,...rightCards]) {
    assert(card.word && card.ja && !kanji.test(card.ja),`card translation missing or contains kanji: ${card.word}`);
  }
  for(const q of questions) {
    assert(leftByWord.has(q.leftAnswer) && rightByWord.has(q.rightAnswer),`${q.sentence}: answer card missing`);
    assert(q.jp && !kanji.test(q.jp),`${q.sentence}: Japanese band missing or contains kanji`);
    const punctuation=q.leftAnswer.startsWith('Can ') ? '?' : '.';
    assert.equal(q.sentence,`${q.leftAnswer} ${q.rightAnswer}${punctuation}`);
    for(const image of [q.leftImage,q.rightImage]) assert(image && fs.existsSync(path.join(root,image)),`${q.sentence}: image missing: ${image}`);
  }
  assert(!/じゅんび中/.test(html.match(/id="open-think"[\s\S]*?<\/button>/)?.[0] || ''),'Think & Say is still marked as coming soon');
  assert(!html.includes('id="think-start-screen"') && !html.includes('id="think-start"'),'Think & Say still has a start-only screen');
  assert(/#think-screen \.card \{[^}]*font-family:system-ui,-apple-system,sans-serif;/.test(html),'source and drag-copy cards must use the same explicit font family');
  console.log('PASS Think & Say static data: 8 left cards, 18 right cards, 24 complete questions and images, punctuation, Japanese without kanji');
}

checkData();
if(process.argv.includes('--static-only')) process.exit(0);

const require=createRequire(import.meta.url);
const {chromium,webkit}=require('playwright');
const engines=[
  ['chromium',chromium,{...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}),args:['--mute-audio']}],
  ['webkit',webkit,{}]
];
const sizes=[[375,667],[390,844],[430,932]];
const seeds=[0.03,0.41,0.91];
const appUrl=pathToFileURL(htmlPath).href;

async function installSpeechSpy(page,seed) {
  await page.addInitScript(draw=>{
    Math.random=()=>draw;
    const calls=[];
    let active=null, holdText=null;
    const synthesis=window.speechSynthesis;
    if(!synthesis) throw new Error('speechSynthesis unavailable in test browser');
    const speak=function(utterance) {
      calls.push({type:'speak',text:utterance.text,volume:utterance.volume});
      active=utterance;
      queueMicrotask(()=>{
        if(active!==utterance) return;
        utterance.onstart?.({type:'start'});
        if(holdText===utterance.text) { calls.push({type:'held',text:utterance.text}); holdText=null; return; }
        setTimeout(()=>{
          if(active!==utterance) return;
          active=null;
          utterance.onend?.({type:'end'});
        },25);
      });
    };
    const cancel=function() { calls.push({type:'cancel'}); active=null; };
    synthesis.speak=speak;
    synthesis.cancel=cancel;
    window.__thinkSpeech={
      calls,
      installed:synthesis.speak===speak && synthesis.cancel===cancel,
      hold(text) { holdText=text; },
      end() { const utterance=active; active=null; utterance?.onend?.({type:'end'}); },
      get active() { return active?.text || null; }
    };
  },seed);
}

async function newPage(browser,width,height,seed,query='') {
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
  await installSilentAudio(page);
  await installSpeechSpy(page,seed);
  await page.goto(appUrl+query,{waitUntil:'load'});
  await assertSilentAudio(page);
  assert(await page.evaluate(()=>window.__thinkSpeech?.installed),'speech spy was not installed');
  return page;
}

async function currentQuestion(page) {
  const images=await page.evaluate(()=>[
    document.querySelector('#think-left-visual img')?.getAttribute('src'),
    document.querySelector('#think-right-visual img')?.getAttribute('src')
  ]);
  const matches=questions.filter(q=>q.leftImage===images[0] && q.rightImage===images[1]);
  assert.equal(matches.length,1,`question art did not identify one question: ${images}`);
  return matches[0];
}

async function speechCalls(page) { return page.evaluate(()=>window.__thinkSpeech.calls); }
async function waitForSpeech(page,text,count=1) {
  await page.waitForFunction(({text,count})=>window.__thinkSpeech.calls.filter(call=>call.type==='speak' && call.text===text).length>=count,{text,count},{timeout:7000});
}
async function waitForSpeechIdle(page) {
  await page.waitForFunction(()=>window.__thinkSpeech.active===null,null,{timeout:7000});
}

function card(page,side,word) {
  return page.locator(`#think-${side}-bank .card[data-word=${JSON.stringify(word)}]`);
}
async function tapCard(page,side,word,expectedSpeechCount) {
  const box=await card(page,side,word).boundingBox();
  assert(box,`missing ${side} card ${word}`);
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();
  await waitForSpeech(page,word,expectedSpeechCount); // pointerup 前に鳴る
  await page.mouse.up();
}
async function dropCard(page,side,word) {
  const from=await card(page,side,word).boundingBox();
  const to=await page.locator(`#think-${side}-slot`).boundingBox();
  assert(from && to,`cannot drag ${side} card ${word}`);
  await page.mouse.move(from.x+from.width/2,from.y+from.height/2);
  await page.mouse.down();
  await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:6});
  await page.mouse.up();
}

async function checkBoard(page,q) {
  const board=await page.evaluate(()=>({
    left:[...document.querySelectorAll('#think-left-bank .card')].map(e=>e.dataset.word),
    right:[...document.querySelectorAll('#think-right-bank .card')].map(e=>e.dataset.word)
  }));
  assert.equal(board.left.length,3);
  assert.equal(board.right.length,3);
  assert(board.left.includes(q.leftAnswer) && board.right.includes(q.rightAnswer),`${q.sentence}: correct card missing`);
  assert.equal(new Set(board.left).size,3);
  assert.equal(new Set(board.right).size,3);
  for(const word of board.left.filter(word=>word!==q.leftAnswer)) {
    assert.notEqual(leftByWord.get(word).gesture,leftByWord.get(q.leftAnswer).gesture,`${q.sentence}: same-gesture left dummy ${word}`);
  }
  for(const word of board.right.filter(word=>word!==q.rightAnswer)) {
    const dummy=rightByWord.get(word),answer=rightByWord.get(q.rightAnswer);
    assert(!dummy.noDummy,`${q.sentence}: forbidden right dummy ${word}`);
    assert(!dummy.marks.some(mark=>answer.marks.includes(mark)),`${q.sentence}: shared-mark right dummy ${word}`);
  }
  assert(new Set(board.right.map(word=>rightByWord.get(word).kind)).size>=2,`${q.sentence}: right card kinds not mixed`);
  return board;
}

async function checkLayout(page,width,height) {
  const result=await page.evaluate(()=>{
    const root=document.querySelector('#think-screen'),r=root.getBoundingClientRect();
    const targets=[...root.querySelectorAll('.card,.slot-speaker:not([hidden]),.screen-header button,#think-hint')]
      .filter(e=>getComputedStyle(e).display!=='none' && getComputedStyle(e).visibility!=='hidden')
      .map(e=>({name:e.id || e.dataset.word || e.className,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));
    return {screen:{x:r.x,right:r.right,width:r.width},scrollWidth:document.documentElement.scrollWidth,targets};
  });
  assert(result.scrollWidth<=width+1,`${width}×${height}: horizontal overflow ${result.scrollWidth}`);
  assert(result.screen.x>=-1 && result.screen.right<=width+1);
  for(const target of result.targets) assert(target.w>=48 && target.h>=48,`${width}×${height}: small tap target ${JSON.stringify(target)}`);
}

async function checkHint(page) {
  await page.locator('#think-hint').click();
  assert.equal(await page.locator('#think-hint').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#think-screen .card-ja:not([hidden])').count(),6);
  assert.equal(await page.locator('#think-slot-hints,#think-left-hint,#think-right-hint').count(),0,'slot answers leaked through hint');
  assert.equal(await page.locator('#think-screen .feedback-space').innerText(),'','hint revealed an answer below the slots');
  const visibleText=await page.locator('#think-screen').innerText();
  assert(!kanji.test(visibleText),'visible Think & Say Japanese contains kanji');
  await page.locator('#think-hint').click();
  assert.equal(await page.locator('#think-screen .card-ja:not([hidden])').count(),0);
}

async function checkWrongAndSpeaker(page,q,board,mode) {
  const wrongSides=mode==='both' ? ['left','right'] : [mode];
  const selected={
    left:wrongSides.includes('left') ? board.left.find(word=>word!==q.leftAnswer) : q.leftAnswer,
    right:wrongSides.includes('right') ? board.right.find(word=>word!==q.rightAnswer) : q.rightAnswer
  };
  const spokenBefore=(await speechCalls(page)).filter(call=>call.type==='speak' && call.text===selected.left).length;
  await dropCard(page,'left',selected.left);
  await waitForSpeech(page,selected.left,spokenBefore+1);
  await dropCard(page,'right',selected.right);
  for(const side of ['left','right']) {
    const speaker=page.locator(`#think-${side}-slot .slot-speaker:not([hidden])`);
    if(wrongSides.includes(side)) {
      await speaker.waitFor({state:'visible',timeout:4000});
      assert.equal(await page.locator(`#think-${side}-slot .card`).count(),0,`wrong ${side} card remained in slot`);
    } else {
      assert.equal(await speaker.count(),0,`correct ${side} card was rejected`);
      assert.equal(await page.locator(`#think-${side}-slot .card[data-word=${JSON.stringify(q[`${side}Answer`])}]`).count(),1);
    }
  }
  assert(!kanji.test(await page.locator('#think-status').innerText()),'wrong-answer message contains kanji');
  assert.equal((await speechCalls(page)).filter(call=>call.type==='speak' && call.text===selected.left).length,spokenBefore+1,'dropping a card spoke it again');
  await checkLayout(page,...await page.evaluate(()=>[innerWidth,innerHeight]));
  await waitForSpeechIdle(page);
  const focus=wrongSides.at(-1),answer=q[`${focus}Answer`];
  const before=(await speechCalls(page)).filter(call=>call.type==='speak' && call.text===answer).length;
  await page.evaluate(text=>window.__thinkSpeech.hold(text),answer);
  await tapCard(page,focus,answer,before+1);
  const cancels=(await speechCalls(page)).filter(call=>call.type==='cancel').length;
  await page.locator(`#think-${focus}-slot .slot-speaker`).click();
  assert.equal((await speechCalls(page)).filter(call=>call.type==='speak' && call.text===answer).length,before+1,'speaker interrupted current speech');
  assert.equal((await speechCalls(page)).filter(call=>call.type==='cancel').length,cancels,'speaker cancelled current speech');
  await page.evaluate(()=>window.__thinkSpeech.end());
  await waitForSpeech(page,answer,before+2);
  await waitForSpeechIdle(page);
  if(mode==='both') {
    await dropCard(page,'left',q.leftAnswer);
    assert.equal(await page.locator('#think-left-slot .slot-speaker:not([hidden])').count(),0);
    assert.equal(await page.locator('#think-right-slot .slot-speaker:not([hidden])').count(),1);
  }
  await page.evaluate(text=>window.__thinkSpeech.hold(text),q.sentence);
  await dropCard(page,focus,answer);
  assert.equal(await page.locator('#think-screen .slot-speaker:not([hidden])').count(),0,'speaker remained after filling the slot');
}

async function checkCorrectAndAdvance(page,q,round) {
  await page.locator('#think-screen .toast.show').waitFor({state:'visible',timeout:7000});
  await page.locator('#think-screen .joined-card.together').waitFor({state:'visible',timeout:7000});
  assert.equal(await page.locator('#think-screen .joined-half.left').innerText(),q.leftAnswer);
  assert.equal(await page.locator('#think-screen .joined-half.right').innerText(),q.rightAnswer+q.sentence.slice(-1));
  await page.locator('#think-screen .show-correct-copy').waitFor({state:'visible',timeout:7000});
  assert.equal(await page.locator('#think-jp').innerText(),q.jp);
  assert.equal(await page.locator('#think-status').innerText(),q.sentence);
  assert(!kanji.test(await page.locator('#think-screen').innerText()),'correct-answer screen contains kanji');
  const geometry=await page.evaluate(()=>{
    const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {top:r.top,bottom:r.bottom};};
    return {toast:rect('#think-toast'),copy:rect('#think-screen .feedback'),thought:rect('#think-screen .thought')};
  });
  assert(geometry.toast.top>=geometry.copy.bottom-1,`${q.sentence}: toast overlaps correct sentence`);
  assert(geometry.toast.top>=geometry.thought.bottom-1,`${q.sentence}: toast overlaps thought bubble`);
  assert.equal(await page.locator('#think-screen .slot-speaker:not([hidden])').count(),0);
  if(round<4) {
    await page.waitForFunction(next=>document.querySelector('#think-count').textContent.trim().startsWith(`${next} /`),round+2,{timeout:9000});
    assert.equal(await page.locator('#think-screen .slot-speaker:not([hidden])').count(),0,'speaker visible at next question');
    assert.equal(await page.locator('#think-screen .card-ja:not([hidden])').count(),0,'hint persisted into next question');
  } else await page.locator('#think-finish.show').waitFor({state:'visible',timeout:9000});
}

async function runGame(page,width,height,seed) {
  const tile=page.locator('#open-think');
  assert(await tile.isEnabled(),'home Think & Say tile is disabled');
  assert(!/じゅんび中/.test(await tile.innerText()));
  await tile.click();
  assert.equal(await page.locator('#think-start-screen').count(),0,'start-only screen was not removed');
  assert(await page.locator('#think-screen').isVisible(),'Think & Say did not open directly');
  await page.waitForFunction(()=>document.querySelector('#think-count').textContent.trim()==='1 / 5');
  await waitForSpeech(page,"Let's play!");
  await waitForSpeechIdle(page);
  assert.equal(await page.locator('.speech-debug').count(),0,'debug panel shown without ?debug=1');
  const seenLeft=new Set(),seenImages=new Set();
  for(let round=0;round<5;round++) {
    const q=await currentQuestion(page);
    assert(!seenLeft.has(q.leftAnswer),`duplicate left answer: ${q.leftAnswer}`);
    assert(!seenImages.has(q.rightImage),`duplicate right image: ${q.rightImage}`);
    seenLeft.add(q.leftAnswer); seenImages.add(q.rightImage);
    const board=await checkBoard(page,q);
    await checkLayout(page,width,height);
    if(round===0) {
      await checkHint(page);
      await checkWrongAndSpeaker(page,q,board,width===375 ? 'left' : width===390 ? 'right' : 'both');
    } else {
      if(round===4) { await page.locator('#think-hint').click(); assert.equal(await page.locator('#think-hint').getAttribute('aria-pressed'),'true','final question hint did not turn on'); }
      await dropCard(page,'left',q.leftAnswer);
      await dropCard(page,'right',q.rightAnswer);
    }
    await checkCorrectAndAdvance(page,q,round);
    if(round===0) assert((await speechCalls(page)).some(call=>call.type==='held' && call.text===q.sentence),`${q.sentence}: timeout without onend was not exercised`);
    assert((await speechCalls(page)).some(call=>call.type==='speak' && call.text===q.sentence),`${q.sentence}: full sentence not spoken`);
  }
  assert.equal(seenLeft.size,5);
  assert.equal(seenImages.size,5);
  await page.locator('#think-restart').click();
  await page.waitForFunction(()=>document.querySelector('#think-count').textContent.trim()==='1 / 5');
  assert.equal(await page.locator('#think-hint').getAttribute('aria-pressed'),'false','Play again kept the Think & Say hint pressed');
  assert.equal(await page.locator('#think-screen .card-ja:not([hidden])').count(),0,'Play again kept Think & Say Japanese labels visible');
  assert.equal(await page.locator('#think-finish.show').count(),0,'Play again did not dismiss the finish screen');
  await page.locator('#think-proto-home').click();
  assert(await page.locator('#home-screen').isVisible(),'Home button did not return home');
  await page.locator('#open-think').click();
  await page.locator('#think-proto-back').click();
  assert(await page.locator('#home-screen').isVisible(),'Back button did not return home');
  console.log(`PASS Think & Say ${width}×${height} random=${seed}: 5 unique left cards and right images, drag/speech/hints/wrong/correct/home`);
}

async function checkDebug(browser) {
  const page=await newPage(browser,375,667,0.41,'?debug=1');
  try {
    await page.locator('#open-think').click();
    await page.waitForFunction(()=>document.querySelector('.speech-debug-log')?.textContent.includes('左ダミー'),null,{timeout:5000});
    const log=await page.locator('.speech-debug-log').innerText();
    assert(log.includes('右ダミー') && log.includes('左の除外') && log.includes('右の除外'),'debug panel omitted dummy selection or exclusions');
  } finally { await page.close(); }
}

async function checkDragEndEvents(browser) {
  const page=await newPage(browser,375,667,0.41);
  const slot=side=>page.locator(`#think-${side}-slot`);
  const reset=async()=>{
    await page.evaluate(()=>document.querySelector('#think-restart').click());
    assert.equal(await page.locator('#think-screen .card.dragging').count(),0,'restart left a ghost card');
    assert.equal(await page.locator('#think-screen .card[style*="opacity: 0"]').count(),0,'restart left an invisible source card');
  };
  const begin=async(side='left',destinationSide=side,grabAtEdge=false)=>{
    const source=page.locator(`#think-${side}-bank .card`).first();
    const from=await source.boundingBox(),to=await slot(destinationSide).boundingBox();
    assert(from && to,'a source card or drop slot is missing');
    const start={x:from.x+(grabAtEdge?5:from.width/2),y:from.y+(grabAtEdge?5:from.height/2)};
    const end={x:grabAtEdge?to.x+to.width-4:to.x+to.width/2,y:to.y+to.height/2};
    await page.mouse.move(start.x,start.y);
    await page.mouse.down();
    await page.mouse.move(end.x,end.y,{steps:5});
    assert.equal(await page.locator('#think-screen .card.dragging').count(),1,'pointerdown did not create one ghost');
    const cardFonts=await page.evaluate(side=>{
      const source=document.querySelector(`#think-${side}-bank .card`),ghost=document.querySelector('#think-screen .card.dragging');
      const font=element=>{ const style=getComputedStyle(element); return {family:style.fontFamily,size:style.fontSize,weight:style.fontWeight,lineHeight:style.lineHeight}; };
      return {source:font(source),ghost:font(ghost),sourceEnglish:font(source.querySelector('.card-en')),ghostEnglish:font(ghost.querySelector('.card-en'))};
    },side);
    assert.deepEqual(cardFonts.ghost,cardFonts.source,'drag copy changed the card font');
    assert.deepEqual(cardFonts.ghostEnglish,cardFonts.sourceEnglish,'drag copy changed the English text font');
    return {source,end,to};
  };
  const dispatch=(source,type,end,buttons)=>source.dispatchEvent(type,{pointerId:1,pointerType:'mouse',button:0,buttons,clientX:end.x,clientY:end.y});
  const dispatchWindow=(type,end,buttons)=>page.evaluate(({type,end,buttons})=>window.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,pointerType:'mouse',button:0,buttons,clientX:end.x,clientY:end.y})),{type,end,buttons});
  const empty=async()=>{
    assert.equal(await slot('left').locator('.card').count(),0,'an unconfirmed release filled the left slot');
    assert.equal(await slot('right').locator('.card').count(),0,'an unconfirmed release filled the right slot');
  };
  try {
    await page.locator('#open-think').click();
    await page.waitForFunction(()=>document.querySelector('#think-count').textContent.trim()==='1 / 5');

    let attempt=await begin();
    await dispatch(attempt.source,'lostpointercapture',attempt.end,1);
    await empty();
    assert.equal(await page.locator('#think-screen .card.dragging').count(),1,'capture loss should wait for pointerup');
    await dispatch(attempt.source,'pointercancel',attempt.end,0);
    await page.mouse.up();
    await empty();
    assert.equal(await page.locator('#think-screen .card.dragging').count(),0,'cancel left a ghost');
    assert.equal(await attempt.source.evaluate(card=>card.style.opacity),'','cancel left the source card hidden');

    attempt=await begin();
    await dispatch(attempt.source,'lostpointercapture',attempt.end,1);
    await dispatchWindow('pointermove',{x:attempt.to.x+10,y:attempt.to.y+10},1);
    await dispatchWindow('pointerup',{x:attempt.to.x+10,y:attempt.to.y+10},0);
    await page.mouse.up();
    assert.equal(await slot('left').locator('.card').count(),1,'pointerup after capture loss was not accepted');
    await dispatchWindow('pointerup',attempt.end,0);
    assert.equal(await slot('left').locator('.card').count(),1,'duplicate pointerup placed a second card');
    await reset();

    attempt=await begin('right');
    await dispatch(attempt.source,'pointermove',attempt.end,0);
    await empty();
    await page.mouse.up();
    assert.equal(await slot('right').locator('.card').count(),1,'pointerup after buttons===0 was not accepted');
    await reset();

    attempt=await begin();
    await dispatch(attempt.source,'pointermove',attempt.end,0);
    await dispatch(attempt.source,'pointercancel',attempt.end,0);
    await page.mouse.up();
    await empty();
    assert.equal(await page.locator('#think-screen .card.dragging').count(),0,'buttons===0 → cancel left a ghost');

    attempt=await begin();
    await dispatch(attempt.source,'lostpointercapture',attempt.end,0);
    await page.waitForTimeout(180);
    await empty();
    assert.equal(await page.locator('#think-screen .card.dragging').count(),0,'missing pointerup did not time out');
    await page.mouse.up();

    attempt=await begin();
    await dispatch(attempt.source,'lostpointercapture',attempt.end,1);
    await page.waitForTimeout(2080);
    await empty();
    assert.equal(await page.locator('#think-screen .card.dragging').count(),0,'active capture loss did not time out');
    await page.mouse.up();

    attempt=await begin('left','right');
    await page.mouse.up();
    await empty();
    assert.equal(await attempt.source.evaluate(card=>card.style.opacity),'','wrong-side drop did not restore source');

    attempt=await begin('left','left',true);
    const ghost=await page.locator('#think-screen .card.dragging').boundingBox();
    assert(ghost.x+ghost.width/2>attempt.to.x+attempt.to.width,'test must place the ghost center outside the slot');
    await page.mouse.up();
    assert.equal(await slot('left').locator('.card').count(),1,'drop incorrectly used the ghost center instead of the pointer');
    await reset();

    attempt=await begin();
    await reset();
    await page.mouse.up();
    await empty();

    attempt=await begin();
    await page.evaluate(()=>document.querySelector('#think-proto-home').click());
    await page.mouse.up();
    assert.equal(await page.locator('#think-screen .card.dragging').count(),0,'home left a ghost card');
    assert.equal(await attempt.source.evaluate(card=>card.style.opacity),'','home left the source card hidden');
    assert(await page.locator('#home-screen').isVisible(),'home did not leave Think & Say');
    console.log('PASS Think & Say drag ending: confirmed pointerup, capture loss, buttons===0, cancel, timeout, pointer/ghost offset, wrong side, reset, home');
  } finally { await page.close(); }
}

for(const [engineName,engine,options] of engines) {
  const browser=await engine.launch({headless:true,...options});
  try {
    for(let i=0;i<sizes.length;i++) {
      const [width,height]=sizes[i];
      const page=await newPage(browser,width,height,seeds[i]);
      try { await runGame(page,width,height,seeds[i]); }
      finally { await page.close(); }
    }
    await checkDragEndEvents(browser);
    await checkDebug(browser);
    console.log(`PASS Think & Say ${engineName}: 3 deterministic draws and debug-only panel`);
  } finally { await browser.close(); }
}
