import Iconify from '@purge-icons/generated'
import Base64 from './base64'

const API_ENTRY = 'https://api.iconify.design'

export async function getSvg(icon: string) {
  return Iconify.renderSVG(icon, {})?.outerHTML || await fetch(`${API_ENTRY}/${icon}.svg?inline=false&height=auto`).then(r => r.text()) || ''
}

export function toComponentName(icon: string) {
  return icon.split(/:|-|_/).filter(Boolean).map((s, i) => s[0].toUpperCase() + s.slice(1).toLowerCase()).join('')
}

export function ClearSvg(svgCode: string) {
  const el = document.createElement('div')
  el.innerHTML = svgCode
  const svg = el.getElementsByTagName('svg')[0]
  const keep = ['viewBox', 'width', 'height', 'focusable']
  for (const key of Object.values(svg.attributes)) {
    if (keep.includes(key.localName))
      continue
    svg.removeAttributeNode(key)
  }
  return el.innerHTML
}

export function SvgToReact(svg: string, name: string) {
  return `
import * as React from 'react'

function ${name}(props) {
  return (
    ${ClearSvg(svg).replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
  )
}

export default ${name}
  `
}

export function SvgToVue(svg: string, name: string) {
  return `
<template>
  ${ClearSvg(svg)}
</template>

<script>
export default {
  name: '${name}'
}
</script>
  `
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
    case 'react':
      return SvgToReact(await getSvg(icon), toComponentName(icon))
    case 'vue':
      return SvgToVue(await getSvg(icon), toComponentName(icon))
  }
}

export function getIconDownloadLink(icon: string) {
  return `${API_ENTRY}/${icon}.svg?download=true&inline=false&height=auto`
}
