import { defineBehavior, external } from '@sekiso/core/behavior'

/** The credits and the build time, at the end of a long page. */
export const footer = defineBehavior({
  name: 'footer',
  inputs: {
    /** When the app was built, formatted for the visitor. */
    time: '',
    /** How long ago the app was built, in words. */
    ago: '',
  },
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
