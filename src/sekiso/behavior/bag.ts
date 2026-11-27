import type { Navigate } from './link'
import { defineBehavior, port } from '@sekiso/core/behavior'
import { followLink } from './link'

/** What the bag can pack its icons into. */
export type BagPack = 'iconfont' | 'sprite' | `zip:${string}`

function labelled(label: string): Record<string, string> {
  return { 'aria-label': label, 'title': label }
}

/** The bag: the icons the user picked, to share or download together. */
export const bag = defineBehavior({
  name: 'bag',
  inputs: {
    open: false,
    count: 0,
    /** The share link was just copied. */
    shared: false,
    /** The formats of a zip of the icons. */
    formats: [] as readonly { type: string, name: string, tag?: string }[],
  },
  ports: {
    close: port(),
    share: port(),
    /** Asks the user, then empties the bag. */
    clear: port(),
    pack: port<(pack: BagPack) => void>(),
  },
  state: () => ({ zipOpen: false }),
  api: context => ({
    toggleZip(open = !context.store.get().zipOpen): void {
      context.store.set({ zipOpen: open })
    },
  }),
  slots: slot => ({
    'root': slot({}),
    'backdrop': slot({
      attrs: () => ({ 'aria-hidden': 'true' }),
      on: {
        click: (_event, { api }) => api.close(),
      },
    }),
    'panel': slot({
      role: 'dialog',
      attrs: () => ({ 'aria-modal': 'true' }),
    }),
    'share': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.count > 0,
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.share(),
    }),
    'clear': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.count > 0,
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.clear(),
    }),
    'close': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.close(),
    }),
    'zip-options': slot({
      present: state => state.zipOpen && state.count > 0,
    }),
    'zip-close': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.toggleZip(false),
    }),
    'zip': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: () => ({ type: 'button' }),
      press: ({ api, key }) => api.pack(`zip:${key}`),
    }),
    'zip-toggle': slot({
      attrs: state => ({
        'type': 'button',
        'aria-expanded': String(state.zipOpen),
      }),
      press: ({ api }) => api.toggleZip(),
    }),
    'iconfont': slot({
      attrs: () => ({ type: 'button' }),
      press: ({ api }) => api.pack('iconfont'),
    }),
    'sprite': slot({
      attrs: () => ({ type: 'button' }),
      press: ({ api }) => api.pack('sprite'),
    }),
  }),
  agent: {
    actions: ['close', 'share', 'pack'],
  },
})

/** The page of a shared bag: the icons of a link, to add to the user's own bag. */
export const sharedBag = defineBehavior({
  name: 'shared-bag',
  inputs: {
    /** The icons of the link. */
    count: 0,
    /** Those not in the user's bag yet. */
    missing: 0,
    /** The icons in the user's bag. */
    bag: 0,
  },
  ports: {
    navigate: port<Navigate>(),
    addAll: port(),
  },
  api: context => ({
    follow(event: Event, to: string): void {
      followLink(event, to, context.options().navigate)
    },
  }),
  slots: slot => ({
    root: slot({}),
    add: slot({
      present: state => state.count > 0,
      attrs: state => ({
        type: 'button',
        disabled: state.missing === 0
          ? ''
          : undefined,
      }),
      press: ({ api }) => api.addAll(),
    }),
    browse: slot({
      attrs: () => ({ href: '/collection/all' }),
      on: {
        click: (event, { api }) => api.follow(event, '/collection/all'),
      },
    }),
  }),
  agent: {
    actions: ['addAll'],
  },
})
