import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { cacheNames, clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { getIcons } from '@iconify/utils'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
))

self.skipWaiting()
clientsClaim()

async function getCollection(request: Request, name: string, icons: string[]) {
  try {
    const cache = await caches.open(cacheNames.precache)
    const url = `/collections/${name}-raw.json`
    let cachedResponse = await cache.match(url)
    if (!cachedResponse) {
      cachedResponse = await fetch(url)
      await cache.put(url, cachedResponse.clone())
    }
    const collection = await cachedResponse.json()
    return new Response(JSON.stringify(getIcons(
      collection,
      icons,
    )), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  }
  catch {
    return await fetch(request)
  }
}

const fetchRegex = /^https:\/\/(api\.iconify\.design|api\.simplesvg\.com|api\.unisvg\.com)\/(.*)\.json\?icons=(.*)$/

self.addEventListener('fetch', (e) => {
  const url = e.request.url
  const match = url.match(fetchRegex)
  if (match) {
    e.respondWith(getCollection(
      e.request,
      match[2],
      match[3].replaceAll('%2C', ',').split(','),
    ))
  }
})
