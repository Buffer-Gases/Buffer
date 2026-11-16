/* ================= HAND KIT: hold to explain · hold menus · swipe cards (ui-kit.md) ================= */
(function(){
const HINTS=[
 ['#hdr-xp','XP|Points from every answer, lesson, shift and Round. +2 per step, +10 for a perfect case, +40 for a Round. Levels run Student → Siggaard-Andersen.'],
 ['.lvlpill','Level|Your XP level and the bar to the next one.'],
 ['.pips','Progress|One square per step: green done, orange current.'],
 ['.sprog','Session|One segment per case: green right, red missed.'],
 ['.mono-mark','Icon|Tap the tile to open it.'],
 ['.web-n','Concept|Tap to see its links; the green square means you have done its lesson.'],
 /* a hint may be a function, so it can follow Quiet mode (no XP or badge talk when S.quiet is on: T23-13) */
 ['.badge-tile',()=>qw('Badge|Won by beating a module boss, the final, a 7-day streak, 10 Rounds or reflex level 4.','Badge|Earned by passing a module check, the final, a 7-day streak, 10 Rounds or reflex level 4.')],
 ['.heat','Activity|Each square is a day. Stronger colour = more gases read.'],
 ['.est-track','Estimate|Your guess (orange) against the answer (dark) and the band that counts as close.'],
 ['.chip.hot','Streak|Days in a row with at least one gas, lesson or Round.'],
 ['.ro','Readout|Recalculates as you type. The formula is in the notes below.'],
 ['.bossrow',()=>qw('Boss fight|Timed questions from the whole module. 80% wins the badge and 120 XP.','Module check|Timed questions from the whole module. 80% passes.')],
 ['.hook','Hook|One line worth memorising. A new one each day.'],
 ['.gotd','Gas of the day|The same gas for everyone today. One careful read.']
];
function kitHint(el){const h=el.closest('[data-hint]');if(h)return h.dataset.hint.split('|');for(const [sel,txt] of HINTS){if(el.closest(sel))return (typeof txt==='function'?txt():txt).split('|');}return null;}
function hintOf(el){const k=kitHint(el);if(k)return k;const a=el.closest('[aria-label],[title]');if(a&&!a.matches('input,textarea,select'))return [a.getAttribute('aria-label')||a.getAttribute('title'),''];return null;}
let bubble=null,timer=null,swallow=false,sx0=0,sy0=0,target=null;
function showBubble(x,y,t,d,still){if(!bubble){bubble=document.createElement('div');bubble.className='hintbubble';bubble.id='kitHint';bubble.setAttribute('role','tooltip');document.body.appendChild(bubble);}bubble.innerHTML='<b>'+esc(t)+'</b>'+(d?'<span>'+esc(d)+'</span>':'');bubble.style.left=Math.max(8,Math.min(innerWidth-bubble.offsetWidth-8,x-120))+'px';bubble.style.top=Math.max(bubble.offsetHeight+8,y-14)+'px';bubble.classList.add('on');try{if(!still&&navigator.vibrate)navigator.vibrate(8);}catch(e){}}
function hideBubble(){if(bubble)bubble.classList.remove('on');}
const MENUS=[
 {sel:'.mt[data-k]',items:el=>{const k=el.dataset.k,lid=KLESSON&&KLESSON[k];return [['Drill this pattern',()=>startSession('steps',{kind:k})],lid&&LBYID[lid]?['Open the lesson',()=>openLesson(lid)]:null,['Which gas fits?',()=>startSession('fit')],['Reset its review schedule',()=>{delete S.kinds[k];save();if(VIEW==='today')RENDER.today();toast('Schedule reset');}]].filter(Boolean);}},
 {sel:'.llist button[data-l]',items:el=>{const id=el.dataset.l;const n=WEB_NODES.find(x=>x[4]===id);
   /* a lesson can hold several teach-back prompts (nderived: anion gap and Δ ratio): one item each (T18-42) */
   const tbs=TEACH.filter(t=>t.lesson===id),tbName=c=>((WEB_NODES.find(x=>x[0]===c)||[])[1]||c);
   const tbItems=tbs.map(t=>[tbs.length>1?'Teach it back: '+tbName(t.c):'Teach it back',()=>{TB_PICK=t.c;TB=null;go('teach');}]);
   return [['Open',()=>openLesson(id)],S.done[id]?['Mark as not done',()=>{delete S.done[id];save();RENDER.learn();}]:['Mark as done',()=>{S.done[id]=Date.now();touchDay();save();RENDER.learn();}],n?['Show in the concept web',()=>{WEBSEL=n[0];go('web');}]:null,...tbItems].filter(Boolean);}},
 {sel:'.tile[data-tool]',items:el=>{const id=el.dataset.tool;return [['Open',()=>openTool(id)],['Copy link',()=>copyText(location.origin+location.pathname+'#tool-'+id).then(ok=>toast(ok?'Link copied':'Clipboard blocked'))]];}},
 {sel:'.tile[data-sc]',items:el=>{const id=el.dataset.sc;return [['Play the shift',()=>openScenario(id)],(S.scen||{})[id]?['Forget my result',()=>{delete S.scen[id];save();RENDER.scen();}]:null].filter(Boolean);}},
 {sel:'.web-n',items:el=>{const n=WEB_NODES.find(x=>x[0]===el.dataset.id);if(!n)return [];const tb=TEACH.find(t=>t.c===n[0]);return [['Focus',()=>{WEBSEL=n[0];RENDER.web();}],LBYID[n[4]]?['Open the lesson',()=>openLesson(n[4])]:null,tb?['Teach it back',()=>{TB_PICK=n[0];TB=null;go('teach');}]:null].filter(Boolean);}}
];
let lastMenu=0;
function menuFor(el){for(const m of MENUS){const h=el.closest(m.sel);if(h)return [m,h];}return null;}
function openMenu(m,el){const items=m.items(el);if(!items.length)return false;el.classList.add('held');setTimeout(()=>el.classList.remove('held'),300);/* sheet title: data-title, then the item's name (<b>/<h3>; a tile's first span is its description), then aria-label, then the first span */
 const nm=el.dataset.title||(el.querySelector('b,h3')||{}).textContent||el.getAttribute('aria-label')||(el.querySelector('span:not(.mono-mark):not(.ck)')||el).textContent;const t=String(nm||'').trim().slice(0,48);lastMenu=Date.now();sheet(t,items);return true;}
/* the same menu for the "More actions" (⋯) buttons other views may add: <button data-kitmore="CSS selector of the row"> (T27-11) */
window.kitMore=function(el){if(!el)return false;const mh=menuFor(el);return !!(mh&&openMenu(mh[0],mh[1]));};
document.addEventListener('click',e=>{const b=e.target instanceof Element&&e.target.closest('[data-kitmore]');if(!b)return;e.preventDefault();e.stopPropagation();let host=null;try{host=b.dataset.kitmore?document.querySelector(b.dataset.kitmore):null;}catch(err){}window.kitMore(host||b.previousElementSibling);});
function onDown(e){if(e.button&&e.button!==0)return;target=e.target;sx0=e.clientX;sy0=e.clientY;clearTimeout(timer);
 timer=setTimeout(()=>{if(!target)return;const mh=menuFor(target);if(mh&&openMenu(mh[0],mh[1])){swallow=true;return;}
  const h=hintOf(target);if(h&&h[0]){swallow=true;showBubble(sx0,sy0,h[0],h[1]);}},460);}
function onMove(e){if(Math.abs(e.clientX-sx0)>10||Math.abs(e.clientY-sy0)>10)clearTimeout(timer);}
function onUp(){clearTimeout(timer);setTimeout(hideBubble,1100);}
document.addEventListener('pointerdown',onDown,{passive:true});document.addEventListener('pointermove',onMove,{passive:true});document.addEventListener('pointerup',onUp);document.addEventListener('pointercancel',onUp);
document.addEventListener('scroll',()=>clearTimeout(timer),{passive:true,capture:true});
document.addEventListener('click',e=>{if(swallow){swallow=false;e.stopPropagation();e.preventDefault();}},true);
/* Shift+F10, the Menu key and a right click open the same hold menu or hint (WCAG 2.1.1, T27-11). A touch long-press also fires
   contextmenu: when the hold timer has just opened the menu, nothing more happens. */
document.addEventListener('contextmenu',e=>{const t=e.target;if(!(t instanceof Element))return;const mh=menuFor(t);const hh=!mh&&t.closest('[data-hint]')?kitHint(t):null;if(!mh&&!hh)return;
 e.preventDefault();if(Date.now()-lastMenu<900)return;clearTimeout(timer);
 /* a focus hint may already be showing on a hold-menu host (.mt carries data-hint): the menu still opens (T27-11) */
 if(mh){hideBubble();openMenu(mh[0],mh[1]);return;}
 if(bubble&&bubble.classList.contains('on'))return;
 const r=t.getBoundingClientRect(),kb=!e.clientX&&!e.clientY;showBubble(kb?r.left+120:e.clientX,kb?r.top:e.clientY,hh[0],hh[1],kb);setTimeout(hideBubble,2500);});
/* keyboard focus shows the hint too, and the element is described by it while focused */
let described=null;
document.addEventListener('focusin',e=>{const t=e.target;if(!(t instanceof Element))return;let fv=false;try{fv=t.matches(':focus-visible');}catch(err){}if(!fv)return;const h=kitHint(t);if(!h||!h[0])return;
 const r=t.getBoundingClientRect();showBubble(r.left+120,r.top,h[0],h[1],true);if(!t.hasAttribute('aria-describedby')){t.setAttribute('aria-describedby','kitHint');described=t;}});
document.addEventListener('focusout',e=>{if(described&&described===e.target){described.removeAttribute('aria-describedby');described=null;}if(bubble&&bubble.classList.contains('on'))hideBubble();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&bubble&&bubble.classList.contains('on'))hideBubble();});
/* swipe flash cards: right = got it, left = again */
/* an unflipped card only flips on a swipe, so nothing is rated before the answer is seen; a mostly vertical drag is ignored (T18-15) */
let card=null,sx=0,sy=0,dx=0,dy=0;
const resetCard=c=>{if(!c)return;c.style.transform='';delete c.dataset.swipe;};
document.addEventListener('pointerdown',e=>{card=e.target.closest('.flashcard');if(!card)return;sx=e.clientX;sy=e.clientY;dx=0;dy=0;});
document.addEventListener('pointermove',e=>{if(!card)return;dx=e.clientX-sx;dy=e.clientY-sy;if(Math.abs(dx)<14||Math.abs(dy)>Math.abs(dx)){resetCard(card);return;}clearTimeout(timer);const up=typeof FL!=='undefined'&&FL&&FL.flipped;card.style.transform='translateX('+dx+'px) rotate('+(dx/30)+'deg)';card.dataset.swipe=up?(dx>0?'Got it →':'← Again'):'Show the answer';});
document.addEventListener('pointerup',()=>{if(!card)return;const c=card,d=dx,v=dy;card=null;resetCard(c);if(Math.abs(d)>90&&Math.abs(d)>Math.abs(v)&&typeof FL!=='undefined'&&FL){swallow=true;setTimeout(()=>{swallow=false;},50);FL.swipes=(FL.swipes||0)+1;if(!FL.flipped){FL.flipped=true;FL.flipT=Date.now();RENDER.flash();}else flashRate(d>0);}});
document.addEventListener('pointercancel',()=>{const c=card;card=null;resetCard(c);});
})();
