import { isVSCode } from '../env'
import { getSvg } from './icons'

export async function LoadIconSvgs(icons: string[]) {
  return await Promise.all(
    icons
      .filter(Boolean)
      .sort()
      .map(async(name) => {
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
        text: String.fromCharCode.apply(null, new Uint16Array(buffer) as any)
      })
    )
  } else {  
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    a.remove()
  }
}

export async function PackIconFont(icons: string[], options: any = {}) {
  if (!icons.length) return
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
  if (!icons.length) return
  const data = await LoadIconSvgs(icons)

  const zip = new window.JSZip()
  for (const { name, svg } of data)
    zip.file(`${name}.svg`, svg)

  const blob = await zip.generateAsync({ type: 'blob' })
  Download(blob, `${name}.zip`)
}
