/* Buffer service worker. Bump V for every release. OCR is named after the tesseract.js version, so bumping it prunes the old reader. */
const V='buffer-5.0.1',OCR='buffer-ocr-5.1.1',FONTS='buffer-fonts-1',NAV_WAIT=3000;
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const KEEP=[V,OCR,FONTS];
const SCOPE=new URL(self.registration.scope).pathname;
/* only a real copy of the app may become the offline app: 200, same origin, HTML, at the start URL */
const isApp=r=>!!r&&r.ok&&r.type==='basic'&&/text\/html/i.test(r.headers.get('content-type')||'')&&new URL(r.url).pathname.replace(/index\.html$/,'')===SCOPE;
const appCopy=()=>caches.match('./index.html').then(r=>r||caches.match('./'));
/* cross-origin files are re-requested in CORS mode, so the response can be checked (r.ok) instead of being an opaque blob */
const corsGet=u=>fetch(new Request(u,{mode:'cors',credentials:'omit'}));
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>/^buffer-/.test(k)&&!KEEP.includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
 /* the photo reader is cached after the first use so it works offline. tesseract.js 5.1.1 requests, all from cdn.jsdelivr.net/npm/:
    tesseract.js@5.1.1/dist/tesseract.min.js (script tag), tesseract.js@v5.1.1/dist/worker.min.js (importScripts in a blob worker),
    tesseract.js-core@v5.1.1/tesseract-core-simd-lstm.wasm.js or tesseract-core-lstm.wasm.js (wasm embedded, importScripts),
    @tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz (fetch; createWorker('eng',1) is LSTM only). All match /tesseract/. */
 if(u.hostname==='cdn.jsdelivr.net'&&/\/npm\/(@tesseract\.js-data\/|tesseract\.js(-core)?@)/.test(u.pathname)){e.respondWith(caches.open(OCR).then(c=>c.match(u.href).then(r=>r||corsGet(u.href).then(n=>{if(n.ok)e.waitUntil(c.put(u.href,n.clone()));return n;}))));return;}
 /* Google Fonts: stale-while-revalidate, so the fonts work offline and a slow network never holds up the text */
 if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){e.respondWith(caches.open(FONTS).then(c=>c.match(u.href).then(r=>{const net=corsGet(u.href).then(n=>{if(n.ok)return c.put(u.href,n.clone()).then(()=>n);return r||n;}).catch(()=>r||Response.error());if(r){e.waitUntil(net.catch(()=>{}));return r;}return net;})));return;}
 if(u.origin!==location.origin)return;
 /* navigation: network first, but after NAV_WAIT ms (hospital Wi-Fi that hangs) the cached app is shown. Only a real copy of the app is stored. */
 if(e.request.mode==='navigate'){let saved;e.waitUntil(new Promise(res=>{saved=res;}));
  const net=fetch(e.request).then(r=>{if(isApp(r)){const c=r.clone();saved(caches.open(V).then(x=>x.put('./index.html',c)));}else saved();
    /* a server error must not hide the offline app; a 404 for a wrong address is shown as it is */
    return r.status>=500?appCopy().then(a=>a||r):r;},err=>{saved();throw err;});
  const late=new Promise(res=>setTimeout(res,NAV_WAIT)).then(()=>appCopy()).then(a=>a||net);
  e.respondWith(Promise.race([net,late]).catch(()=>appCopy()).then(r=>r||Response.error()));return;}
 /* other files of the app: cache first; store only good same-origin responses */
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok&&n.type==='basic'){const c=n.clone();e.waitUntil(caches.open(V).then(x=>x.put(e.request,c)));}return n;})));});
