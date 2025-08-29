import type { BuiltInParserName as PrettierParser } from 'prettier'
import type { CollectionInfo } from '../data'
import { isVSCode } from '../env'
import { getTransformedId } from '../store'
import { getSvgSymbol } from './pack'
import {
  API_ENTRY,
  bufferToString,
  ClearSvg,
  getSvg,
  SvgToAstro,
  SvgToDataURL,
  SvgToJSX,
  SvgToQwik,
  SvgToReactNative,
  SvgToSolid,
  SvgToSvelte,
  SvgToTSX,
  SvgToVue,
  toComponentName,
} from './svg'
import { svgToPngDataUrl } from './svgToPng'

export interface Snippet {
  name: string
  tag?: string
  lang: string // for shiki
  prettierParser: PrettierParser // for prettier
}
export { toComponentName }

export async function Download(blob: Blob, name: string) {
  if (isVSCode) {
    blob.arrayBuffer().then(
      buffer => vscode.postMessage({
        command: 'download',
        name,
        text: bufferToString(buffer),
      }),
    )
  }
  else {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    a.remove()
  }
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
    'unocss': { name: 'UnoCSS', lang: 'html', prettierParser: 'html' },
    'unocss-attributify': { name: 'UnoCSS', tag: 'attributify', lang: 'html', prettierParser: 'html' },
  },
  Links: {
    url: { name: 'URL', lang: 'html', prettierParser: 'html' },
    data_url: { name: 'Data URL', lang: 'html', prettierParser: 'html' },
  },
}

export async function getIconSnippet(
  collections: CollectionInfo[],
  icon: string,
  type: string,
  snippet = true,
  color = 'currentColor',
): Promise<string | undefined> {
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
      return await getSvg(collections, icon, '32', color)
    case 'png':
      return await svgToPngDataUrl(await getSvg(collections, icon, '32', color))
    case 'svg-symbol':
      return await getSvgSymbol(collections, icon, '32', color)
    case 'data_url':
      return SvgToDataURL(await getSvg(collections, icon, undefined, color))
    case 'pure-jsx':
      return ClearSvg(await getSvg(collections, icon, undefined, color))
    case 'jsx':
      return SvgToJSX(await getSvg(collections, icon, undefined, color), toComponentName(icon), snippet)
    case 'tsx':
      return SvgToTSX(await getSvg(collections, icon, undefined, color), toComponentName(icon), snippet)
    case 'qwik':
      return SvgToQwik(await getSvg(collections, icon, undefined, color), toComponentName(icon), snippet)
    case 'vue':
      return SvgToVue(await getSvg(collections, icon, undefined, color), toComponentName(icon))
    case 'vue-ts':
      return SvgToVue(await getSvg(collections, icon, undefined, color), toComponentName(icon), true)
    case 'solid':
      return SvgToSolid(await getSvg(collections, icon, undefined, color), toComponentName(icon), snippet)
    case 'svelte':
      return SvgToSvelte(await getSvg(collections, icon, undefined, color))
    case 'astro':
      return SvgToAstro(await getSvg(collections, icon, undefined, color))
    case 'react-native':
      return SvgToReactNative(await getSvg(collections, icon, undefined, color), toComponentName(icon), snippet)
    case 'unplugin':
      return `import ${toComponentName(icon)} from '~icons/${icon.split(':')[0]}/${icon.split(':')[1]}'`
    case 'unocss':
      return `<div class="i-${icon}" />`
    case 'unocss-attributify':
      return `<div i-${icon} />`
  }
}

export function getIconDownloadLink(icon: string) {
  return `${API_ENTRY}/${icon}.svg?download=true&inline=false&height=auto`
}
