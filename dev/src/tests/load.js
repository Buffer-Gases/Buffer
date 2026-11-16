// Loads the app's engine (content + e1.js) into Node without a DOM.
const fs=require('fs'),path=require('path');
global.localStorage={_m:{},getItem(k){return this._m[k]||null},setItem(k,v){this._m[k]=v}};
const dir=path.join(__dirname,'..');
const src=['c1.js','c2.js','c3.js','c4.js','c5.js','c6.js','c7.js','c8.js','c10.js','c11.js','c12.js','c9.js','e1.js'].map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');
const fn=new Function(src+';return {REFCASES,REFINVALID,interp,genCase,KINDS,kindsFor,targetLabel,buildLabel,phFrom,hFrom,S,labelPool,distract,validate,toMm,L,MODS,CAUSES,beFrom,XQ,CASES,OXLAB,migrate};');
module.exports=fn();
