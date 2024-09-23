import type { HighlighterCore } from 'shiki/core'
import { createHighlighterCore } from 'shiki/core'
import langAstro from 'shiki/langs/astro.mjs'
import langHtml from 'shiki/langs/html.mjs'
import langJsx from 'shiki/langs/jsx.mjs'
import langSvelte from 'shiki/langs/svelte.mjs'
import langTsx from 'shiki/langs/tsx.mjs'
import langVue from 'shiki/langs/vue.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'

export const shiki = computedAsync<HighlighterCore>(async (onCancel) => {
  const shiki = await createHighlighterCore({
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

  onCancel(() => shiki?.dispose())
  return shiki
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
