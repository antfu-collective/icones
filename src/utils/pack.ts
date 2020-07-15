import { bags } from '../store'
import { getSvg } from './icons'

export async function PackIconsInBag(options: any = {}) {
  if (!bags.value.length)
    return

  const icons = await Promise.all(bags.value.filter(Boolean).sort().map(async(name) => {
    return {
      name,
      svg: await getSvg(name),
    }
  }))

  const result = await window.SvgPacker({
    fontName: 'Iconfiy Explorer Font',
    fileName: 'iconfont',
    cssPrefix: 'i',
    ...options,
    icons,
  })

  const a = document.createElement('a')
  a.href = result.zip.url
  a.download = result.zip.name
  a.click()
  a.remove()
}
