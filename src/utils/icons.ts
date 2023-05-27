import { buildIcon, loadIcon } from 'iconify-icon'
import { getTransformedId } from '../store'
import Base64 from './base64'
import { HtmlToJSX } from './htmlToJsx'
import { prettierCode } from './prettier'

const API_ENTRY = 'https://api.iconify.design'

export async function getSvgLocal(icon: string, size = '1em', color = 'currentColor') {
  const data = await loadIcon(icon)
  if (!data)
    return
  const built = buildIcon(data, { height: size })
  if (!built)
    return
  const xlink = built.body.includes('xlink:') ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : ''
  return `<svg xmlns="http://www.w3.org/2000/svg"${xlink} ${Object.entries(built.attributes).map(([k, v]) => `${k}="${v}"`).join(' ')}>${built.body}</svg>`.replaceAll('currentColor', color)
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
    return prettierCode(code, 'babel-ts')
  else
    return prettierCode(`import React from 'react'\n${code}\nexport default ${name}`, 'babel-ts')
}

export function SvgToTSX(svg: string, name: string, snippet: boolean, reactJSX = true) {
  let code = `
export function ${name}(props: SVGProps<SVGSVGElement>) {
  return (
    ${ClearSvg(svg, reactJSX).replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
  )
}`

  code = snippet ? code : `import React, { SVGProps } from 'react'\n${code}\nexport default ${name}`
  return prettierCode(code, 'babel-ts')
}

export function SvgToQwik(svg: string, name: string, snippet: boolean) {
  let code = `
export function ${name}(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    ${ClearSvg(svg, false).replace(/<svg (.*?)>/, '<svg $1 {...props} key={key}>')}
  )
}`

  code = snippet ? code : `import type { QwikIntrinsicElements } from '@builder.io/qwik'\n${code}\nexport default ${name}`
  return prettierCode(code, 'babel-ts')
}

export function SvgToVue(svg: string, name: string, isTs?: boolean) {
  const contet = `
<template>
  ${ClearSvg(svg)}
</template>

<script>
export default {
  name: '${name}'
}
</script>`
  const code = isTs ? contet.replace('<script>', '<script lang="ts">') : contet
  return prettierCode(code, 'vue')
}

export function SvgToSolid(svg: string, name: string, snippet: boolean) {
  let code = `
export function ${name}(props: JSX.IntrinsicElements['svg'], key: string) {
  return (
    ${ClearSvg(svg, false).replace(/<svg (.*?)>/, '<svg $1 {...props} key={key}>')}
  )
}`

  code = snippet ? code : `import type { JSX } from 'solid-js'\n${code}\nexport default ${name}`
  return prettierCode(code, 'babel-ts')
}

export function SvgToSvelte(svg: string) {
  return ClearSvg(svg)
}

export async function getIconSnippet(icon: string, type: string, snippet = true, color = 'currentColor'): Promise<string | undefined> {
  if (!icon)
    return
  debugger
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
    case 'qwik':
      return SvgToQwik(await getSvg(icon, undefined, color), toComponentName(icon), snippet)
    case 'vue':
      return SvgToVue(await getSvg(icon, undefined, color), toComponentName(icon))
    case 'vue-ts':
      return SvgToVue(await getSvg(icon, undefined, color), toComponentName(icon), true)
    case 'solid':
      return SvgToSolid(await getSvg(icon, undefined, color), toComponentName(icon), snippet)
    case 'svelte':
      return SvgToSvelte(await getSvg(icon, undefined, color))
    case 'unplugin':
      return `import ${toComponentName(icon)} from '~icons/${icon.split(':')[0]}/${icon.split(':')[1]}'`
  }
}

export function getIconDownloadLink(icon: string) {
  return `${API_ENTRY}/${icon}.svg?download=true&inline=false&height=auto`
}
