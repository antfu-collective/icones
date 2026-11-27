import { defineBehavior, link, option, port } from '@sekiso/core/behavior'
import { createDraft } from './draft'

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
    search: option.string(),
  },
  ports: {
    /** Opens the home page in place of this one. */
    home: port(),
    setSearch: port<(search: string) => void>(),
    toggleFavorite: port<(id: string) => void>(),
  },
  state: options => ({ draft: options.search ?? '' }),
  api: context => createDraft(context as never, (o: { search?: string }) => o.search, search => context.options().setSearch?.(search)),
  slots: slot => ({
    root: slot({}),
    back: slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({ title: part.props.label }),
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
        type: 'text',
        value: state.draft,
        placeholder: part.props.label,
        autocomplete: 'off',
      }),
      on: {
        input: (event, { api }) => api.type((event.target as HTMLInputElement).value),
      },
    }),
    clear: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.draft !== '',
      attrs: (_state, part) => ({ title: part.props.label }),
      press: ({ api }) => api.clear(),
    }),
    link: slot<{ value: string }>({
      props: { value: 'key' },
      ...link((state, part) => hrefOf(part.key, state.query), (state, part) => ({
        'aria-current': state.current === part.key
          ? 'page'
          : undefined,
      })),
    }),
    favorite: slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
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
