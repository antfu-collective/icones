import { isVSCode } from '../env'
import { bufferToString } from './bufferToString'
import {
  getSvg,
  getSvgSymbol,
  SvgToJSX,
  SvgToTSX,
  SvgToVue,
  toComponentName,
} from './icons'

export async function LoadIconSvgs(icons: string[]) {
  return await Promise.all(
    icons
      .filter(Boolean)
      .sort()
      .map(async (name) => {
        return {
          name,
          svg: await getSvg(name),
        }
      }),
  )
}

export async function* PrepareIconSvgs(icons: string[], format: 'svg' | 'json', name?: string) {
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

export async function Download(blob: Blob, name: string) {
  if (isVSCode) {
    blob.arrayBuffer().then(
      buffer => vscode.postMessage({
        command: 'download',
        name,
        text: bufferToString(buffer),
      }),
    )
  }
  else {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    a.remove()
  }
}

export async function PackSVGSprite(icons: string[], options: any = {}) {
  if (!icons.length)
    return
  const data = await LoadIconSvgs(icons)

  let symbols = ''
  for (const { name } of data)
    symbols += `${await getSvgSymbol(name, options.size, options.color)}\n`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
${symbols}
</defs>
</svg>`

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  Download(blob, 'sprite.svg')
}

function normalizeZipFleName(svgName: string): string {
  return svgName.replace(':', '-')
}

export async function PackIconFont(icons: string[], options: any = {}) {
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

  Download(result.zip.blob, result.zip.name)
}

export async function PackSvgZip(icons: string[], name: string) {
  if (!icons.length)
    return

  Download(
    await import('client-zip').then(({ downloadZip }) => downloadZip(
      PrepareIconSvgs(icons, 'svg'),
    ).blob()),
    `${name}.zip`,
  )
}

export async function PackJsonZip(icons: string[], name: string) {
  if (!icons.length)
    return

  Download(
    await import('client-zip').then(({ downloadZip }) => downloadZip(
      PrepareIconSvgs(icons, 'json', name),
    ).blob()),
    `${name}.zip`,
  )
}

export type PackType = 'svg' | 'tsx' | 'jsx' | 'vue' | 'json'

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

export async function PackZip(
  icons: string[],
  name: string,
  type: PackType = 'svg',
) {
  if (!icons.length)
    return

  Download(
    await import('client-zip').then(({ downloadZip }) => downloadZip(
      PreparePackZip(icons, name, type),
    ).blob()),
    `${name}-${type}.zip`,
  )
}
