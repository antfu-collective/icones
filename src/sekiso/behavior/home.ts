import { defineBehavior, link, navigate, option, port } from '@sekiso/core/behavior'

/** How long the search waits for the typing to stop. */
const DEBOUNCE = 250

/** What a card shows of an icon set. */
export interface HomeCollection {
  id: string
  name: string
  author?: { name: string }
  license?: { title: string }
  total?: number
  /** The set is deprecated. */
  hidden?: boolean
  sampleIcons?: string[]
}

/** `favorite` and `recent` are the user's own; `result` holds the matches of a search. */
export type HomeSectionType = 'favorite' | 'recent' | 'normal' | 'result'

export interface HomeSection {
  name: string
  type: HomeSectionType
  collections: readonly HomeCollection[]
}

/** The search of all icons, for the words typed in the search of icon sets. */
export function searchAllHref(search: string): string {
  return `/collection/all?s=${encodeURIComponent(search)}`
}

/** The home page: a search, and the icon sets by category. */
export const home = defineBehavior({
  name: 'home',
  inputs: {
    sections: [] as readonly HomeSection[],
    /** The ids of the favorite icon sets. */
    favorites: [] as readonly string[],
    /** The keyboard has a Command key, for the shortcut hint. */
    mac: false,
  },
  options: {
    /** The search of icon sets, by name, author or category. */
    search: option<string>('string'),
  },
  ports: {
    navigate,
    /** Takes the search once the typing stops. */
    setSearch: port<(search: string) => void>(),
    toggleFavorite: port<(id: string) => void>(),
    removeRecent: port<(id: string) => void>(),
  },
  state: options => ({
    /** What is typed, ahead of the search while the typing goes on. */
    draft: options.search ?? '',
  }),
  api: (context) => {
    const { store } = context
    let timer: ReturnType<typeof setTimeout> | undefined
    let sent = context.options().search ?? ''

    function send(search: string): void {
      clearTimeout(timer)
      sent = search
      context.options().setSearch?.(search)
    }

    // A search set from elsewhere, not the one this field sent, replaces what is typed
    context.onOptions((options) => {
      const search = options.search ?? ''
      if (search !== sent) {
        sent = search
        store.set({ draft: search })
      }
    })
    context.onDestroy(() => clearTimeout(timer))

    function clear(): void {
      store.set({ draft: '' })
      send('')
    }

    return {
      type(draft: string): void {
        store.set({ draft })
        clearTimeout(timer)
        timer = setTimeout(send, DEBOUNCE, draft)
      },
      clear,
      /** Searches all icons for what is typed. */
      searchAll(): void {
        const href = searchAllHref(store.get().draft)
        clear()
        context.options().navigate?.(href)
      },
    }
  },
  slots: slot => ({
    'root': slot({}),
    'search': slot({
      attrs: () => ({ action: '/collection/all', method: 'get' }),
      on: {
        submit: event => event.preventDefault(),
      },
    }),
    'input': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        type: 'text',
        name: 's',
        value: state.draft,
        placeholder: part.props.label,
        autocomplete: 'off',
      }),
      on: {
        input: (event, { api }) => api.type((event.target as HTMLInputElement).value),
        keydown: (event, { api }) => {
          const key = event as KeyboardEvent
          if (key.key === 'Enter' && (key.metaKey || key.ctrlKey))
            api.searchAll()
        },
      },
      bind: (el) => {
        // The element is not in the page yet when it binds
        const frame = requestAnimationFrame(() => el.focus())
        return () => cancelAnimationFrame(frame)
      },
    }),
    'clear': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.draft !== '',
      attrs: (_state, part) => ({ title: part.props.label }),
      press: ({ api }) => api.clear(),
    }),
    'search-all': slot({
      present: state => state.draft !== '',
      ...link(state => searchAllHref(state.draft)),
    }),
    // A slot rendered more than once takes a key, so each card is its own part
    'card': slot<{ value: string }>({
      props: { value: 'key' },
      ...link((_state, part) => `/collection/${part.key}`),
    }),
    'favorite': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
        'title': part.props.label,
        'aria-pressed': String(state.favorites.includes(part.key)),
      }),
      press: ({ api, key }, event) => {
        // The button sits in the card's link, which must not open
        event?.preventDefault()
        api.toggleFavorite(key)
      },
    }),
    'forget': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (_state, part) => ({ title: part.props.label }),
      press: ({ api, key }, event) => {
        event?.preventDefault()
        api.removeRecent(key)
      },
    }),
  }),
  agent: {
    actions: [
      'type',
      'clear',
      'searchAll',
      'toggleFavorite',
      'removeRecent',
    ],
  },
})
