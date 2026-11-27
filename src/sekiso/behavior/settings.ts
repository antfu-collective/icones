import { defineBehavior, link, port } from '@sekiso/core/behavior'

/** A theme to pick, with a few of its colors to preview it by. */
export interface SettingsTheme {
  name: string
  swatches: readonly string[]
}

export interface SettingsCollection {
  id: string
  name: string
  favorite: boolean
  /** The user hid the set, or its whole category. */
  excluded: boolean
  /** The set is stored in the browser, for use offline. */
  cached: boolean
}

export interface SettingsCategory {
  name: string
  hidden: boolean
  collections: readonly SettingsCollection[]
}

/** The settings page: the theme, and which icon sets the app lists. */
export const settings = defineBehavior({
  name: 'settings',
  inputs: {
    theme: '',
    themes: [] as readonly SettingsTheme[],
    categories: [] as readonly SettingsCategory[],
  },
  ports: {
    navigate: port<(to: string) => void>(),
    setTheme: port<(name: string) => void>(),
    toggleCategory: port<(name: string) => void>(),
    toggleFavorite: port<(id: string) => void>(),
    toggleCollection: port<(id: string) => void>(),
  },
  slots: slot => ({
    'root': slot({}),
    'theme': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        'aria-pressed': String(state.theme === part.key),
      }),
      press: ({ api, key }) => api.setTheme(key),
    }),
    'category-toggle': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
        'aria-label': part.props.label,
        'title': part.props.label,
        'aria-pressed': String(!state.categories.find(category => category.name === part.key)?.hidden),
      }),
      press: ({ api, key }) => api.toggleCategory(key),
    }),
    'collection': slot<{ value: string }>({
      props: { value: 'key' },
      ...link((_state, part) => `/collection/${part.key}`),
    }),
    'favorite': slot<{ value: string, label: string, pressed: boolean }>({
      props: { value: 'key', label: 'string', pressed: 'boolean' },
      attrs: (_state, part) => ({
        'aria-label': part.props.label,
        'title': part.props.label,
        'aria-pressed': String(part.props.pressed),
      }),
      press: ({ api, key }) => api.toggleFavorite(key),
    }),
    'visible': slot<{ value: string, label: string, pressed: boolean }>({
      props: { value: 'key', label: 'string', pressed: 'boolean' },
      attrs: (_state, part) => ({
        'aria-label': part.props.label,
        'title': part.props.label,
        'aria-pressed': String(part.props.pressed),
      }),
      press: ({ api, key }) => api.toggleCollection(key),
    }),
  }),
  agent: {
    actions: [
      'setTheme',
      'toggleCategory',
      'toggleFavorite',
      'toggleCollection',
    ],
  },
})
