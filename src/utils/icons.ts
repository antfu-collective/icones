import { buildIcon, loadIcon } from 'iconify-icon'
import { getTransformedId } from '../store'
import Base64 from './base64'
import { HtmlToJSX } from './htmlToJsx'

const API_ENTRY = 'https://api.iconify.design'

export async function getSvgLocal(icon: string, size = '1em', color = 'currentColor') {
  const data = await loadIcon(icon)
  if (!data)
    return
  const built = buildIcon(data, { height: size })
  if (!built)
    return
  return `<svg ${Object.entries(built.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}>${built.body}</svg>`.replace('currentColor', color)
}

export async function getSvg(icon: string, size = '1em', color = 'currentColor') {
  return await getSvgLocal(icon, size, color)
   || await fetch(`${API_ENTRY}/${icon}.svg?inline=false&height=${size}&color=${encodeURIComponent(color)}`).then(r => r.text()) || ''
}

export async function getSvgSymbol(icon: string, size = '1em', color = 'currentColor') {
  const svgMarkup = await getSvg(icon, size, color)

  const symbolElem = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
  const node = document.createElement('div') // Create any old element
  node.innerHTML = svgMarkup

  // Grab the inner HTML and move into a symbol element
  symbolElem.innerHTML = node.querySelector('svg')!.innerHTML
  symbolElem.setAttribute('viewBox', node.querySelector('svg')!.getAttribute('viewBox')!)
  symbolElem.id = icon.replace(/\:/, '-') // Simple slugify for quick symbol lookup

  return symbolElem?.outerHTML
}

export function toComponentName(icon: string) {
  return icon.split(/:|-|_/).filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join('')
}

export function ClearSvg(svgCode: string, reactJSX?: boolean) {
  const el = document.createElement('div')
  el.innerHTML = svgCode
  const svg = el.getElementsByTagName('svg')[0]
  const keep = ['viewBox', 'width', 'height', 'focusable', 'xmlns', 'xlink']
  for (const key of Object.values(svg.attributes)) {
    if (keep.includes(key.localName))
      continue
    svg.removeAttributeNode(key)
  }
  return HtmlToJSX(el.innerHTML, reactJSX)
}

export function SvgToJSX(svg: string, name: string, snippet: boolean) {
  const code = `
export function ${name}(props) {
  return (
    ${ClearSvg(svg, true).replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
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
    ${ClearSvg(svg, true).replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
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

export function SvgToSvelte(svg: string) {
  return ClearSvg(svg)
}

export async function getIconSnippet(icon: string, type: string, snippet = true, color = 'currentColor'): Promise<string | undefined> {
  if (!icon)
    return

  let url = `${API_ENTRY}/${icon}.svg`
  if (color !== 'currentColor')
    url = `${url}?color=${encodeURIComponent(color)}`

  switch (type) {
    case 'id':
      return getTransformedId(icon)
    case 'url':
      return url
    case 'html':
      return `<span class="iconify" data-icon="${icon}" data-inline="false"${color === 'currentColor' ? '' : ` style="color: ${color}"`}></span>`
    case 'css':
      return `background: url('${url}') no-repeat center center / contain;`
    case 'svg':
      return await getSvg(icon, '32', color)
    case 'svg-symbol':
      return await getSvgSymbol(icon, '32', color)
    case 'data_url':
      return `data:image/svg+xml;base64,${Base64.encode(await getSvg(icon, undefined, color))}`
    case 'pure-jsx':
      return ClearSvg(await getSvg(icon, undefined, color))
    case 'jsx':
      return SvgToJSX(await getSvg(icon, undefined, color), toComponentName(icon), snippet)
    case 'tsx':
      return SvgToTSX(await getSvg(icon, undefined, color), toComponentName(icon), snippet)
    case 'vue':
      return SvgToVue(await getSvg(icon, undefined, color), toComponentName(icon))
    case 'svelte':
      return SvgToSvelte(await getSvg(icon, undefined, color))
    case 'unplugin':
      return `import ${toComponentName(icon)} from '~icons/${icon.split(':')[0]}/${icon.split(':')[1]}'`
  }
}

export function getIconDownloadLink(icon: string) {
  return `${API_ENTRY}/${icon}.svg?download=true&inline=false&height=auto`
}
