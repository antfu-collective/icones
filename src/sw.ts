import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
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

self.addEventListener('fetch', (e) => {
  const url = e.request.url
  const match = url.match(/^https:\/\/api.iconify.design\/(.*)\.json\?icons=(.*)?/)
  if (match) {
    e.respondWith(
      fetch(`/collections/${match[1]}-raw.json`)
        .then((response) => {
          return response.json()
        }).then((collection) => {
          return new Response(JSON.stringify(getIcons(
            collection,
            match[2].replaceAll('%2C', ',').split(','),
          )), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }),
    )
  }
})
