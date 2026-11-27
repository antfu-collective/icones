import type { Navigate } from './link'
import { defineBehavior, option, port } from '@sekiso/core/behavior'
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

function hrefOf(id: string, query: string): string {
  return query
    ? `/collection/${id}?s=${encodeURIComponent(query)}`
    : `/collection/${id}`
}

/** The sidebar of an icon set's page: every set, to go from one to another. */
export const drawer = defineBehavior({
  name: 'drawer',
  inputs: {
    items: [] as readonly DrawerItem[],
    /** The id of the open set. */
    current: '',
    favorites: [] as readonly string[],
    /** The search of icons, kept when another set opens. */
    query: '',
  },
  options: {
    /** The search of icon sets. The field follows it, ahead of it while the typing goes on. */
    search: option<string>('string'),
  },
  ports: {
    navigate: port<Navigate>(),
    /** Opens the home page in place of this one. */
    home: port(),
    setSearch: port<(search: string) => void>(),
    toggleFavorite: port<(id: string) => void>(),
  },
  state: options => ({ draft: options.search ?? '' }),
  api: (context) => {
    const draft = createDraft(context as never, (o: { search?: string }) => o.search, search => context.options().setSearch?.(search))
    return {
      ...draft,
      follow(event: Event, to: string): void {
        followLink(event, to, context.options().navigate)
      },
    }
  },
  slots: slot => ({
    root: slot({}),
    back: slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({ 'aria-label': part.props.label, 'title': part.props.label }),
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
      attrs: (_state, part) => ({ 'aria-label': part.props.label, 'title': part.props.label }),
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
