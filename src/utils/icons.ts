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

export function SvgToJSX(svg: string, name: string, snippet: boolean) {
  const code = `
export function ${name}(props) {
  return (
    ${ClearSvg(svg).replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
  )
}`
  if (snippet)
    return code
  else
    return `import React from 'react'\n${code}\nexport default ${name}`
}

export function SvgToTSX(svg: string, name: string, snippet: boolean) {
  const code = `
export function ${name}(props: SVGProps<SVGSVGElement>) {
  return (
    ${ClearSvg(svg).replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
  )
}`
  if (snippet)
    return code
  else
    return `import React, { SVGProps } from 'react'\n${code}\nexport default ${name}`
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
</script>`
}

export async function getIconSnippet(icon: string, type: string, snippet = true): Promise<string | undefined> {
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
    case 'jsx':
      return SvgToJSX(await getSvg(icon), toComponentName(icon), snippet)
    case 'tsx':
      return SvgToTSX(await getSvg(icon), toComponentName(icon), snippet)
    case 'vue':
      return SvgToVue(await getSvg(icon), toComponentName(icon))
  }
}

export function getIconDownloadLink(icon: string) {
  return `${API_ENTRY}/${icon}.svg?download=true&inline=false&height=auto`
}
