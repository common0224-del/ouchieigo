import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const html=fs.readFileSync(path.resolve('index.html'),'utf8');
const runAll=fs.readFileSync(path.resolve('tests/run-all.zsh'),'utf8');
const functionSource=name=>{
  const start=html.indexOf(`      function ${name}(`);
  const end=html.indexOf('\n      function ',start+1);
  assert(start>=0 && end>start,`${name} was not found`);
  return html.slice(start,end);
};
const shuffleSource=html.match(/^      const shuffle = list => .+;$/m)?.[0];
const start=html.indexOf('      // Shopping question generation is kept separate until the shopping screen is built.');
const end=html.indexOf('      function setBreakfastSlot',start);
assert(shuffleSource && start>=0 && end>start,'Shopping state or the existing shuffle() was not found');
const fixedMath=Object.create(Math);
fixedMath.random=()=>0;
const {buildShoppingQuestions,createShoppingSession}=vm.runInNewContext(`${shuffleSource}\n${html.slice(start,end)}\n({buildShoppingQuestions,createShoppingSession})`,{Math:fixedMath});
const fresh=()=>createShoppingSession(buildShoppingQuestions());
const wrongItem=question=>question.itemChoices.find(value=>value!==question.itemKey);
const wrongNumber=question=>question.numberChoices.find(value=>value!==question.count);

assert.match(html,/<button class="place-card place-shopping" id="open-shopping"/);
assert.match(html,/<main class="app" id="shopping-screen" hidden/);
assert.match(html,/<svg viewBox="0 0 900 1200" preserveAspectRatio="none"/);
assert.match(html,/<image href="shopping-scene-bg-v2a\.png\.webp" width="900" height="1200"/);
assert.match(html,/<div class="shopping-column item" id="shopping-items"/);
assert.match(html,/<div class="shopping-column number" id="shopping-numbers"/);
assert.match(html, /id="shopping-item-slot" data-shopping-slot="item"/);
assert.match(html, /id="shopping-number-slot" data-shopping-slot="number"/);
assert.match(html, /id="shopping-kana"[^>]*aria-pressed="false"(?![^>]*disabled)/);
assert.match(html, /id="shopping-speaker"[^>]*aria-pressed="false"(?![^>]*disabled)/);
for(const [id,color] of [['shopping-home','#fff5a3'],['shopping-reset','#d9f1ff'],['shopping-kana','#ecd8ff'],['shopping-speaker','#ffe9b6']]) {
  assert(html.split('\n').some(line=>line.includes(`#${id}`) && line.includes(color)),`${id} lacks the matching top-bar color`);
}
assert.match(html, /id="shopping-instruction-hint"/);
assert.match(html, /id="shopping-instruction-ja"/);
assert.match(html, /id="shopping-instruction-en"/);
assert.match(html, /class="breakfast-finish" id="shopping-finish"/);
assert.match(html, /id="shopping-play-again"/);
assert.match(html, /shoppingFinish\.classList\.toggle\('show',state\.phase==='finished'\)/);
assert.match(html, /else if\(settled\.type==='finished'\) \{ stopShoppingSpeech\(\); finishSound\(\); \}/);
assert.match(html, /#shopping-screen\[data-shopping-hint-step="1"\] \.shopping-card-hint/);
assert.match(html, /\.shopping-card-hint \{ position:absolute;/);
assert.match(html, /\.shopping-instruction-hint \{ position:absolute;/);
assert.match(html, /shoppingInstructionJapanese\.textContent=question\.japaneseInstruction/);
assert.match(html, /shoppingInstructionEnglish\.textContent=question\.englishInstruction/);
assert.match(html, /shoppingHintButton\.addEventListener\('click',\(\)=>setShoppingHintStep\(\(shoppingHintStep\+1\)%3\)\)/);
assert.match(html, /'#shopping-play-again'\)\.addEventListener\('click',\(\)=>\{ unlockAudio\(\); resetShopping\(\{clearHint:true\}\); \}\)/);
assert.match(runAll, /tests\/shopping-screen\.mjs/);
assert(!html.match(/<section class="shopping-scene"[\s\S]*?<\/section>/)?.[0].includes('wooden-tray'));
assert.match(html,/#shopping-screen \{ --shopping-card-width:68px; --shopping-card-height:62px;[\s\S]*?--shopping-slot-width:90px; --shopping-slot-height:80px;/);
assert.match(html, /@media \(min-width:380px\) \{ #shopping-screen \{ --shopping-card-width:74px; --shopping-card-height:70px;[\s\S]*?--shopping-slot-width:93px; --shopping-slot-height:96px;/);
assert.match(html, /@media \(min-width:410px\) \{ #shopping-screen \{ --shopping-card-width:82px; --shopping-card-height:78px;[\s\S]*?--shopping-slot-width:103px; --shopping-slot-height:106px;/);
assert.match(html, /\.shopping-card \{[^}]*background:#fff9eb;/);
assert.match(html, /\.shopping-card-art \{[^}]*aspect-ratio:1;/);
assert.match(html, /\.shopping-card-number \{[^}]*line-height:1;/);
for(const id of ['open-bathroom','open-breakfast','open-living','open-bedroom']) assert(html.includes(`id="${id}"`));
assert.match(html, /const listenContent=Object\.freeze\(\{bathroom:[^\n]+breakfast:[^\n]+living:[^\n]+bedroom:[^\n]+\}\);/);

{
  const attrs={};
  const shoppingScreen={dataset:{}};
  const shoppingHintButton={setAttribute:(key,value)=>{attrs[key]=value;}};
  const hint=vm.runInNewContext(`let shoppingHintStep=0;\n${functionSource('setShoppingHintStep')}\n({setShoppingHintStep,step:()=>shoppingHintStep})`,{shoppingScreen,shoppingHintButton});
  for(const [step,label,pressed] of [[0,'日本語を表示','false'],[1,'英語も表示','true'],[2,'文字を消す','true'],[0,'日本語を表示','false']]) {
    hint.setShoppingHintStep(step);
    assert.equal(hint.step(),step);
    assert.equal(shoppingScreen.dataset.shoppingHintStep,String(step));
    assert.equal(attrs['aria-pressed'],pressed);
    assert.equal(attrs['aria-label'],label);
  }
  assert(!functionSource('setShoppingHintStep').includes('localStorage'));
  assert(!functionSource('renderShopping').includes('setShoppingHintStep'),'next questions must retain the hint stage');
  assert(!functionSource('finishShoppingDrag').includes('setShoppingHintStep'),'answer checks must not reset hints');
}
{
  const japanese=vm.runInNewContext(html.match(/const shoppingNumberJapanese=Object\.freeze\((\[[^;]+\])\);/)?.[1]);
  const english=vm.runInNewContext(html.match(/const shoppingNumberWords=Object\.freeze\((\[[^;]+\])\);/)?.[1]);
  assert.deepEqual([...japanese],['いち','に','さん','よん','ご','ろく','なな','はち','きゅう','じゅう']);
  assert.deepEqual([...english],['one','two','three','four','five','six','seven','eight','nine','ten']);
}
{
  let phrase='Get three apples.';
  const played=[];
  const screen={hidden:false};
  const session={getState:()=>({phase:'ready'}),current:()=>({englishInstruction:phrase})};
  const speak=vm.runInNewContext(`${functionSource('speakShopping')}\n({speakShopping})`,{
    shoppingScreen:screen,shoppingSession:session,window:{speechSynthesis:{}},
    SpeechSynthesisUtterance:class {constructor(text){this.text=text;}},voice:()=>({lang:'en-US'}),speechRate:.9,
    shoppingSpeaker:{setAttribute:()=>{}},isCurrentUtterance:()=>true,playSpeech:utterance=>played.push(utterance)
  }).speakShopping;
  speak();
  assert.equal(played[0].text,phrase);
  assert.equal(played[0]._listenScene,'shopping');
  assert.equal(played[0].rate,.9);
  phrase='Please put two slices of bread in the basket.';
  speak();
  assert.equal(played[1].text,phrase,'replay must use the current question');
  screen.hidden=true; speak(); assert.equal(played.length,2,'hidden shopping screen must not speak');
}
{
  const visibilitySource=html.match(/function isSpeechSceneVisible\(name\) \{[^\n]+\}/)?.[0];
  assert(visibilitySource);
  const screen={hidden:false};
  const ctx={shoppingSession:{},shoppingScreen:screen,getComputedStyle:()=>({display:'flex'}),listenStarted:{bathroom:true},listenScenes:{bathroom:{}},isListenSceneVisible:()=>true};
  const visible=vm.runInNewContext(`${visibilitySource}\n({isSpeechSceneVisible})`,ctx).isSpeechSceneVisible;
  assert.equal(visible('shopping'),true);
  assert.equal(visible('bathroom'),true,'the existing scene path must remain available');
  screen.hidden=true; assert.equal(visible('shopping'),false);
  assert.match(html, /if\(u\._listenScene && !isSpeechSceneVisible\(u\._listenScene\)\) return;/);
}
{
  const timers=new Map(); let nextTimer=0, spoken=0;
  const session={getState:()=>({index:0})};
  const ctx={shoppingSession:session,shoppingScreen:{hidden:false},
    clearTimeout:id=>timers.delete(id),setTimeout:callback=>{const id=++nextTimer; timers.set(id,callback); return id;},
    speakShopping:()=>{spoken++;}};
  const scheduler=vm.runInNewContext(`let shoppingSpeechTimer=null;\n${functionSource('scheduleShoppingSpeech')}\n({scheduleShoppingSpeech})`,ctx).scheduleShoppingSpeech;
  scheduler(); scheduler();
  assert.equal(timers.size,1,'rapid requests must coalesce into one scheduled instruction');
  timers.values().next().value();
  assert.equal(spoken,1);
}
{
  let generated=0,stopped=0,rendered=0,scheduled=0,cleared=0;
  const ctx={shoppingDrag:null,shoppingTransitionTimer:null,shoppingSession:null,shoppingStatus:{textContent:'old'},
    cancelShoppingDrag:()=>{},clearTimeout:()=>{},stopShoppingSpeech:()=>{stopped++;},
    setShoppingHintStep:()=>{cleared++;},buildShoppingQuestions:()=>{generated++; return Array(5);},
    createShoppingSession:questions=>({questions}),renderShopping:()=>{rendered++;},scheduleShoppingSpeech:()=>{scheduled++;}};
  const reset=vm.runInNewContext(`${functionSource('resetShopping')}\n({resetShopping})`,ctx).resetShopping;
  reset(); reset({clearHint:true});
  assert.equal(generated,2,'reset and Play again must each generate five new questions');
  assert.equal(stopped,2,'reset must stop the previous instruction');
  assert.equal(rendered,2);
  assert.equal(scheduled,2);
  assert.equal(cleared,1,'Play again resets hints while ordinary reset retains them');
  assert.equal(ctx.shoppingStatus.textContent,'');
  assert.match(functionSource('leaveShopping'),/clearTimeout\(shoppingSpeechTimer\); shoppingSpeechTimer=null;[^\n]+setShoppingHintStep\(0\)/);
  assert.match(html, /function backToPlaces\(\) \{ stopSpeech\(\); leaveShopping\(\);/);
  assert.match(html, /function returnHome\(\) \{ stopSpeech\(\); leaveShopping\(\);/);
}

{
  const session=fresh(),question=session.current();
  assert.equal(session.drop('item',question.itemKey,'number').type,'wrong-kind');
  assert.equal(session.drop('number',question.count,'item').type,'wrong-kind');
  assert.equal(session.drop('item','not-a-choice','item').type,'invalid-card');
  assert.equal(session.drop('item',question.itemKey,'item').type,'placed');
  assert.equal(session.getState().phase,'ready');
  assert.equal(session.getState().completed,0);
  assert.equal(session.drop('item',wrongItem(question),'item').type,'occupied');
  assert.equal(session.drop('number',question.count,'number').type,'evaluate');
  assert.equal(session.drop('number',wrongNumber(question),'number').type,'blocked');
  assert.equal(session.settle().type,'next');
  assert.equal(session.settle().type,'blocked');
  assert.equal(session.getState().index,1);
  assert.equal(session.getState().completed,1);
}
{
  const session=fresh(),question=session.current();
  assert.equal(session.drop('number',question.count,'number').type,'placed');
  assert.equal(session.getState().completed,0);
  assert.equal(session.drop('item',question.itemKey,'item').type,'evaluate');
  assert.equal(session.settle().type,'next');
}
{
  const session=fresh(),question=session.current();
  session.drop('item',wrongItem(question),'item');
  assert.deepEqual([...session.drop('number',question.count,'number').wrong],['item']);
  assert.equal(session.settle().type,'retry');
  const state=session.getState();
  assert.equal(state.slots.item,null);
  assert.equal(state.slots.number,question.count);
  assert.equal(state.locked.number,true);
  assert.equal(state.index,0);
  assert.equal(session.drop('number',wrongNumber(question),'number').type,'occupied');
  assert.equal(session.drop('item',question.itemKey,'item').type,'evaluate');
  assert.equal(session.settle().type,'next');
}
{
  const session=fresh(),question=session.current();
  session.drop('number',wrongNumber(question),'number');
  assert.deepEqual([...session.drop('item',question.itemKey,'item').wrong],['number']);
  assert.equal(session.settle().type,'retry');
  assert.equal(session.getState().slots.item,question.itemKey);
  assert.equal(session.getState().slots.number,null);
  assert.equal(session.getState().locked.item,true);
  assert.equal(session.drop('item',wrongItem(question),'item').type,'occupied');
}
{
  const session=fresh(),question=session.current();
  session.drop('item',wrongItem(question),'item');
  assert.deepEqual([...session.drop('number',wrongNumber(question),'number').wrong],['item','number']);
  assert.equal(session.settle().type,'retry');
  assert.equal(session.getState().slots.item,null);
  assert.equal(session.getState().slots.number,null);
  assert.equal(session.getState().completed,0);
}
{
  const session=fresh();
  for(let index=0;index<5;index++) {
    const question=session.current();
    assert.equal(question.itemChoices.length,4);
    assert.equal(question.numberChoices.length,4);
    session.drop('item',question.itemKey,'item');
    assert.equal(session.drop('number',question.count,'number').type,'evaluate');
    assert.equal(session.settle().type,index===4 ? 'finished' : 'next');
  }
  assert.equal(session.getState().completed,5);
  assert.equal(session.getState().phase,'finished');
  assert.equal(session.drop('item',session.current().itemKey,'item').type,'blocked');
  assert.equal(fresh().getState().index,0);
}

console.log('PASS shopping screen/state: fifth place, two 4-card columns, two slots, input order, partial errors, lockout, double-judgment guard, five-question stop');
