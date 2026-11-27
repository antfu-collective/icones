import { definePrimitive } from '@ui-sdk/core'
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

export interface HelpOptions {
  open?: boolean
  close?: () => void
}

/** A dialog on how to use an icon. */
export const help = definePrimitive({
  name: 'help',
  options: { open: 'boolean', close: 'value' },
  state: (options: HelpOptions) => ({ open: options.open ?? false }),
  sync: options => ({ open: options.open ?? false }),
  api: context => ({
    close(): void {
      context.options().close?.()
    },
  }),
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

export interface ProgressOptions {
  active?: boolean
  message?: string
}

/** What the app is busy with, like packing a download. */
export const progress = definePrimitive({
  name: 'progress',
  options: { active: 'boolean', message: 'string' },
  state: (options: ProgressOptions) => ({ active: options.active ?? false, message: options.message ?? '' }),
  sync: options => ({ active: options.active ?? false, message: options.message ?? '' }),
  api: () => ({}),
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
