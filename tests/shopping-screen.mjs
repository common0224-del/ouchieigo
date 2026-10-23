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
const start=html.indexOf('      const shoppingItemData=Object.freeze({');
const end=html.indexOf('      function setBreakfastSlot',start);
assert(shuffleSource && start>=0 && end>start,'Shopping state or the existing shuffle() was not found');
const fixedMath=Object.create(Math);
fixedMath.random=()=>0;
const {shoppingItemData,buildShoppingQuestions,createShoppingSession}=vm.runInNewContext(`${shuffleSource}\n${html.slice(start,end)}\n({shoppingItemData,buildShoppingQuestions,createShoppingSession})`,{Math:fixedMath});
assert.equal(Object.keys(shoppingItemData).length,13,'shopping must expose all 13 shared item icons');
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
assert.match(html,/\.shopping-card \{[^}]*-webkit-tap-highlight-color:transparent;/,'Shopping cards must suppress tap highlighting');
assert.match(html,/\.shopping-card, \.shopping-card \* \{ -webkit-user-select:none; user-select:none; \}/,'Shopping card images, numbers, and both hint labels must resist selection');
assert.match(html,/\.shopping-card-art \{[^}]*-webkit-user-drag:none;/,'Shopping card images must resist native WebKit dragging');
assert.match(html, /\.shopping-card-hint \{ position:absolute;/);
assert.match(html, /\.shopping-instruction-hint \{ position:absolute;/);
assert.match(html, /\.shopping-card-hint-en \{ display:block;/);
assert.match(html, /\.shopping-card-hint-ja \{ display:none;/);
assert.match(html, /#shopping-screen\[data-shopping-hint-step="2"\] \.shopping-card-hint-ja \{ display:block; \}/);
assert.match(html, /--shopping-hint-opacity:\.56;/);
assert.match(html, /\.shopping-card-hint-en \{[^}]*font-size:12px; font-weight:900;/);
assert.match(html, /\.shopping-card\[data-shopping-value="strawberry"\] \.shopping-card-hint-en \{ font-size:11px;/);
assert.match(html, /\.shopping-card\[data-shopping-value="chicken"\] \.shopping-card-hint-en \{ font-size:11\.5px;/);
assert.match(html, /#shopping-screen\[data-shopping-hint-step="2"\] \.shopping-card-hint \{ min-height:24px; \}/);
assert.match(html, /@media \(min-width:410px\)[^\n]*\.shopping-card-hint-ja \{ font-size:10px; \} #shopping-screen\[data-shopping-hint-step="2"\] \.shopping-card-hint \{ min-height:25px; \}/);
assert.match(html, /#shopping-screen \{[^}]*--shopping-offset-none:12px; --shopping-offset-english:5px; --shopping-visual-offset:var\(--shopping-offset-none\);/);
assert.match(html, /#shopping-screen\[data-shopping-hint-step="1"\] \{ --shopping-visual-offset:var\(--shopping-offset-english\); \}/);
assert.match(html, /#shopping-screen\[data-shopping-hint-step="2"\] \{ --shopping-visual-offset:0px; \}/);
assert.match(html, /\.shopping-column \.shopping-card-art, \.shopping-column \.shopping-card-number \{[^}]*transition:transform \.15s ease;/);
assert.match(html, /\.shopping-card\.dragging\[data-shopping-drag-hint-step="0"\] \{ --shopping-visual-offset:var\(--shopping-offset-none\); \}/);
assert.match(html, /\.shopping-card\.dragging\[data-shopping-drag-hint-step="1"\] \{ --shopping-visual-offset:var\(--shopping-offset-english\); \}/);
assert.match(html, /@media \(prefers-reduced-motion:reduce\) \{ \.shopping-column \.shopping-card-art, \.shopping-column \.shopping-card-number \{ transition:none; \} \}/);
assert.match(html, /#shopping-screen\[data-shopping-hint-step="2"\] \.shopping-instruction-ja \{ display:block; \}/);
assert.match(html, /id="shopping-instruction-en"><\/span><span class="shopping-instruction-ja"/);
assert.match(functionSource('renderShopping'),/hint\.append\(english,japanese\)/);
assert.match(html, /shoppingInstructionJapanese\.textContent=question\.japaneseInstruction/);
assert.match(html, /shoppingInstructionEnglish\.textContent=question\.englishInstruction/);
assert.match(html, /shoppingHintButton\.addEventListener\('click',\(\)=>setShoppingHintStep\(\(shoppingHintStep\+1\)%3\)\)/);
assert.match(html, /'#shopping-play-again'\)\.addEventListener\('click',\(\)=>\{ unlockAudio\(\); resetShopping\(\{clearHint:true\}\); \}\)/);
assert.match(runAll, /tests\/shopping-screen\.mjs/);
assert(!html.match(/<section class="shopping-scene"[\s\S]*?<\/section>/)?.[0].includes('wooden-tray'));
assert.match(html,/#shopping-screen \{ --shopping-card-width:68px; --shopping-card-height:74px; --shopping-card-gap:2px; --shopping-card-label-space:24px;[^}]*--shopping-column-top:16%;[\s\S]*?--shopping-slot-width:90px; --shopping-slot-height:80px;/);
assert.match(html, /@media \(min-width:380px\) \{ #shopping-screen \{ --shopping-card-width:74px; --shopping-card-height:80px; --shopping-card-gap:4px; --shopping-column-top:17%;[\s\S]*?--shopping-slot-width:93px; --shopping-slot-height:96px;/);
assert.match(html, /@media \(min-width:410px\) \{ #shopping-screen \{ --shopping-card-width:82px; --shopping-card-height:88px; --shopping-card-gap:5px; --shopping-card-label-space:25px; --shopping-offset-none:12\.5px; --shopping-offset-english:5\.5px; --shopping-column-top:17%;[\s\S]*?--shopping-slot-width:103px; --shopping-slot-height:106px;/);
assert.match(html, /@media \(max-height:640px\) \{ #shopping-screen \{ --shopping-card-height:var\(--shopping-card-width\); --shopping-card-gap:0px; --shopping-column-top:14%; \} \}/);
assert.match(html, /\.shopping-card \{[^}]*background:#fff9eb;/);
assert.match(html, /\.shopping-card \{[^}]*grid-template-rows:minmax\(0,1fr\) var\(--shopping-card-label-space\);/);
assert.match(html, /\.shopping-card-art \{[^}]*aspect-ratio:1;/);
assert.match(html, /\.shopping-column \.shopping-card-art, \.shopping-column \.shopping-card-number \{ grid-row:1; transform:translateY\(var\(--shopping-visual-offset\)\);/);
assert.match(html, /\.shopping-column \.shopping-card-art \{ width:min\(85%,calc\(var\(--shopping-card-height\) - 28px\),68px\); \}/);
assert.match(html, /\.shopping-card-number \{[^}]*line-height:1;/);
for(const [viewportWidth,viewportHeight,cardWidth,cardHeight,gap,labelSpace,columnTop,slotWidth,slotGap] of [
  [375,667,68,74,2,24,.16,90,4],
  [390,844,74,80,4,24,.17,93,6],
  [430,932,82,88,5,25,.17,103,6]
]) {
  const sceneHeight=viewportHeight-68;
  const firstTop=68+sceneHeight*columnTop;
  const lastBottom=firstTop+5*cardHeight+4*gap;
  const slotLeft=(viewportWidth-(2*slotWidth+slotGap))/2;
  const rightColumnLeft=viewportWidth-8-cardWidth;
  assert(firstTop>68 && lastBottom<=viewportHeight,`${viewportWidth}: five cards leave the screen`);
  assert(8+cardWidth<slotLeft && slotLeft+2*slotWidth+slotGap<rightColumnLeft,`${viewportWidth}: cards overlap cart slots horizontally`);
  assert(cardHeight>=cardWidth,`${viewportWidth}: cards are not square or portrait`);
  const artSize=Math.min(.85*(cardWidth-8),cardHeight-28,68);
  const visualRow=cardHeight-8-labelSpace;
  const artCenter=4+visualRow/2;
  const offsets=[labelSpace/2,(labelSpace-14)/2,0];
  assert(artSize>=44,`${viewportWidth}: item art became too small`);
  assert.equal(artCenter+offsets[0],cardHeight/2,`${viewportWidth}: no-hint illustration is not centered`);
  assert.equal(artCenter+offsets[1],cardHeight/2-7,`${viewportWidth}: English-only illustration is not raised 7px`);
  assert.equal(artCenter+offsets[2],cardHeight/2-labelSpace/2,`${viewportWidth}: bilingual illustration is not raised enough`);
  assert(artCenter+offsets[1]+artSize/2<=cardHeight-14,`${viewportWidth}: item art overlaps the English label`);
  assert(artCenter+offsets[2]+artSize/2<=cardHeight-labelSpace,`${viewportWidth}: item art overlaps the two-line label`);
  const tenSize=Math.min(41,Math.max(32,viewportWidth*.09));
  assert(artCenter+offsets[2]+tenSize/2<cardHeight-labelSpace,`${viewportWidth}: number 10 overlaps ten`);
}
assert.match(html, /\.shopping-column\.item \.shopping-card \{ border-color:#e6752d; \} \.shopping-column\.number \.shopping-card \{ border-color:#48afd3; \}/);
assert.match(html, /\.shopping-slot\[data-shopping-slot="item"\] \{ border-color:#e6752d; box-shadow:0 0 12px/);
assert.match(html, /\.shopping-slot\[data-shopping-slot="number"\] \{ border-color:#48afd3; box-shadow:0 0 12px/);
assert.match(html, /\.shopping-slot\.locked \{ border-style:solid; \}/);
assert(!html.includes('.shopping-slot.locked { border-style:solid; border-color:'),'locked slots must retain their category color');
assert.match(html, /\.shopping-card-number\[data-shopping-number="10"\] \{ font-size:clamp\(32px,9vw,41px\); \}/);
assert.match(html, /\.shopping-card-number \{[^}]*-webkit-text-stroke:1\.3px #2f4355;/);
{
  const colors=vm.runInNewContext(html.match(/const shoppingNumberColors=Object\.freeze\((\[[^;]+\])\);/)?.[1]);
  assert.equal(colors.length,10);
  assert.equal(new Set(colors).size,10,'each number needs a distinct color');
  const visual=vm.runInNewContext(`${functionSource('shoppingVisual')}\n({shoppingVisual})`,{
    shoppingNumberColors:colors,document:{createElement:()=>({dataset:{},style:{setProperty(name,value){this[name]=value;}}})}
  }).shoppingVisual;
  for(let number=1;number<=10;number++) {
    const element=visual('number',number);
    assert.equal(element.textContent,String(number));
    assert.equal(element.dataset.shoppingNumber,String(number));
    assert.equal(element.style['--shopping-number-color'],colors[number-1]);
  }
  const visualItem=vm.runInNewContext(`${functionSource('shoppingVisual')}\n({shoppingVisual})`,{
    shoppingItemData,document:{createElement:tag=>({tagName:tag,style:{}})}
  }).shoppingVisual;
  for(const [key,item] of Object.entries(shoppingItemData)) {
    const element=visualItem('item',key);
    if(item.sprite) {
      assert.equal(element.tagName,'span');
      assert.equal(element.style.backgroundImage,`url("${item.image}")`);
      assert.equal(element.style.backgroundPosition,item.sprite);
    } else {
      assert.equal(element.tagName,'img');
      assert.equal(element.src,item.image);
      assert.equal(element.draggable,false,`${key}: dynamic Shopping image must not be natively draggable`);
      assert(fs.existsSync(path.resolve(element.src)),`missing public icon for ${key}`);
    }
  }
}
for(const id of ['open-bathroom','open-breakfast','open-living','open-bedroom']) assert(html.includes(`id="${id}"`));
assert.match(html, /const listenContent=Object\.freeze\(\{bathroom:[^\n]+breakfast:[^\n]+living:[^\n]+bedroom:[^\n]+\}\);/);

{
  const attrs={};
  const shoppingScreen={dataset:{}};
  const shoppingHintButton={setAttribute:(key,value)=>{attrs[key]=value;}};
  const hint=vm.runInNewContext(`let shoppingHintStep=0;\n${functionSource('setShoppingHintStep')}\n({setShoppingHintStep,step:()=>shoppingHintStep})`,{shoppingScreen,shoppingHintButton});
  for(const [step,label,pressed] of [[0,'英語を表示','false'],[1,'日本語も表示','true'],[2,'文字を消す','true'],[0,'英語を表示','false']]) {
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
  const played=[]; let stopped=0;
  const screen={hidden:false};
  const speak=vm.runInNewContext(`${functionSource('speakShoppingCard')}\n({speakShoppingCard})`,{
    shoppingScreen:screen,shoppingItemData,
    shoppingNumberWords:['one','two','three','four','five','six','seven','eight','nine','ten'],window:{speechSynthesis:{}},
    SpeechSynthesisUtterance:class {constructor(text){this.text=text;}},voice:()=>({lang:'en-US'}),speechRate:.9,
    stopShoppingSpeech(){stopped++;},playSpeech:utterance=>played.push(utterance)
  }).speakShoppingCard;
  for(const item of Object.keys(shoppingItemData)) speak('item',item);
  for(let number=1;number<=10;number++) speak('number',number);
  assert.deepEqual(played.map(utterance=>utterance.text),[...Object.values(shoppingItemData).map(item=>item.cardEnglish),'one','two','three','four','five','six','seven','eight','nine','ten']);
  assert(played.every(utterance=>utterance._listenScene==='shopping' && utterance.rate===.9));
  assert.equal(stopped,23,'a new card word must replace a pending instruction or earlier tap');
  screen.hidden=true; speak('item','apple'); assert.equal(played.length,23,'leaving must prevent a late card word');
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
  const ctx={shoppingSession:session,shoppingScreen:{hidden:false},shoppingSpeechGeneration:0,shoppingIntroInProgress:false,
    clearTimeout:id=>timers.delete(id),setTimeout:callback=>{const id=++nextTimer; timers.set(id,callback); return id;},
    speakShopping:()=>{spoken++;}};
  const scheduler=vm.runInNewContext(`let shoppingSpeechTimer=null;\n${functionSource('scheduleShoppingSpeech')}\n({scheduleShoppingSpeech})`,ctx).scheduleShoppingSpeech;
  scheduler(); scheduler();
  assert.equal(timers.size,1,'rapid requests must coalesce into one scheduled instruction');
  timers.values().next().value();
  assert.equal(spoken,1);
}
{
  // The intro must finish before the first question, and a stopped generation
  // must never enqueue a stale question after a reset or screen exit.
  const timers=new Map(),played=[],spoken=[];
  let nextTimer=0;
  const session={getState:()=>({index:0}),current:()=>({englishInstruction:'Get three apples.'})};
  const screen={hidden:false};
  const ctx={shoppingSession:session,shoppingScreen:screen,activeUtterance:null,
    window:{speechSynthesis:{speaking:false}},voice:()=>({lang:'en-US'}),speechRate:.9,
    SpeechSynthesisUtterance:class {constructor(text){this.text=text;}},
    setTimeout(fn,delay){const id=++nextTimer;timers.set(id,{fn,delay});return id;},clearTimeout(id){timers.delete(id);},
    playSpeech(utterance){ctx.activeUtterance=utterance;played.push(utterance);},
    speakShopping(){spoken.push(session.current().englishInstruction);},
    stopSpeech(){ctx.activeUtterance=null;},shoppingSpeaker:{setAttribute(){}},logSpeech(){} };
  const api=vm.runInNewContext(`let shoppingSpeechTimer=null,shoppingIntroTimer=null,shoppingIntroInProgress=false,shoppingSpeechGeneration=0;
    ${functionSource('scheduleShoppingSpeech')}
    ${functionSource('scheduleShoppingIntro')}
    ${functionSource('stopShoppingSpeech')}
    ({scheduleShoppingSpeech,scheduleShoppingIntro,stopShoppingSpeech,active:()=>shoppingIntroInProgress})`,ctx);
  const fire=()=>{const [id,timer]=timers.entries().next().value || [];assert(timer,'missing speech timer');timers.delete(id);timer.fn();return timer.delay;};
  api.scheduleShoppingIntro(0);api.scheduleShoppingIntro(0);
  assert.equal(timers.size,1,'rapid game starts must keep only one intro reservation');
  fire();
  assert.equal(played.length,1);
  assert.equal(played[0].text,"Let's go to the grocery store!");
  assert.equal(spoken.length,0,'the first question must not interrupt the intro');
  api.scheduleShoppingSpeech(0);
  assert.equal(spoken.length,0,'question changes during the intro must wait');
  played[0].onend();
  assert.equal(api.active(),false);
  assert.equal(spoken.length,0,'the question must start only after the intro completion');
  assert.equal(fire(),180);
  assert.deepEqual(spoken,['Get three apples.']);

  api.stopShoppingSpeech();
  api.scheduleShoppingIntro(0);fire();
  const oldIntro=played.at(-1);
  api.stopShoppingSpeech();
  oldIntro.onend();
  assert.equal(timers.size,0,'a stopped intro must not schedule an old question');
  assert.equal(spoken.length,1);

  api.scheduleShoppingIntro(0);fire();
  const leavingIntro=played.at(-1);
  screen.hidden=true;api.stopShoppingSpeech();leavingIntro.onend();
  assert.equal(timers.size,0,'leaving the shopping screen must invalidate its intro');
  screen.hidden=false;

  api.scheduleShoppingIntro(0);fire();
  const failedIntro=played.at(-1);
  failedIntro.onerror();
  assert.equal(fire(),180,'an audio error must not block the question or game');
  assert.equal(spoken.length,2);
  assert.match(functionSource('resetShopping'),/scheduleShoppingIntro\(speechDelay\)/);
  assert.match(functionSource('leaveShopping'),/stopShoppingSpeech\(\)/);
}
{
  let generated=0,stopped=0,rendered=0,scheduled=0,cleared=0,hiddenCats=0;
  const ctx={shoppingDrag:null,shoppingTransitionTimer:null,shoppingSession:null,shoppingStatus:{textContent:'old'},
    cancelShoppingDrag:()=>{},clearTimeout:()=>{},stopShoppingSpeech:()=>{stopped++;},
    setShoppingHintStep:()=>{cleared++;},buildShoppingQuestions:()=>{generated++; return Array(5);},
    createShoppingSession:questions=>({questions}),renderShopping:()=>{rendered++;},hideShoppingCorrectCat:()=>{hiddenCats++;},scheduleShoppingIntro:()=>{scheduled++;}};
  const reset=vm.runInNewContext(`${functionSource('resetShopping')}\n({resetShopping})`,ctx).resetShopping;
  reset(); reset({clearHint:true});
  assert.equal(generated,2,'reset and Play again must each generate five new questions');
  assert.equal(stopped,2,'reset must stop the previous instruction');
  assert.equal(rendered,2);
  assert.equal(scheduled,2);
  assert.equal(hiddenCats,2,'reset and Play again must hide any previous cat toast');
  assert.equal(cleared,1,'Play again resets hints while ordinary reset retains them');
  assert.equal(ctx.shoppingStatus.textContent,'');
  assert.match(functionSource('leaveShopping'),/stopShoppingSpeech\(\); hideShoppingCorrectCat\(\); setShoppingHintStep\(0\)/);
  assert.match(html, /function backToPlaces\(\) \{ stopSpeech\(\); leaveShopping\(\);/);
  assert.match(html, /function returnHome\(\) \{ stopSpeech\(\); leaveShopping\(\);/);
}

{
  // Reuse the existing Listen & Do cat toast for complete answers 1–4 only.
  const finishSource=functionSource('finishShoppingDrag').split("\n      window.addEventListener")[0];
  function evaluateQuestion(index,{wrong=false,partial=false}={}) {
    const session=fresh();
    for(let done=0;done<index;done++) {
      const q=session.current(); session.drop('item',q.itemKey,'item'); session.drop('number',q.count,'number'); session.settle();
    }
    const q=session.current();
    const shows=[],hides=[],timers=[];
    const ctx={shoppingDrag:null,shoppingSession:session,shoppingScreen:{hidden:false},shoppingStatus:{textContent:''},shoppingTransitionTimer:null,
      shoppingSlots:{item:{classList:{add(){}}},number:{classList:{add(){}}}},
      shoppingDropSlotForCard:(card,kind)=>kind,shoppingDragGeometry:()=>({}),recordShoppingDrag(){},cancelShoppingDrag(){ctx.shoppingDrag=null;},
      renderShopping(){},wrongSound(){ctx.wrong=(ctx.wrong||0)+1;},correctSound(){ctx.correct=(ctx.correct||0)+1;},
      showShoppingCorrectCat(){shows.push(true);},hideShoppingCorrectCat(){hides.push(true);},scheduleShoppingSpeech(){},
      stopShoppingSpeech(){},finishSound(){ctx.finished=(ctx.finished||0)+1;},
      setTimeout(fn,delay){timers.push({fn,delay});return timers.length;}};
  const finish=vm.runInNewContext(`${functionSource('updateShoppingDragPosition')}\n${finishSource}\n({finishShoppingDrag})`,ctx).finishShoppingDrag;
    const drop=(kind,value)=>{
      ctx.shoppingDrag={card:{style:{}},id:1,kind,value,startX:0,startY:0,finalized:false};
      finish({type:'pointerup',pointerId:1,clientX:0,clientY:0});
    };
    if(wrong) session.drop('item',wrongItem(q),'item');
    else drop('item',q.itemKey);
    if(partial) return {session,shows,hides,timers,ctx,drop,q};
    drop('number',q.count);
    return {session,shows,hides,timers,ctx,drop,q};
  }
  const partial=evaluateQuestion(0,{partial:true});
  assert.equal(partial.shows.length,0,'one correct slot must not show the cat');
  assert.equal(partial.timers.length,0,'one correct slot must not advance');
  partial.drop('number',partial.q.count);
  assert.equal(partial.shows.length,1);
  for(let index=0;index<5;index++) {
    const result=evaluateQuestion(index);
    assert.equal(result.ctx.correct,1);
    assert.equal(result.shows.length,index<4 ? 1 : 0,`question ${index+1}: cat must appear only before the final question`);
    assert.equal(result.session.getState().index,index,'the question must not advance before the animation');
    assert.equal(result.timers.length,1);
    assert.equal(result.timers[0].delay,index<4 ? 1300 : 600);
    result.timers[0].fn();
    assert.equal(result.hides.length,1);
    if(index<4) assert.equal(result.session.getState().index,index+1);
    else { assert.equal(result.session.getState().phase,'finished');assert.equal(result.ctx.finished,1); }
  }
  const wrong=evaluateQuestion(0,{wrong:true});
  assert.equal(wrong.shows.length,0,'wrong answers must not show the cat');
  assert.equal(wrong.ctx.wrong,1);
  assert.equal(wrong.timers[0].delay,700);
  assert.match(html, /id="shopping-toast"/);
  assert.match(html, /\.toast::before, \.breakfast-toast::before, \.living-toast::before[^\n]+cat-mascot-v2-small\.png\.webp/);
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
    assert.equal(question.itemChoices.length,5);
    assert.equal(question.numberChoices.length,5);
    session.drop('item',question.itemKey,'item');
    assert.equal(session.drop('number',question.count,'number').type,'evaluate');
    assert.equal(session.settle().type,index===4 ? 'finished' : 'next');
  }
  assert.equal(session.getState().completed,5);
  assert.equal(session.getState().phase,'finished');
  assert.equal(session.drop('item',session.current().itemKey,'item').type,'blocked');
  assert.equal(fresh().getState().index,0);
}

{
  // The release pointer is outside the item slot, but the visibly translated
  // card center is inside it because the child grabbed the card near its edge.
  const rect=(left,top,right,bottom)=>({left,top,right,bottom});
  const itemSlot={getBoundingClientRect:()=>rect(125,110,145,150)};
  const numberSlot={getBoundingClientRect:()=>rect(300,110,390,150)};
  let reads=0,dropCalls=0,rendered=0,dropOutcome={type:'placed'};
  const geometryEvents=[];
  const diagnosticRecords=[];
  const card={style:{transform:''},getBoundingClientRect(){
    reads++;
    geometryEvents.push('card-rect');
    const match=this.style.transform.match(/translate\((-?[\d.]+)px,(-?[\d.]+)px\)/);
    const dx=match ? Number(match[1]) : 0,dy=match ? Number(match[2]) : 0;
    return rect(100+dx,100+dy,168+dx,158+dy);
  }};
  const ctx={shoppingSlots:{item:itemSlot,number:numberSlot},shoppingScreen:{hidden:false},SPEECH_DEBUG:true,
    shoppingSession:{drop(kind,value,slot){dropCalls++; assert.equal(kind,'item'); assert.equal(value,'apple'); assert.equal(slot,'item'); return dropOutcome;}},
    shoppingDrag:{card,id:1,kind:'item',value:'apple',startX:110,startY:120,finalized:false},
    recordShoppingDrag(stage,drag,details){diagnosticRecords.push({stage,details});},
    cancelShoppingDrag(){geometryEvents.push('reset-transform'); card.style.transform=''; ctx.shoppingDrag=null;},renderShopping(){rendered++;}};
  // The pointer starts at x=110 near the card's left edge. At release x=110,
  // its center x=134 is inside the slot even though the pointer itself is out.
  // At release x=135 the card moves 25px; its center x=159 is outside.
  const finishSource=functionSource('finishShoppingDrag').split("\n      window.addEventListener")[0];
  const code=`${functionSource('shoppingDropSlotForCard')}\n${functionSource('shoppingDragGeometry')}\n${functionSource('updateShoppingDragPosition')}\n${finishSource}\n({shoppingDropSlotForCard,finishShoppingDrag})`;
  const api=vm.runInNewContext(code,ctx);
  assert.equal(api.shoppingDropSlotForCard(card,'item'),'item');
  assert.equal(api.shoppingDropSlotForCard(card,'number'),null,'wrong-kind slot must not accept the card');
  geometryEvents.length=0;
  api.finishShoppingDrag({type:'pointerup',pointerId:1,clientX:110,clientY:120});
  assert.equal(dropCalls,1,'card center, not the pointer, must decide the drop');
  assert.equal(rendered,1);
  assert(reads>0,'the displayed card rectangle must be read before transform reset');
  assert(geometryEvents.indexOf('card-rect')>=0 && geometryEvents.indexOf('card-rect')<geometryEvents.indexOf('reset-transform'),'read transformed geometry before clearing it');
  assert.equal(diagnosticRecords.at(-1).details.outcome,'accepted');
  assert.equal(diagnosticRecords.at(-1).details.centerInside,true);
  assert(diagnosticRecords.at(-1).details.slotRect,'the slot rectangle must be logged');
  assert.equal(card.style.transform,'');
  ctx.shoppingDrag={card,id:2,kind:'item',value:'apple',startX:110,startY:120,finalized:false};
  api.finishShoppingDrag({type:'pointerup',pointerId:2,clientX:135,clientY:120});
  assert.equal(dropCalls,1,'a card centered outside must return even when close to a slot');
  assert.equal(diagnosticRecords.at(-1).details.outcome,'outside');
  assert.equal(diagnosticRecords.at(-1).details.centerInside,false);
  ctx.shoppingDrag={card,id:3,kind:'number',value:2,startX:110,startY:120,finalized:false};
  api.finishShoppingDrag({type:'pointerup',pointerId:3,clientX:110,clientY:120});
  assert.equal(dropCalls,1,'a number dragged over the item slot must be rejected');
  assert.equal(diagnosticRecords.at(-1).details.outcome,'outside');
  ctx.shoppingDrag={card,id:4,kind:'item',value:'apple',startX:110,startY:120,finalized:false};
  api.finishShoppingDrag({type:'pointercancel',pointerId:4,clientX:110,clientY:120},true);
  assert.equal(dropCalls,1,'pointercancel must not drop a card');
  assert.equal(diagnosticRecords.at(-1).details.outcome,'not-judged');
  ctx.shoppingDrag={card,id:5,kind:'item',value:'apple',startX:110,startY:120,finalized:false};
  dropOutcome={type:'occupied'};
  api.finishShoppingDrag({type:'pointerup',pointerId:5,clientX:110,clientY:120});
  assert.equal(dropCalls,2,'a centered card still reaches state management');
  assert.equal(rendered,1,'diagnostics must not render a rejected drop');
  assert.equal(diagnosticRecords.at(-1).details.outcome,'state-rejected');
  assert.equal(diagnosticRecords.at(-1).details.reason,'occupied');
  ctx.SPEECH_DEBUG=false;
  ctx.recordShoppingDrag=()=>{};
  dropOutcome={type:'placed'};
  ctx.shoppingDrag={card,id:6,kind:'item',value:'apple',startX:110,startY:120,finalized:false};
  api.finishShoppingDrag({type:'pointerup',pointerId:6,clientX:110,clientY:120});
  assert.equal(dropCalls,3,'a normal-mode drop must reach state management just like debug mode');
  assert.equal(rendered,2,'diagnostics must not change the accepted drop result');
  assert.match(functionSource('leaveShopping'),/cancelShoppingDrag\('leave-shopping'\)/,'leaving must clear an active drag');
  assert.match(functionSource('resetShopping'),/cancelShoppingDrag\('reset'\)/,'reset must clear an active drag');
  assert.match(html,/lostpointercapture',handleShoppingLostCapture/);
  assert.match(html,/window\.addEventListener\('blur',\(\)=>cancelShoppingDrag\('window-blur'\)\)/);
}

{
  assert.match(html,/SPEECH_DEBUG=urlOptions\.get\('debug'\)==='1'/,'?debug=1 must enable the existing diagnostics');
  assert.match(html,/function initSpeechDebug\(\)[\s\S]*?initShoppingDragDebug\(panel\)/,'shopping diagnostics must use the existing debug panel');
  assert.match(html,/function showShoppingDragDebug\(show\) \{ if\(SPEECH_DEBUG && speechDebugPanel\)/,'normal play must not show shopping diagnostics');
  assert.match(html,/function openShopping\(\)[^\n]*showShoppingDragDebug\(true\)/);
  assert.match(html,/function leaveShopping\(\)[^\n]*showShoppingDragDebug\(false\)/);
  assert.match(functionSource('initShoppingDragDebug'),/shoppingDragDebugEntries\.map\(entry=>JSON\.stringify\(entry\)\)/,'copy must include the shopping operation log');
  const panel={classList:{active:null,toggle(name,value){assert.equal(name,'shopping-active');this.active=value;}}},speechLog={hidden:false};
  const display=enabled=>vm.runInNewContext(`${functionSource('showShoppingDragDebug')}\n({showShoppingDragDebug})`,{
    SPEECH_DEBUG:enabled,speechDebugPanel:panel,speechDebugLog:speechLog
  }).showShoppingDragDebug;
  display(false)(true); assert.equal(panel.classList.active,null,'normal play must not expose the panel');
  display(true)(true); assert.equal(panel.classList.active,true); assert.equal(speechLog.hidden,true);
  display(true)(false); assert.equal(panel.classList.active,false); assert.equal(speechLog.hidden,false);
  const create=enabled=>vm.runInNewContext(`
    let shoppingDragDebugSummary={textContent:''},shoppingDragDebugLast={textContent:''},shoppingDragDebugFailure=null;
    const shoppingDragDebugEntries=[];
    ${functionSource('recordShoppingDrag')}
    ({recordShoppingDrag,entries:shoppingDragDebugEntries,lastFailure:()=>shoppingDragDebugFailure,summary:shoppingDragDebugSummary})
  `,{SPEECH_DEBUG:enabled,appendDebugLine:()=>{}});
  const normal=create(false);
  normal.recordShoppingDrag('finish',{kind:'item',value:'apple',diagnosticId:1},{outcome:'outside'});
  assert.equal(normal.entries.length,0,'normal play must not collect a shopping log');
  const debug=create(true),drag={kind:'number',value:7,diagnosticId:2,grab:{x:8,y:12}};
  debug.recordShoppingDrag('finish',drag,{event:'pointerup',outcome:'outside',pointer:{x:120,y:310},cardCenter:{x:145,y:325},slotRect:{left:150,top:300,right:240,bottom:380},centerInside:false});
  assert.equal(debug.entries[0].grab.x,8);
  assert.equal(debug.entries[0].centerInside,false);
  assert.equal(debug.lastFailure().outcome,'outside');
  debug.recordShoppingDrag('finish',drag,{event:'pointerup',outcome:'accepted',reason:'placed',centerInside:true});
  assert.equal(debug.lastFailure().outcome,'outside','success must not erase the last failure');
  debug.recordShoppingDrag('finish',drag,{event:'pointerup',outcome:'state-rejected',reason:'occupied',centerInside:true});
  assert.equal(debug.lastFailure().reason,'occupied');
  debug.recordShoppingDrag('cancel',drag,{event:'pointermove-buttons-zero',outcome:'cancelled',reason:'pointermove-buttons-zero'});
  assert.equal(debug.lastFailure().outcome,'cancelled');
  assert.match(debug.summary.textContent,/直近失敗: cancelled/);
  debug.recordShoppingDrag('cancel',drag,{event:'capture-end-timeout',outcome:'timed-out',reason:'capture-end-timeout'});
  assert.equal(debug.lastFailure().outcome,'timed-out','a timeout must remain visible in debug mode');
  const cancelRecords=[];
  const card={dataset:{shoppingDragHintStep:'1'},style:{transform:'translate(20px,0px)'},classList:{remove:()=>{}},hasPointerCapture:()=>false};
  const ctx={shoppingDrag:{card,id:3,kind:'item',value:'apple',finalized:false},shoppingDragGeometry:()=>({cardCenter:{x:90,y:200}}),recordShoppingDrag:(...args)=>cancelRecords.push(args)};
  vm.runInNewContext(`${functionSource('cancelShoppingDrag')}\ncancelShoppingDrag('window-blur')`,ctx);
  assert.equal(cancelRecords[0][2].reason,'window-blur');
  assert.equal(cancelRecords[0][2].outcome,'cancelled');
  assert.equal(ctx.shoppingDrag,null);
  assert.equal(card.dataset.shoppingDragHintStep,undefined,'drag hint stage must clear on cancellation');
  const starts=[];
  const dragCard={dataset:{shoppingKind:'item',shoppingValue:'apple'},classList:{add:()=>{}},
    getBoundingClientRect:()=>({left:10,top:20,right:78,bottom:78}),setPointerCapture:()=>{}};
  const startCtx={SPEECH_DEBUG:true,shoppingHintStep:2,shoppingDrag:null,shoppingDragDebugSequence:0,
    shoppingSession:{getState:()=>({phase:'ready'})},unlockAudio:()=>{},recordShoppingDrag:(...args)=>starts.push(args)};
  vm.runInNewContext(`${functionSource('startShoppingDrag')}\nstartShoppingDrag({button:0,type:'pointerdown',pointerId:7,clientX:24,clientY:36,currentTarget:dragCard,preventDefault:()=>{}})`,{...startCtx,dragCard});
  // The VM sandbox receives a shallow copy; inspect its captured record.
  assert.equal(starts[0][1].grab.x,14,'the grab offset must be relative to the card left edge');
  assert.equal(starts[0][1].grab.y,16,'the grab offset must be relative to the card top edge');
  assert.equal(dragCard.dataset.shoppingDragHintStep,'2','drag freezes the hint position active at pointerdown');
}

{
  // Exercise the actual event handlers with controlled pointer order and timers.
  // No browser is needed: card and slot rectangles are in the same viewport coordinates.
  function dragHarness(kind='item',asTap=false) {
    const rect=(left,top,right,bottom)=>({left,top,right,bottom});
    const baseLeft=kind==='item' ? 100 : 270;
    const startX=baseLeft+10,startY=120;
    const timers=new Map(),listeners=new Set(),records=[],spoken=[];
    let timerId=0,dropCalls=0,renders=0,captured=false;
    const card={dataset:{shoppingKind:kind,shoppingValue:kind==='item' ? 'apple' : '3'},style:{transform:''},classList:{add(){},remove(){}},
      getBoundingClientRect(){
        const match=this.style.transform.match(/translate\((-?[\d.]+)px,(-?[\d.]+)px\)/);
        const dx=match ? Number(match[1]) : 0,dy=match ? Number(match[2]) : 0;
        return rect(baseLeft+dx,100+dy,baseLeft+68+dx,158+dy);
      },setPointerCapture(){captured=true;},hasPointerCapture(){return captured;},releasePointerCapture(){captured=false;}};
    const ctx={shoppingHintStep:0,shoppingDrag:null,shoppingScreen:{hidden:false},shoppingSlots:{
      item:{getBoundingClientRect:()=>rect(125,110,145,150)},number:{getBoundingClientRect:()=>rect(295,110,315,150)}},
      shoppingSession:{getState:()=>({phase:'ready'}),drop(cardKind,value,slotKind){
        dropCalls++; assert.equal(cardKind,kind); assert.equal(slotKind,kind);
        assert.equal(value,kind==='item' ? 'apple' : 3); return {type:'placed'};
      }},SPEECH_DEBUG:true,shoppingDragDebugSequence:0,unlockAudio(){},renderShopping(){renders++;},
      speakShoppingCard(cardKind,value){spoken.push([cardKind,value]);},
      recordShoppingDrag(stage,drag,details){records.push({stage,details});},
      window:{addEventListener(name,listener){assert.equal(name,'pointermove');listeners.add(listener);},
        removeEventListener(name,listener){assert.equal(name,'pointermove');listeners.delete(listener);}},
      setTimeout(fn,delay){const id=++timerId;timers.set(id,{fn,delay});return id;},clearTimeout(id){timers.delete(id);}};
    const finishSource=functionSource('finishShoppingDrag').split("\n      window.addEventListener")[0];
    const sources=['shoppingDragGeometry','cancelShoppingDrag','startShoppingDrag','updateShoppingDragPosition','moveShoppingDrag',
      'scheduleShoppingCaptureEnd','handleShoppingLostCapture','shoppingDropSlotForCard'].map(functionSource);
    const api=vm.runInNewContext(`${sources.join('\n')}\n${finishSource}\n({startShoppingDrag,moveShoppingDrag,handleShoppingLostCapture,finishShoppingDrag,cancelShoppingDrag})`,ctx);
    api.startShoppingDrag({type:'pointerdown',button:0,pointerId:1,clientX:startX,clientY:startY,currentTarget:card,preventDefault(){}});
    // These cases exercise drop recovery, not a tap on the card.
    if(!asTap) ctx.shoppingDrag.tapCandidate=false;
    const event=(type,buttons,clientX=startX,clientY=startY)=>({type,buttons,pointerId:1,clientX,clientY});
    return {api,ctx,event,timers,listeners,records,spoken,card,
      dropCalls:()=>dropCalls,renders:()=>renders,
      fireTimer(){const [id,timer]=timers.entries().next().value || [];assert(timer,'expected a pending timer');timers.delete(id);timer.fn();return timer.delay;}};
  }

  for(const kind of ['item','number']) {
    const expectedValue=kind==='item' ? 'apple' : 3;
    const tap=dragHarness(kind,true);
    tap.api.finishShoppingDrag(tap.event('pointerup',0));
    assert.deepEqual(tap.spoken,[[kind,expectedValue]],`${kind}: tap must speak its own card`);
    assert.equal(tap.dropCalls(),0,`${kind}: tap must not enter a slot`);
    tap.api.finishShoppingDrag(tap.event('pointerup',0));
    assert.equal(tap.spoken.length,1,`${kind}: late pointerup must not speak twice`);

    const shortMove=dragHarness(kind,true);
    shortMove.api.moveShoppingDrag(shortMove.event('pointermove',1,shortMove.event('pointermove',1).clientX+5));
    shortMove.api.finishShoppingDrag(shortMove.event('pointerup',0,shortMove.event('pointerup',0).clientX+5));
    assert.equal(shortMove.spoken.length,1,`${kind}: a short movement is still a tap`);
    assert.equal(shortMove.dropCalls(),0);

    const returnedDrag=dragHarness(kind,true);
    returnedDrag.api.moveShoppingDrag(returnedDrag.event('pointermove',1,returnedDrag.event('pointermove',1).clientX+18));
    returnedDrag.api.moveShoppingDrag(returnedDrag.event('pointermove',1));
    returnedDrag.api.finishShoppingDrag(returnedDrag.event('pointerup',0));
    assert.equal(returnedDrag.spoken.length,0,`${kind}: returning to the start must not turn a drag into a tap`);
    assert.equal(returnedDrag.dropCalls(),1);

    const cancelledTap=dragHarness(kind,true);
    cancelledTap.api.finishShoppingDrag(cancelledTap.event('pointercancel',0),true);
    assert.equal(cancelledTap.spoken.length,0,`${kind}: pointercancel must not speak`);

    const leftDuringTap=dragHarness(kind,true);
    leftDuringTap.ctx.shoppingScreen.hidden=true;
    leftDuringTap.api.cancelShoppingDrag('leave-shopping');
    leftDuringTap.api.finishShoppingDrag(leftDuringTap.event('pointerup',0));
    assert.equal(leftDuringTap.spoken.length,0,`${kind}: leaving must not speak`);

    const normal=dragHarness(kind);
    normal.api.finishShoppingDrag(normal.event('pointerup',0));
    assert.equal(normal.dropCalls(),1,`${kind}: normal pointerup must drop`);
    assert.equal(normal.spoken.length,0,`${kind}: dropping must not speak`);
    normal.api.handleShoppingLostCapture(normal.event('lostpointercapture',0));
    normal.api.finishShoppingDrag(normal.event('pointerup',0));
    assert.equal(normal.dropCalls(),1,`${kind}: delayed events must not drop twice`);

    const recovered=dragHarness(kind);
    recovered.api.handleShoppingLostCapture(recovered.event('lostpointercapture',1));
    assert.equal(recovered.dropCalls(),0,`${kind}: capture loss alone must not drop`);
    assert.equal(recovered.listeners.size,1,`${kind}: window tracking must start`);
    assert.equal([...recovered.timers.values()][0].delay,2000);
    recovered.api.finishShoppingDrag(recovered.event('pointerup',0));
    assert.equal(recovered.dropCalls(),1,`${kind}: pointerup after capture loss must drop`);
    assert.equal(recovered.timers.size,0,`${kind}: pointerup must clear the timeout`);
    assert.equal(recovered.listeners.size,0,`${kind}: pointerup must stop window tracking`);
    assert.equal(recovered.records.at(-1).details.recovery,'pointerup-after-capture-loss');

    const released=dragHarness(kind);
    released.api.handleShoppingLostCapture(released.event('lostpointercapture',1));
    released.api.moveShoppingDrag(released.event('pointermove',0));
    assert.equal(released.dropCalls(),0,`${kind}: buttons=0 alone must not drop`);
    assert.equal([...released.timers.values()][0].delay,120);
    released.api.finishShoppingDrag(released.event('pointerup',0));
    assert.equal(released.dropCalls(),1,`${kind}: pointerup during the short wait must drop`);

    const earlyZero=dragHarness(kind);
    earlyZero.api.moveShoppingDrag(earlyZero.event('pointermove',0));
    assert.equal(earlyZero.dropCalls(),0,`${kind}: buttons=0 before capture loss must not drop`);
    assert.equal([...earlyZero.timers.values()][0].delay,120);
    earlyZero.api.handleShoppingLostCapture(earlyZero.event('lostpointercapture',0));
    earlyZero.api.finishShoppingDrag(earlyZero.event('pointerup',0));
    assert.equal(earlyZero.dropCalls(),1,`${kind}: pointerup after both events must drop once`);

    const resumed=dragHarness(kind);
    resumed.api.moveShoppingDrag(resumed.event('pointermove',0));
    resumed.api.moveShoppingDrag(resumed.event('pointermove',1));
    assert.equal(resumed.timers.size,0,`${kind}: continued drag must clear an unconfirmed release`);
    resumed.api.finishShoppingDrag(resumed.event('pointerup',0));
    assert.equal(resumed.dropCalls(),1);

    const cancelled=dragHarness(kind);
    cancelled.api.handleShoppingLostCapture(cancelled.event('lostpointercapture',0));
    cancelled.api.finishShoppingDrag(cancelled.event('pointercancel',0),true);
    assert.equal(cancelled.dropCalls(),0,`${kind}: pointercancel must take priority`);
    assert.equal(cancelled.timers.size,0);
    assert.equal(cancelled.records.at(-1).details.outcome,'not-judged');

    const timedOut=dragHarness(kind);
    timedOut.api.handleShoppingLostCapture(timedOut.event('lostpointercapture',1));
    assert.equal(timedOut.fireTimer(),2000);
    assert.equal(timedOut.dropCalls(),0,`${kind}: no release event must time out without dropping`);
    assert.equal(timedOut.records.at(-1).details.outcome,'timed-out');
    timedOut.api.finishShoppingDrag(timedOut.event('pointerup',0));
    assert.equal(timedOut.dropCalls(),0,`${kind}: a late pointerup must be ignored`);

    const outside=dragHarness(kind);
    outside.api.finishShoppingDrag(outside.event('pointerup',0,outside.event('pointerup',0).clientX+35));
    assert.equal(outside.dropCalls(),0,`${kind}: card center outside the slot must not drop`);
    assert.equal(outside.records.at(-1).details.outcome,'outside');

    const leaving=dragHarness(kind);
    leaving.api.handleShoppingLostCapture(leaving.event('lostpointercapture',0));
    leaving.api.cancelShoppingDrag('leave-shopping');
    assert.equal(leaving.dropCalls(),0,`${kind}: leaving must not drop`);
    assert.equal(leaving.timers.size,0);
    assert.equal(leaving.listeners.size,0);
  }
  const timeoutAfterZero=dragHarness('item');
  timeoutAfterZero.api.moveShoppingDrag(timeoutAfterZero.event('pointermove',0));
  assert.equal(timeoutAfterZero.fireTimer(),120);
  assert.equal(timeoutAfterZero.dropCalls(),0,'buttons=0 without pointerup must end safely');
  assert.equal(timeoutAfterZero.records.at(-1).details.reason,'capture-end-timeout');

  const cancelledBeforeCaptureLoss=dragHarness('item');
  cancelledBeforeCaptureLoss.api.finishShoppingDrag(cancelledBeforeCaptureLoss.event('pointercancel',0),true);
  cancelledBeforeCaptureLoss.api.handleShoppingLostCapture(cancelledBeforeCaptureLoss.event('lostpointercapture',0));
  assert.equal(cancelledBeforeCaptureLoss.dropCalls(),0,'late capture loss after cancel must be ignored');
}

console.log('PASS shopping screen/state: five-card columns, tap speech, center-point drops, debug diagnostics, and capture-loss event recovery');
