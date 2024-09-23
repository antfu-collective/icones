import type { BuiltInParserName as PrettierParser } from 'prettier'
import { encodeSvgForCss } from '@iconify/utils'
import { buildIcon, loadIcon } from 'iconify-icon'
import { getTransformedId } from '../store'
import Base64 from './base64'
import { HtmlToJSX } from './htmlToJsx'
import { prettierCode } from './prettier'
import { svgToPngDataUrl } from './svgToPng'

export interface Snippet {
  name: string
  tag?: string
  lang: string // for shiki
  prettierParser: PrettierParser // for prettier
}

export const SnippetMap: Record<string, Record<string, Snippet>> = {
  Snippets: {
    'svg': { name: 'SVG', lang: 'html', prettierParser: 'html' },
    'svg-symbol': { name: 'SVG Symbol', lang: 'html', prettierParser: 'html' },
    'png': { name: 'PNG', lang: 'html', prettierParser: 'html' },
    'html': { name: 'Iconify', lang: 'html', prettierParser: 'html' },
    'pure-jsx': { name: 'JSX', lang: 'jsx', prettierParser: 'typescript' },
  },
  Components: {
    'vue': { name: 'Vue', lang: 'vue', prettierParser: 'vue' },
    'vue-ts': { name: 'Vue', tag: 'TS', lang: 'vue', prettierParser: 'vue' },
    'jsx': { name: 'React', lang: 'jsx', prettierParser: 'typescript' },
    'tsx': { name: 'React', tag: 'TS', lang: 'tsx', prettierParser: 'typescript' },
    'svelte': { name: 'Svelte', lang: 'svelte', prettierParser: 'typescript' },
    'qwik': { name: 'Qwik', lang: 'tsx', prettierParser: 'typescript' },
    'solid': { name: 'Solid', lang: 'tsx', prettierParser: 'typescript' },
    'astro': { name: 'Astro', lang: 'astro', prettierParser: 'typescript' },
    'react-native': { name: 'React Native', lang: 'tsx', prettierParser: 'typescript' },
    'unplugin': { name: 'Unplugin Icons', lang: 'tsx', prettierParser: 'typescript' },
  },
  Links: {
    url: { name: 'URL', lang: 'html', prettierParser: 'html' },
    data_url: { name: 'Data URL', lang: 'html', prettierParser: 'html' },
  },
}

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
  symbolElem.id = icon.replace(/:/, '-') // Simple slugify for quick symbol lookup

  return symbolElem?.outerHTML
}

export function toComponentName(icon: string) {
  return icon.split(/[:\-_]/).filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join('')
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
  const content = `
<template>
  ${ClearSvg(svg)}
</template>

<script>
export default {
  name: '${name}'
}
</script>`
  const code = isTs ? content.replace('<script>', '<script lang="ts">') : content
  return prettierCode(code, 'vue')
}

export function SvgToSolid(svg: string, name: string, snippet: boolean) {
  let code = `
export function ${name}(props: JSX.IntrinsicElements['svg']) {
  return (
    ${svg.replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
  )
}`

  code = snippet ? code : `import type { JSX } from 'solid-js'\n${code}\nexport default ${name}`
  return prettierCode(code, 'babel-ts')
}

export function SvgToSvelte(svg: string) {
  return `${svg.replace(/<svg (.*?)>/, '<svg $1 {...$$$props}>')}`
}

export function SvgToAstro(svg: string) {
  return `
---
const props = Astro.props 
---

${svg.replace(/<svg (.*?)>/, '<svg $1 {...props}>')}
`
}

export function SvgToReactNative(svg: string, name: string, snippet: boolean) {
  function replaceTags(svg: string, replacements: {
    from: string
    to: string
  }[]): string {
    let result = svg
    replacements.forEach(({ from, to }) => {
      result = result.replace(new RegExp(`<${from}(.*?)>`, 'g'), `<${to}$1>`)
        .replace(new RegExp(`</${from}>`, 'g'), `</${to}>`)
    })
    return result
  }

  function generateImports(usedComponents: string[]): string {
  // Separate Svg from the other components
    const svgIndex = usedComponents.indexOf('Svg')
    if (svgIndex !== -1)
      usedComponents.splice(svgIndex, 1)

    // Join all other component names with a comma and wrap them in curly braces
    const componentsString = usedComponents.length > 0 ? `{ ${usedComponents.join(', ')} }` : ''

    // Return the consolidated import statement, ensuring Svg is imported as a default import
    return `import Svg, ${componentsString} from 'react-native-svg';`
  }

  const replacements: {
    from: string
    to: string
  }[] = [
    { from: 'svg', to: 'Svg' },
    { from: 'path', to: 'Path' },
    { from: 'g', to: 'G' },
    { from: 'circle', to: 'Circle' },
    { from: 'rect', to: 'Rect' },
    { from: 'line', to: 'Line' },
    { from: 'polyline', to: 'Polyline' },
    { from: 'polygon', to: 'Polygon' },
    { from: 'ellipse', to: 'Ellipse' },
    { from: 'text', to: 'Text' },
    { from: 'tspan', to: 'Tspan' },
    { from: 'textPath', to: 'TextPath' },
    { from: 'defs', to: 'Defs' },
    { from: 'use', to: 'Use' },
    { from: 'symbol', to: 'Symbol' },
    { from: 'linearGradient', to: 'LinearGradient' },
    { from: 'radialGradient', to: 'RadialGradient' },
    { from: 'stop', to: 'Stop' },
  ]

  const reactNativeSvgCode = replaceTags(ClearSvg(svg, true), replacements)
    .replace(/className=/g, '')
    .replace(/href=/g, 'xlinkHref=')
    .replace(/clip-path=/g, 'clipPath=')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')

  const svgComponents = replacements.map(({ to }) => to)
  const imports = generateImports(svgComponents.filter(component => reactNativeSvgCode.includes(component)))

  let code = `
${imports}

export function ${name}(props) {
 return (
    ${reactNativeSvgCode}
 )
}`

  if (!snippet)
    code = `import React from 'react';\n${code}\nexport default ${name}`

  return prettierCode(code, 'babel-ts')
}

export function SvgToDataURL(svg: string) {
  const base64 = `data:image/svg+xml;base64,${Base64.encode(svg)}`
  const plain = `data:image/svg+xml,${encodeSvgForCss(svg)}`
  // Return the shorter of the two data URLs
  return base64.length < plain.length ? base64 : plain
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
    case 'png':
      return await svgToPngDataUrl(await getSvg(icon, '32', color))
    case 'svg-symbol':
      return await getSvgSymbol(icon, '32', color)
    case 'data_url':
      return SvgToDataURL(await getSvg(icon, undefined, color))
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
    case 'astro':
      return SvgToAstro(await getSvg(icon, undefined, color))
    case 'react-native':
      return SvgToReactNative(await getSvg(icon, undefined, color), toComponentName(icon), snippet)
    case 'unplugin':
      return `import ${toComponentName(icon)} from '~icons/${icon.split(':')[0]}/${icon.split(':')[1]}'`
  }
}

export function getIconDownloadLink(icon: string) {
  return `${API_ENTRY}/${icon}.svg?download=true&inline=false&height=auto`
}
