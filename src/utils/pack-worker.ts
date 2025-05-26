/// <reference lib="webworker" />

import type { PackOperation, WorkerPackMessage } from './pack-worker-types'
import type { PackType } from './svg-helpers'
import { downloadZip } from 'client-zip'
import {
  getSvg,
  LoadIconSvgs,
  normalizeZipFleName,
  SvgToJSX,
  SvgToTSX,
  SvgToVue,
  toComponentName,
} from './svg-helpers'

globalThis.onmessage = async (event: MessageEvent<WorkerPackMessage<PackOperation>>) => {
  const message = event.data
  let blob: Blob | undefined
  let name: string | undefined
  try {
    if (isPackZipMessage(message)) {
      blob = await downloadZip(
        PreparePackZip(message.payload.icons, message.payload.name, message.payload.type),
      ).blob()
    }
    else if (isPackJsonZipMessage(message)) {
      blob = await downloadZip(
        PrepareIconSvgs(message.payload.icons, 'json', message.payload.name),
      ).blob()
    }
    else if (isPackSvgZipMessage(message)) {
      blob = await downloadZip(
        PrepareIconSvgs(message.payload.icons, 'svg'),
      ).blob()
    }
    else if (isPackFontZipMessage(message)) {
      const result = await PackIconFont(message.payload.icons, message.payload.options)
      if (result) {
        ([blob, name] = result)
      }
    }
  }
  catch (e: any) {
    console.error('PackWorker: error while transferring generated zip', e)
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

async function* PrepareIconSvgs(icons: string[], format: 'svg' | 'json', name?: string) {
  if (format === 'json') {
    const svgs = await LoadIconSvgs(icons)
    yield {
      name: `${name}.json`,
      input: new Blob([JSON.stringify(svgs, null, 2)], { type: 'application/json; charset=utf-8' }),
    }
    return
  }

  for (const icon of icons) {
    if (!icon)
      continue

    const svg = await getSvg(icon)

    yield {
      name: `${normalizeZipFleName(icon)}.svg`,
      input: new Blob([svg], { type: 'image/svg+xml' }),
    }
  }
}

async function* PreparePackZip(
  icons: string[],
  name: string,
  type: PackType,
) {
  if (type === 'json' || type === 'svg') {
    yield* PrepareIconSvgs(icons, type, name)
    return
  }

  for (const name of icons) {
    if (!name)
      continue

    const svg = await getSvg(name)

    const componentName = toComponentName(normalizeZipFleName(name))
    let content: string

    switch (type) {
      case 'vue':
        content = await SvgToVue(svg, componentName)
        break
      case 'jsx':
        content = await SvgToJSX(svg, componentName, false)
        break
      case 'tsx':
        content = await SvgToTSX(svg, componentName, false)
        break
      default:
        continue
    }

    yield {
      name: `${componentName}.${type}`,
      input: new Blob([content], { type: 'text/plain' }),
    }
  }
}

async function PackIconFont(icons: string[], options: any = {}) {
  if (!icons.length)
    return

  const [data, { SvgPacker }] = await Promise.all([
    LoadIconSvgs(icons),
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
