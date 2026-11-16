/* 4.2: merge the extra questions into lessons; answer positions are shuffled with a fixed seed so they are stable between sessions */
(function(){
 function rnd(seed){let h=2166136261;for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619);}return()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return((h>>>0)%100000)/100000;};}
 const byId={};L.forEach(l=>{byId[l.id]=l;});
 Object.keys(XQ).forEach(id=>{
  const l=byId[id];if(!l)return;
  XQ[id].forEach((q,n)=>{
   const r=rnd(id+':'+n),opts=q[1].map((t,i)=>[t,i===q[2]]);
   for(let i=opts.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]];}
   l.q.push([q[0],opts.map(o=>o[0]),opts.findIndex(o=>o[1]),q[3]]);
  });
 });
})();
/* 4.5: put the new visual models into the lessons they explain */
(function(){const add={'icu-vent1':['vent'],'icu-ards':['vent','vq'],'icu-obst':['vent'],comp:['dav'],odc:['odcplay'],hypox:['vq'],ratios:['vq'],renal:['kidney'],rta:['kidney']};
 /* 5.0: alkmaint no longer gets the kidney model (it has no alkalosis mode yet: T16-7).
    wopt = start-up options per model, read by mountW/W.*.build when supported (T08-18): open the lab on the lesson's own patient. */
 const opt={'icu-ards':{vent:{pat:'ards'}},'icu-obst':{vent:{pat:'asthma'}}};
 L.forEach(l=>{if(add[l.id]){l.w=l.w||[];add[l.id].forEach(w=>{if(!l.w.includes(w))l.w.push(w);});}if(opt[l.id])l.wopt=Object.assign({},l.wopt||{},opt[l.id]);});})();
