self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.open('todo-cache').then(async (cache) => {
      const cached = await cache.match(event.request)
      const network = fetch(event.request).then((resp) => {
        cache.put(event.request, resp.clone())
        return resp
      })
      return cached || network
    })
  )
})
