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

export async function Download(url: string, name: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  a.remove()
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

  Download(result.zip.url, result.zip.name)
}

export async function PackSvgZip(icons: string[], name: string) {
  if (!icons.length) return
  const data = await LoadIconSvgs(icons)

  const zip = new window.JSZip()
  for (const { name, svg } of data)
    zip.file(`${name}.svg`, svg)

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  Download(url, `${name}.zip`)
}
