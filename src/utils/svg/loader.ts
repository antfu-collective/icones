import type { CollectionInfo } from '../../data'
import { buildIcon, loadIcon } from 'iconify-icon'

export const API_ENTRY = 'https://api.iconify.design'

export async function getLicenseComment(collections: CollectionInfo[], icon: string) {
  const [id] = icon.split(':')
  const collection = collections.find(i => i.id === id)
  if (!collection) {
    return ''
  }
  return `<!-- Icon from ${collection?.name} by ${collection?.author?.name} - ${collection?.license?.url} -->`
}

export async function getSvgLocal(
  collections: CollectionInfo[],
  icon: string,
  size = '1em',
  color = 'currentColor',
) {
  const data = await loadIcon(icon)
  if (!data)
    return
  const built = buildIcon(data, { height: size })
  if (!built)
    return
  const license = await getLicenseComment(collections, icon)
  const xlink = built.body.includes('xlink:') ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : ''
  return `<svg xmlns="http://www.w3.org/2000/svg"${xlink} ${Object.entries(built.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}>${license}${built.body}</svg>`.replaceAll('currentColor', color)
}

export async function getSvg(
  collections: CollectionInfo[],
  icon: string,
  size = '1em',
  color = 'currentColor',
) {
  const local = await getSvgLocal(collections, icon, size, color)
  if (local)
    return local

  const mode = import.meta.env.DEV && !PWA ? 'no-cors' : undefined
  return await fetch(`${API_ENTRY}/${icon}.svg?inline=false&height=${size}&color=${encodeURIComponent(color)}`, {
    mode,
  }).then(r => r.text()) || ''
}
