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

function openCaches(e: FetchEvent) {
  e.waitUntil(caches.open(cacheNames.precache))
  return Promise.resolve()
}

self.addEventListener('fetch', (e) => {
  const url = e.request.url
  const match = url.match(/^https:\/\/(api\.iconify\.design|api\.simplesvg\.com|api\.unisvg\.com)\/(.*)\.json\?icons=(.*)?/)
  if (match) {
    e.respondWith(
      openCaches(e)
        .then(() => {
          return fetch(`/collections/${match[2]}-raw.json`)
            .then(response => response.json())
            .then((collection) => {
              return new Response(JSON.stringify(getIcons(
                collection,
                match[3].replaceAll('%2C', ',').split(','),
              )), {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
            })
            .catch(() => fetch(e.request))
        }),
    )
  }
})
