import type { HighlighterCore } from 'shiki/core'
import { createHighlighterCore } from 'shiki/core'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import langHtml from 'shiki/langs/html.mjs'
import langJsx from 'shiki/langs/jsx.mjs'
import langTsx from 'shiki/langs/tsx.mjs'
import langVue from 'shiki/langs/vue.mjs'
import langAstro from 'shiki/langs/astro.mjs'
import langSvelte from 'shiki/langs/svelte.mjs'

export const shiki = computedAsync<HighlighterCore>(async () => {
  return await createHighlighterCore({
    loadWasm: () => import('shiki/wasm'),
    themes: [
      vitesseDark,
      vitesseLight,
    ],
    langs: [
      langHtml,
      langJsx,
      langTsx,
      langVue,
      langAstro,
      langSvelte,
    ],
  })
})

export function highlight(code: string, lang: string) {
  if (!shiki.value)
    return code
  return shiki.value.codeToHtml(code, {
    lang,
    defaultColor: false,
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
  })
}
