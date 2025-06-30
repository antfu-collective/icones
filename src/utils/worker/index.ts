/// <reference lib="webworker" />

import type { CollectionInfo } from '../../data'
import type { PackType } from '../svg'
import type { PackOperation, WorkerPackMessage } from './types'
import { downloadZip } from 'client-zip'
import { getSvg, LoadIconSvgs, normalizeZipFleName, SvgToAstro, SvgToJSX, SvgToQwik, SvgToReactNative, SvgToSolid, SvgToSvelte, SvgToTSX, SvgToVue, toComponentName } from '../svg'

globalThis.onmessage = async (event: MessageEvent<WorkerPackMessage<PackOperation>>) => {
  const message = event.data
  let blob: Blob | undefined
  let name: string | undefined
  try {
    const collections: CollectionInfo[] = JSON.parse(
      new TextDecoder().decode(message.collections),
    )
    if (isPackZipMessage(message)) {
      blob = await downloadZip(
        PreparePackZip(
          collections,
          message.payload.icons,
          message.payload.name,
          message.payload.type,
        ),
      ).blob()
    }
    else if (isPackJsonZipMessage(message)) {
      blob = await downloadZip(
        PrepareIconSvgs(
          collections,
          message.payload.icons,
          'json',
          message.payload.name,
        ),
      ).blob()
    }
    else if (isPackSvgZipMessage(message)) {
      blob = await downloadZip(
        PrepareIconSvgs(
          collections,
          message.payload.icons,
          'svg',
        ),
      ).blob()
    }
    else if (isPackFontZipMessage(message)) {
      const result = await PackIconFont(
        collections,
        message.payload.icons,
        message.payload.options,
      )
      if (result) {
        ([blob, name] = result)
      }
    }
  }
  catch (e: any) {
    console.error('PackWorker: error while generating the zip', e)
    globalThis.postMessage({ error: e && 'message' in e ? e.message : String(e) })
    return
  }

  if (blob) {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      globalThis.postMessage({
        blob: arrayBuffer,
        name,
      }, [arrayBuffer])
    }
    catch (e: any) {
      console.error('PackWorker: error while transferring generated zip', e)
      globalThis.postMessage({ error: e && 'message' in e ? e.message : String(e) })
    }
  }
  else {
    globalThis.postMessage({ error: 'No blob generated' })
  }
}

export function isPackZipMessage(
  message: WorkerPackMessage<PackOperation>,
): message is WorkerPackMessage<'pack-zip'> {
  return message.operation === 'pack-zip'
}

export function isPackJsonZipMessage(
  message: WorkerPackMessage<PackOperation>,
): message is WorkerPackMessage<'pack-json-zip'> {
  return message.operation === 'pack-json-zip'
}

export function isPackSvgZipMessage(
  message: WorkerPackMessage<PackOperation>,
): message is WorkerPackMessage<'pack-svg-zip'> {
  return message.operation === 'pack-svg-zip'
}

export function isPackFontZipMessage(
  message: WorkerPackMessage<PackOperation>,
): message is WorkerPackMessage<'pack-font-zip'> {
  return message.operation === 'pack-font-zip'
}

async function* PrepareIconSvgs(
  collections: CollectionInfo[],
  icons: string[],
  format: 'svg' | 'json',
  name?: string,
) {
  if (format === 'json') {
    const svgs = await LoadIconSvgs(collections, icons)
    yield {
      name: `${name}.json`,
      input: new Blob([JSON.stringify(svgs, null, 2)], { type: 'application/json; charset=utf-8' }),
    }
    return
  }

  for (const icon of icons) {
    if (!icon)
      continue

    const svg = await getSvg(collections, icon)

    yield {
      name: `${normalizeZipFleName(icon)}.svg`,
      input: new Blob([svg], { type: 'image/svg+xml' }),
    }
  }
}

async function* PreparePackZip(
  collections: CollectionInfo[],
  icons: string[],
  name: string,
  type: PackType,
) {
  if (type === 'json' || type === 'svg') {
    yield* PrepareIconSvgs(collections, icons, type, name)
    return
  }

  const ext = (type === 'solid' || type === 'qwik' || type === 'react-native') ? 'tsx' : type

  for (const name of icons) {
    if (!name)
      continue

    const svg = await getSvg(collections, name)

    const componentName = toComponentName(normalizeZipFleName(name))
    let content: string

    switch (type) {
      case 'vue':
        content = await SvgToVue(svg, componentName)
        break
      case 'jsx':
        content = await SvgToJSX(svg, componentName, false)
        break
      case 'svelte':
        content = SvgToSvelte(svg)
        break
      case 'astro':
        content = SvgToAstro(svg)
        break
      case 'qwik':
        content = await SvgToQwik(svg, componentName, false)
        break
      case 'react-native':
        content = await SvgToReactNative(svg, componentName, false)
        break
      case 'solid':
        content = await SvgToSolid(svg, componentName, false)
        break
      case 'tsx':
        content = await SvgToTSX(svg, componentName, false)
        break
      default:
        continue
    }

    yield {
      name: `${componentName}.${ext}`,
      input: new Blob([content], { type: 'text/plain' }),
    }
  }
}

async function PackIconFont(
  collections: CollectionInfo[],
  icons: string[],
  options: any = {},
) {
  if (!icons.length)
    return

  const [data, { SvgPacker }] = await Promise.all([
    LoadIconSvgs(collections, icons),
    import('svg-packer'),
  ])
  const result = await SvgPacker({
    fontName: 'Iconify Explorer Font',
    fileName: 'iconfont',
    cssPrefix: 'i',
    ...options,
    icons: data,
  })

  return [result.zip.blob, result.zip.name] as const
}
