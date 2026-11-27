import type { Navigate } from './link'
import { definePrimitive } from '@ui-sdk/core'
import { followLink } from './link'

/** What the bag can pack its icons into. */
export type BagPack = 'iconfont' | 'sprite' | `zip:${string}`

export interface BagOptions {
  open?: boolean
  count?: number
  /** The share link was just copied. */
  shared?: boolean
  /** The formats of a zip of the icons. */
  formats?: readonly { type: string, name: string, tag?: string }[]
  close?: () => void
  share?: () => void
  /** Port: asks the user, then empties the bag. */
  clear?: () => void
  pack?: (pack: BagPack) => void
}

function stateOf(options: BagOptions) {
  return {
    open: options.open ?? false,
    count: options.count ?? 0,
    shared: options.shared ?? false,
    formats: options.formats ?? [],
  }
}

function labelled(label: string): Record<string, string> {
  return { 'aria-label': label, 'title': label }
}

/** The bag: the icons the user picked, to share or download together. */
export const bag = definePrimitive({
  name: 'bag',
  options: {
    open: 'boolean',
    count: 'number',
    shared: 'boolean',
    formats: 'value',
    close: 'value',
    share: 'value',
    clear: 'value',
    pack: 'value',
  },
  state: (options: BagOptions) => ({
    ...stateOf(options),
    zipOpen: false,
  }),
  sync: options => stateOf(options),
  api: context => ({
    close(): void {
      context.options().close?.()
    },
    share(): void {
      context.options().share?.()
    },
    clear(): void {
      context.options().clear?.()
    },
    toggleZip(open = !context.store.get().zipOpen): void {
      context.store.set({ zipOpen: open })
    },
    pack(pack: BagPack): void {
      context.options().pack?.(pack)
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

export interface SharedBagOptions {
  /** The icons of the link. */
  count?: number
  /** Those not in the user's bag yet. */
  missing?: number
  /** The icons in the user's bag. */
  bag?: number
  navigate?: Navigate
  addAll?: () => void
}

function sharedStateOf(options: SharedBagOptions) {
  return { count: options.count ?? 0, missing: options.missing ?? 0, bag: options.bag ?? 0 }
}

/** The page of a shared bag: the icons of a link, to add to the user's own bag. */
export const sharedBag = definePrimitive({
  name: 'shared-bag',
  options: {
    count: 'number',
    missing: 'number',
    bag: 'number',
    navigate: 'value',
    addAll: 'value',
  },
  state: (options: SharedBagOptions) => sharedStateOf(options),
  sync: options => sharedStateOf(options),
  api: context => ({
    addAll(): void {
      context.options().addAll?.()
    },
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
