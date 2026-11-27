import { defineBehavior, port } from '@sekiso/core/behavior'
import { external } from './link'

/** Where the help links go, by key. */
const LINKS: Record<string, string> = {
  'iconify': 'https://iconify.design/',
  'unocss': 'https://github.com/antfu/unocss',
  'preset-icons': 'https://github.com/unocss/unocss/tree/main/packages-presets/preset-icons',
  'css-post': 'https://antfu.me/posts/icons-in-pure-css',
  'unplugin-icons': 'https://github.com/antfu/unplugin-icons',
  'components-post': 'https://antfu.me/posts/journey-with-icons-continues',
}

/** A dialog on how to use an icon. */
export const help = defineBehavior({
  name: 'help',
  inputs: { open: false },
  ports: {
    close: port(),
  },
  slots: slot => ({
    root: slot({}),
    backdrop: slot({
      attrs: () => ({ 'aria-hidden': 'true' }),
      on: {
        click: (_event, { api }) => api.close(),
      },
    }),
    panel: slot({
      role: 'dialog',
      attrs: () => ({ 'aria-modal': 'true' }),
    }),
    link: slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (_state, part) => external(LINKS[part.key] ?? ''),
    }),
  }),
  agent: {
    actions: ['close'],
  },
})

/** What the app is busy with, like packing a download. */
export const progress = defineBehavior({
  name: 'progress',
  inputs: { active: false, message: '' },
  slots: slot => ({
    root: slot({
      attrs: state => ({
        'aria-live': 'polite',
        'aria-hidden': state.active ? undefined : 'true',
      }),
    }),
  }),
  agent: { actions: [] },
})
