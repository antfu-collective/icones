import { definePrimitive } from '@ui-sdk/core'
import { external } from './link'

export interface FooterOptions {
  /** When the app was built, formatted for the visitor. */
  time?: string
  /** How long ago the app was built, in words. */
  ago?: string
}

function stateOf(options: FooterOptions) {
  return { time: options.time ?? '', ago: options.ago ?? '' }
}

/** The credits and the build time, at the end of a long page. */
export const footer = definePrimitive({
  name: 'footer',
  options: { time: 'string', ago: 'string' },
  state: (options: FooterOptions) => stateOf(options),
  sync: options => stateOf(options),
  api: () => ({}),
  slots: slot => ({
    root: slot({}),
    author: slot({
      attrs: () => external('https://github.com/antfu'),
    }),
    iconify: slot({
      attrs: () => external('https://iconify.design'),
    }),
  }),
  agent: { actions: [] },
})
