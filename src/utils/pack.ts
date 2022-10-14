import { isVSCode } from '../env'
import { bufferToString } from './bufferToSring'
import {
  SvgToJSX, SvgToTSX, SvgToVue,
  getSvg, toComponentName,
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

export async function PackIconFont(icons: string[], options: any = {}) {
  if (!icons.length)
    return
  const data = await LoadIconSvgs(icons)
  const result = await window.SvgPacker({
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
  const data = await LoadIconSvgs(icons)

  const zip = new window.JSZip()
  for (const { name, svg } of data)
    zip.file(`${name}.svg`, svg)

  const blob = await zip.generateAsync({ type: 'blob' })
  Download(blob, `${name}.zip`)
}

export async function PackJsonZip(icons: string[], name: string) {
  if (!icons.length)
    return
  const data = await LoadIconSvgs(icons)

  const zip = new window.JSZip()
  zip.file(`${name}.json`, JSON.stringify(data, null, 2))

  const blob = await zip.generateAsync({ type: 'blob' })
  Download(blob, `${name}.zip`)
}

export type PackType = 'svg' | 'tsx' | 'jsx' | 'vue' | 'json'

export async function PackZip(
  icons: string[],
  name: string,
  type: PackType = 'svg',
) {
  if (!icons.length)
    return
  const data = await LoadIconSvgs(icons)

  const zip = new window.JSZip()

  const zipActions: Record<PackType, (name: string, svg: string) => void | (() => void) > = {
    vue(name: string, svg: string) {
      name = toComponentName(name)
      zip.file(`${name}.vue`, SvgToVue(svg, name))
    },
    jsx(name: string, svg: string) {
      name = toComponentName(name)
      zip.file(`${name}.jsx`, SvgToJSX(svg, name, false))
    },
    tsx(name: string, svg: string) {
      name = toComponentName(name)
      zip.file(`${name}.tsx`, SvgToTSX(svg, name, false))
    },
    svg(name: string, svg: string) {
      zip.file(`${name}.svg`, svg)
    },
    json() {
      zip.file(`${name}.json`, JSON.stringify(data, null, 2))
    },
  }

  const action = zipActions[type]
  if (type === 'json') {
    (action as () => void)()
  }
  else {
    for (const { name, svg } of data)
      action(name, svg)
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  Download(blob, `${name}-${type}.zip`)
}
