import Base64 from './base64'

const API_ENTRY = 'https://api.iconify.design'

export async function getSvg(icon: string) {
  return window.Iconify.getSVG(icon, undefined) || await fetch(`${API_ENTRY}/${icon}.svg?inline=false&height=auto`).then(r => r.text()) || ''
}

export async function getIconSnippet(icon: string, type: string): Promise<string | undefined> {
  if (!icon)
    return

  switch (type) {
    case 'id':
      return icon
    case 'url':
      return `${API_ENTRY}/${icon}.svg`
    case 'html':
      return `<span class="iconify" data-icon="${icon}" data-inline="false"></span>`
    case 'css':
      return `background: url('${API_ENTRY}/${icon}.svg') no-repeat center center / contain;`
    case 'svg':
      return await getSvg(icon)
    case 'data_url':
      return `data:image/svg+xml;base64,${Base64.encode(await getSvg(icon))}`
  }
}

export function getIconDownloadLink(icon: string) {
  return `${API_ENTRY}/${icon}.svg?download=true&inline=false&height=auto`
}
