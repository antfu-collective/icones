import { getIcons } from '@iconify/utils'
import { cacheNames, clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
const swManifest = self.__WB_MANIFEST
precacheAndRoute(swManifest)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
))

self.skipWaiting()
clientsClaim()

function buildCollectionResponseHeaders(cachedResponse: Response) {
  const age = cachedResponse.headers.get('age')
  const date = cachedResponse.headers.get('date')
  const etag = cachedResponse.headers.get('etag')
  const contentType = cachedResponse.headers.get('content-type')
  const cacheControl = cachedResponse.headers.get('cache-control')

  const headers: Record<string, string> = {
    'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-origin': '*',
    'access-control-max-age': '86400',
    'cache-control': 'public, max-age=604800, min-refresh=604800, immutable',
    'content-type': 'application/json; charset=utf-8',
    'cross-origin-resource-policy': 'cross-origin',
  }

  if (age)
    headers.age = age

  if (date)
    headers.date = date

  if (etag)
    headers.etag = etag

  if (contentType)
    headers['content-type'] = contentType

  if (cacheControl)
    headers['cache-control'] = cacheControl

  return headers
}

const swManifestMap = new Map<string, string>(
  swManifest.map((entry) => {
    if (typeof entry === 'string') {
      const e = entry[0] === '/' ? entry : `/${entry}`
      return [e, e]
    }
    else {
      const e = entry.url[0] === '/' ? entry.url : `/${entry.url}`
      return [e, entry.revision ? `${e}?__WB_REVISION__=${entry.revision}` : e]
    }
  }),
)

async function getCollection(request: Request, name: string, icons: string[]) {
  try {
    const cache = await caches.open(cacheNames.precache)
    const collectionUrl = `/collections/${name}.json`
    const url = swManifestMap.get(collectionUrl) ?? collectionUrl
    let cachedResponse = await cache.match(url)
    if (!cachedResponse) {
      cachedResponse = await fetch(url)
      await cache.put(url, cachedResponse.clone())
    }

    const collection = await cachedResponse.json()

    return new Response(JSON.stringify(getIcons(collection, icons)), {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: buildCollectionResponseHeaders(cachedResponse),
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
