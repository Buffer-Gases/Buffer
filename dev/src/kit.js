/* ================= HAND KIT: hold to explain · hold menus · swipe cards (ui-kit.md) ================= */
(function(){
const HINTS=[
 ['#hdr-xp','XP|Points from every answer, lesson, shift and Round. +2 per step, +10 for a perfect case, +40 for a Round. Levels run Student → Siggaard-Andersen.'],
 ['.lvlpill','Level|Your XP level and the bar to the next one.'],
 ['.pips','Progress|One square per step: green done, orange current.'],
 ['.sprog','Session|One segment per case: green right, red missed.'],
 ['.mono-mark','Icon|Tap the tile to open it.'],
 ['.web-n','Concept|Tap to see its links; the green square means you have done its lesson.'],
 ['.badge-tile','Badge|Won by beating a module boss, the final, a 7-day streak, 10 Rounds or reflex level 4.'],
 ['.heat','Activity|Each square is a day. Darker = more gases read.'],
 ['.est-track','Estimate|Your guess (orange) against the answer (dark) and the band that counts as close.'],
 ['.chip.hot','Streak|Days in a row with at least one gas, lesson or Round.'],
 ['.ro','Readout|Recalculates as you type. The formula is in the notes below.'],
 ['.bossrow','Boss fight|Timed questions from the whole module. 80% wins the badge and 120 XP.'],
 ['.hook','Hook|One line worth memorising. A new one each day.'],
 ['.gotd','Gas of the day|The same gas for everyone today. One careful read.']
];
function hintOf(el){const h=el.closest('[data-hint]');if(h)return h.dataset.hint.split('|');for(const [sel,txt] of HINTS){if(el.closest(sel))return txt.split('|');}const a=el.closest('[aria-label],[title]');if(a&&!a.matches('input,textarea,select'))return [a.getAttribute('aria-label')||a.getAttribute('title'),''];return null;}
let bubble=null,timer=null,swallow=false,sx0=0,sy0=0,target=null;
function showBubble(x,y,t,d){if(!bubble){bubble=document.createElement('div');bubble.className='hintbubble';bubble.setAttribute('role','tooltip');document.body.appendChild(bubble);}bubble.innerHTML='<b>'+esc(t)+'</b>'+(d?'<span>'+esc(d)+'</span>':'');bubble.style.left=Math.max(8,Math.min(innerWidth-bubble.offsetWidth-8,x-120))+'px';bubble.style.top=Math.max(bubble.offsetHeight+8,y-14)+'px';bubble.classList.add('on');try{if(navigator.vibrate)navigator.vibrate(8);}catch(e){}}
function hideBubble(){if(bubble)bubble.classList.remove('on');}
const MENUS=[
 {sel:'.mt[data-k]',items:el=>{const k=el.dataset.k,lid=KLESSON&&KLESSON[k];return [['Drill this pattern',()=>startSession('steps',{kind:k})],lid&&LBYID[lid]?['Open the lesson',()=>openLesson(lid)]:null,['Which gas fits?',()=>startSession('fit')],['Reset its review schedule',()=>{delete S.kinds[k];save();if(VIEW==='today')RENDER.today();toast('Schedule reset');}]].filter(Boolean);}},
 {sel:'.llist button[data-l]',items:el=>{const id=el.dataset.l;const n=WEB_NODES.find(x=>x[4]===id);const tb=TEACH.find(t=>t.lesson===id);return [['Open',()=>openLesson(id)],S.done[id]?['Mark as not done',()=>{delete S.done[id];save();RENDER.learn();}]:['Mark as done',()=>{S.done[id]=1;touchDay();save();RENDER.learn();}],n?['Show in the concept web',()=>{WEBSEL=n[0];go('web');}]:null,tb?['Teach it back',()=>{TB_PICK=tb.c;TB=null;go('teach');}]:null].filter(Boolean);}},
 {sel:'.tile[data-tool]',items:el=>{const id=el.dataset.tool;return [['Open',()=>openTool(id)],['Copy link',()=>copyText(location.origin+location.pathname+'#tool-'+id).then(ok=>toast(ok?'Link copied':'Clipboard blocked'))]];}},
 {sel:'.tile[data-sc]',items:el=>{const id=el.dataset.sc;return [['Play the shift',()=>openScenario(id)],(S.scen||{})[id]?['Forget my result',()=>{delete S.scen[id];save();RENDER.scen();}]:null].filter(Boolean);}},
 {sel:'.web-n',items:el=>{const n=WEB_NODES.find(x=>x[0]===el.dataset.id);if(!n)return [];const tb=TEACH.find(t=>t.c===n[0]);return [['Focus',()=>{WEBSEL=n[0];RENDER.web();}],LBYID[n[4]]?['Open the lesson',()=>openLesson(n[4])]:null,tb?['Teach it back',()=>{TB_PICK=n[0];TB=null;go('teach');}]:null].filter(Boolean);}}
];
function onDown(e){if(e.button&&e.button!==0)return;target=e.target;sx0=e.clientX;sy0=e.clientY;clearTimeout(timer);
 timer=setTimeout(()=>{if(!target)return;const m=MENUS.find(m=>target.closest(m.sel));if(m){const el=target.closest(m.sel);const items=m.items(el);if(items.length){el.classList.add('held');setTimeout(()=>el.classList.remove('held'),300);swallow=true;const t=(el.querySelector('b,h3,span:not(.mono-mark):not(.ck)')||el).textContent.trim().slice(0,48);sheet(t,items);return;}}
  const h=hintOf(target);if(h&&h[0]){swallow=true;showBubble(sx0,sy0,h[0],h[1]);}},460);}
function onMove(e){if(Math.abs(e.clientX-sx0)>10||Math.abs(e.clientY-sy0)>10)clearTimeout(timer);}
function onUp(){clearTimeout(timer);setTimeout(hideBubble,1100);}
document.addEventListener('pointerdown',onDown,{passive:true});document.addEventListener('pointermove',onMove,{passive:true});document.addEventListener('pointerup',onUp);document.addEventListener('pointercancel',onUp);
document.addEventListener('scroll',()=>clearTimeout(timer),{passive:true,capture:true});
document.addEventListener('click',e=>{if(swallow){swallow=false;e.stopPropagation();e.preventDefault();}},true);
document.addEventListener('contextmenu',e=>{if(e.target.closest(MENUS.map(m=>m.sel).join(',')+',[data-hint]'))e.preventDefault();});
/* swipe flash cards: right = got it, left = again */
let card=null,sx=0,sy=0,dx=0;
document.addEventListener('pointerdown',e=>{card=e.target.closest('.flashcard');if(!card)return;sx=e.clientX;sy=e.clientY;dx=0;});
document.addEventListener('pointermove',e=>{if(!card)return;dx=e.clientX-sx;const dy=e.clientY-sy;if(Math.abs(dx)<14||Math.abs(dy)>Math.abs(dx))return;clearTimeout(timer);card.style.transform='translateX('+dx+'px) rotate('+(dx/30)+'deg)';card.dataset.swipe=dx>0?'Got it →':'← Again';});
document.addEventListener('pointerup',()=>{if(!card)return;const c=card,d=dx;card=null;c.style.transform='';delete c.dataset.swipe;if(Math.abs(d)>90&&typeof FL!=='undefined'&&FL){swallow=true;setTimeout(()=>{swallow=false;},50);FL.swipes=(FL.swipes||0)+1;if(!FL.flipped){FL.flipped=true;RENDER.flash();setTimeout(()=>flashRate(d>0),350);}else flashRate(d>0);}});
})();
