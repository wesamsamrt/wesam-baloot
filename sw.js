const PREFIX='wesam-baloot-'+self.registration.scope;
const CACHE=PREFIX+'v1';
const ROOT=new URL('./',self.registration.scope).href;
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(ROOT))return;
 if(event.request.mode==='navigate'&&(url.pathname===new URL(ROOT).pathname||url.pathname===new URL('index.html',ROOT).pathname)){
  event.respondWith(fetch(event.request).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(ROOT,response.clone());}return response;}).catch(async()=>await caches.match(ROOT)||Response.error()));
 }else if(ASSETS.includes(url.href)){
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
 }
});
