import { iconsCart } from '../store'
import { getSvg } from './icons'

export async function PackCart(options: any) {
  if (!iconsCart.value.length)
    return

  const icons = await Promise.all(iconsCart.value.filter(Boolean).sort().map(async(name) => {
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
