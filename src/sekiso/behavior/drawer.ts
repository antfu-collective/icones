import type { Navigate } from './link'
import { definePrimitive } from '@ui-sdk/core'
import { createDraft } from './draft'
import { followLink } from './link'

/** A row of the sidebar: an icon set, or `all` and `recent`. */
export interface DrawerItem {
  id: string
  name: string
  special: boolean
  hidden?: boolean
  /** The icons it has, or for `all` the sets. */
  count: number
}

export interface DrawerOptions {
  items?: readonly DrawerItem[]
  /** The id of the open set. */
  current?: string
  search?: string
  favorites?: readonly string[]
  /** The search of icons, kept when another set opens. */
  query?: string
  navigate?: Navigate
  /** Opens the home page in place of this one. */
  home?: () => void
  setSearch?: (search: string) => void
  toggleFavorite?: (id: string) => void
}

function stateOf(options: DrawerOptions) {
  return {
    items: options.items ?? [],
    current: options.current ?? '',
    favorites: options.favorites ?? [],
    query: options.query ?? '',
  }
}

function hrefOf(id: string, query: string): string {
  return query
    ? `/collection/${id}?s=${encodeURIComponent(query)}`
    : `/collection/${id}`
}

/** The sidebar of an icon set's page: every set, to go from one to another. */
export const drawer = definePrimitive({
  name: 'drawer',
  options: {
    items: 'value',
    current: 'string',
    search: 'string',
    favorites: 'value',
    query: 'string',
    navigate: 'value',
    home: 'value',
    setSearch: 'value',
    toggleFavorite: 'value',
  },
  state: (options: DrawerOptions) => ({
    ...stateOf(options),
    draft: options.search ?? '',
  }),
  sync: options => stateOf(options),
  api: (context) => {
    const draft = createDraft(context as never, (o: DrawerOptions) => o.search, search => context.options().setSearch?.(search))
    return {
      ...draft,
      home(): void {
        context.options().home?.()
      },
      follow(event: Event, to: string): void {
        followLink(event, to, context.options().navigate)
      },
      toggleFavorite(id: string): void {
        context.options().toggleFavorite?.(id)
      },
    }
  },
  slots: slot => ({
    root: slot({}),
    back: slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({ 'type': 'button', 'aria-label': part.props.label, 'title': part.props.label }),
      press: ({ api }) => api.home(),
    }),
    search: slot({
      attrs: () => ({ action: '/', method: 'get' }),
      on: {
        submit: event => event.preventDefault(),
      },
    }),
    input: slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        'type': 'text',
        'value': state.draft,
        'aria-label': part.props.label,
        'placeholder': part.props.label,
        'autocomplete': 'off',
      }),
      on: {
        input: (event, { api }) => api.type((event.target as HTMLInputElement).value),
      },
    }),
    clear: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.draft !== '',
      attrs: (_state, part) => ({ 'type': 'button', 'aria-label': part.props.label, 'title': part.props.label }),
      press: ({ api }) => api.clear(),
    }),
    link: slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        'href': hrefOf(part.key, state.query),
        'aria-current': state.current === part.key
          ? 'page'
          : undefined,
      }),
      on: {
        click: (event, { api, key, store }) => api.follow(event, hrefOf(key, store.get().query)),
      },
    }),
    favorite: slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
        'type': 'button',
        'aria-label': part.props.label,
        'title': part.props.label,
        'aria-pressed': String(state.favorites.includes(part.key)),
      }),
      press: ({ api, key }, event) => {
        event?.preventDefault()
        api.toggleFavorite(key)
      },
    }),
  }),
  agent: {
    actions: ['type', 'clear', 'toggleFavorite'],
  },
})
