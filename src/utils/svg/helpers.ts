import type { Node } from 'ultrahtml'
import type { CollectionInfo } from '../../data'
import { encodeSvgForCss } from '@iconify/utils'
import { parse, transformSync } from 'ultrahtml'
import Base64 from './base64'
import { HtmlToJSX } from './htmlToJsx'
import { getSvg } from './loader'
import { prettierCode } from './prettier'

export type PackType = 'svg' | 'tsx' | 'jsx' | 'vue' | 'solid' | 'qwik' | 'svelte' | 'astro' | 'react-native' | 'json'

export function normalizeZipFleName(svgName: string): string {
  return svgName.replace(':', '-')
}

export function toComponentName(icon: string) {
  return icon.split(/[:\-_]/).filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join('')
}

export function ClearSvg(svgCode: string, reactJSX?: boolean) {
  const result = transformSync(parse(svgCode).children[0] as Node, [
    (node: Node): Node => {
      if (node.name !== 'svg')
        return node

      const attributes = node.attributes || {}
      // keep only 'viewBox', 'width', 'height', 'focusable', 'xmlns', 'xlink' attributes
      const allowedAttributes = ['viewBox', 'width', 'height', 'focusable', 'xmlns', 'xlink']
      for (const key of Object.keys(attributes)) {
        if (!allowedAttributes.includes(key)) {
          delete attributes[key]
        }
      }

      node.attributes = attributes

      return node
    },
  ])

  return HtmlToJSX(result, reactJSX)
}

export function SvgToDataURL(svg: string) {
  const base64 = `data:image/svg+xml;base64,${Base64.encode(svg)}`
  const plain = `data:image/svg+xml,${encodeSvgForCss(svg)}`
  // Return the shorter of the two data URLs
  return base64.length < plain.length ? base64 : plain
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

export async function LoadIconSvgs(
  collections: CollectionInfo[],
  icons: string[],
) {
  return await Promise.all(
    icons
      .filter(Boolean)
      .sort()
      .map(async (name) => {
        return {
          name,
          svg: await getSvg(collections, name),
        }
      }),
  )
}
