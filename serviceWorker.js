/*
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
https://web.dev/learn/pwa/caching/
https://developer.mozilla.org/en-US/docs/Web/API/Cache
https://whatwebcando.today/articles/handling-service-worker-updates/
https://github.com/w3c/ServiceWorker/issues/822
*/

const prefix = 'PTD' // since the origin could be shared by several PWA's
const build = 'b9'
const mainCache = prefix+'_main'
const log = console.log

// const bc_shared = new BroadcastChannel('shared')
// bc_shared.postMessage('sad')
// // bc_shared.addEventListener('message', {data}) {

// // }

self.addEventListener('message', (event) => {
  log('sw message', event)
})
const client = clients.matchAll()[0] // last active client of type window
log(client)
client.postMessage({build})

self.addEventListener('install', event => {
  async function addInitialCache() {
    await caches.delete(mainCache) // just force a refresh of it here (then we don't need to do anything in the activate event)
    const cache = await caches.open(mainCache)
    const urlPrefix = './' // meaning relative to the path of this service worker
    await cache.addAll([ // cache these URLs (do not add the serviceWorker here)
      urlPrefix, // the index
      urlPrefix+'manifest.json', 
      urlPrefix+'icon.svg', 
      urlPrefix+'theme.css', 
      urlPrefix+'light.css', 
      urlPrefix+'main.js', 
      urlPrefix+'useful.js', 
    ])
    self.skipWaiting() // to activate an updated service worker immediately
  }
  event.waitUntil(addInitialCache())
})

// clean up stuff from old workers
// self.addEventListener('activate', event => {
//   async function deleteOldCaches() {
//     const names = await caches.keys()
//     await Promise.all(names.map(name => {
//       if (name.startsWith(prefix)) { // for this PWA
//         if (!name.startsWith(prefix+build)) { // but wrong build
//           return caches.delete(name) // then delete the whole cache
//         }
//       }
//     }))
//   }
//   event.waitUntil(deleteOldCaches())
// })

self.addEventListener('fetch', event => {
  async function returnCachedResource() {
    const cache = await caches.open(mainCache)
    const cachedResponse = await cache.match(event.request.url)
    if (cachedResponse) return cachedResponse
    try {        
      const fetchResponse = await fetch(event.request)
      cache.put(event.request.url, fetchResponse.clone())
      return fetchResponse
    } catch (error) { // here we could do custom offline response
      return null // or trigger a network error
    }
  }
  event.respondWith(returnCachedResource())
})

