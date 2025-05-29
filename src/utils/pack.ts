import type { CollectionInfo } from '../data'
import type { PackType } from './svg'
import { Download } from './icons'
import { getSvg, LoadIconSvgs } from './svg'

export async function getSvgSymbol(
  collections: CollectionInfo[],
  icon: string,
  size = '1em',
  color = 'currentColor',
) {
  const svgMarkup = await getSvg(collections, icon, size, color)

  const symbolElem = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
  const node = document.createElement('div') // Create any old element
  node.innerHTML = svgMarkup

  // Grab the inner HTML and move into a symbol element
  symbolElem.innerHTML = node.querySelector('svg')!.innerHTML
  symbolElem.setAttribute('viewBox', node.querySelector('svg')!.getAttribute('viewBox')!)
  symbolElem.id = icon.replace(/:/, '-') // Simple slugify for quick symbol lookup

  return symbolElem?.outerHTML
}

export async function PackSVGSprite(
  collections: CollectionInfo[],
  icons: string[],
  options: any = {},
) {
  if (!icons.length)
    return
  const data = await LoadIconSvgs(collections, icons)

  let symbols = ''
  for (const { name } of data)
    symbols += `${await getSvgSymbol(collections, name, options.size, options.color)}\n`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
${symbols}
</defs>
</svg>`

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  Download(blob, 'sprite.svg')
}

export async function PackIconFont(
  collections: CollectionInfo[],
  icons: string[],
  options: any = {},
) {
  if (!icons.length)
    return

  const { packerWorker } = await import('./pack-worker-client')

  return new Promise<void>((resolve, reject) => {
    packerWorker.addEventListener('message', (event) => {
      if (event.data.error) {
        reject(event.data.error)
        return
      }
      const { blob, name } = event.data as { blob: ArrayBuffer, name: string }
      Download(
        new Blob([blob]),
        name,
      )
      resolve()
    }, { once: true })
    const arrayBuffer = createArrayBufferFromCollections(collections)
    packerWorker.postMessage({
      operation: 'pack-font-zip',
      collections: arrayBuffer,
      payload: {
        icons: toRaw(icons),
        ...toRaw(options),
      },
    }, [arrayBuffer])
  })
}

export async function PackSvgZip(
  collections: CollectionInfo[],
  icons: string[],
  name: string,
) {
  if (!icons.length)
    return

  const { packerWorker } = await import('./pack-worker-client')

  return new Promise<void>((resolve, reject) => {
    packerWorker.addEventListener('message', (event) => {
      if (event.data.error) {
        reject(event.data.error)
        return
      }
      const { blob } = event.data as { blob: ArrayBuffer }
      Download(
        new Blob([blob]),
        `${name}.zip`,
      )
      resolve()
    }, { once: true })
    const arrayBuffer = createArrayBufferFromCollections(collections)
    packerWorker.postMessage({
      operation: 'pack-svg-zip',
      collections: arrayBuffer,
      payload: {
        icons: toRaw(icons),
      },
    }, [arrayBuffer])
  })
}

export async function PackJsonZip(
  collections: CollectionInfo[],
  icons: string[],
  name: string,
) {
  if (!icons.length)
    return

  const { packerWorker } = await import('./pack-worker-client')

  return new Promise<void>((resolve, reject) => {
    packerWorker.addEventListener('message', (event) => {
      if (event.data.error) {
        reject(event.data.error)
        return
      }
      const { blob } = event.data as { blob: ArrayBuffer }
      Download(
        new Blob([blob]),
        `${name}.zip`,
      )
      resolve()
    }, { once: true })
    const arrayBuffer = createArrayBufferFromCollections(collections)
    packerWorker.postMessage({
      operation: 'pack-json-zip',
      collections: arrayBuffer,
      payload: {
        icons: toRaw(icons),
        name,
      },
    }, [arrayBuffer])
  })
}

export async function PackZip(
  collections: CollectionInfo[],
  icons: string[],
  name: string,
  type: PackType = 'svg',
) {
  if (!icons.length)
    return

  const { packerWorker } = await import('./pack-worker-client')

  return new Promise<void>((resolve, reject) => {
    packerWorker.addEventListener('message', (event) => {
      if (event.data.error) {
        reject(event.data.error)
        return
      }
      const { blob } = event.data as { blob: ArrayBuffer }
      Download(
        new Blob([blob]),
        `${name}-${type}.zip`,
      )
      resolve()
    }, { once: true })
    const arrayBuffer = createArrayBufferFromCollections(collections)
    packerWorker.postMessage({
      operation: 'pack-zip',
      collections: arrayBuffer,
      payload: {
        icons: toRaw(icons),
        name,
        type,
      },
    }, [arrayBuffer])
  })
}

function createArrayBufferFromCollections(
  collections: CollectionInfo[],
) {
  return new TextEncoder().encode(JSON.stringify(collections)).buffer
}
