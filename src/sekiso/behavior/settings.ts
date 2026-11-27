import type { Navigate } from './link'
import { definePrimitive } from '@ui-sdk/core'
import { followLink } from './link'

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

export interface SettingsOptions {
  theme?: string
  themes?: readonly SettingsTheme[]
  categories?: readonly SettingsCategory[]
  navigate?: Navigate
  setTheme?: (name: string) => void
  toggleCategory?: (name: string) => void
  toggleFavorite?: (id: string) => void
  toggleCollection?: (id: string) => void
}

function stateOf(options: SettingsOptions) {
  return {
    theme: options.theme ?? '',
    themes: options.themes ?? [],
    categories: options.categories ?? [],
  }
}

/** The settings page: the theme, and which icon sets the app lists. */
export const settings = definePrimitive({
  name: 'settings',
  options: {
    theme: 'string',
    themes: 'value',
    categories: 'value',
    navigate: 'value',
    setTheme: 'value',
    toggleCategory: 'value',
    toggleFavorite: 'value',
    toggleCollection: 'value',
  },
  state: (options: SettingsOptions) => stateOf(options),
  sync: options => stateOf(options),
  api: context => ({
    setTheme(name: string): void {
      context.options().setTheme?.(name)
    },
    toggleCategory(name: string): void {
      context.options().toggleCategory?.(name)
    },
    toggleFavorite(id: string): void {
      context.options().toggleFavorite?.(id)
    },
    toggleCollection(id: string): void {
      context.options().toggleCollection?.(id)
    },
    follow(event: Event, to: string): void {
      followLink(event, to, context.options().navigate)
    },
  }),
  slots: slot => ({
    'root': slot({}),
    'theme': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        'type': 'button',
        'aria-pressed': String(state.theme === part.key),
      }),
      press: ({ api, key }) => api.setTheme(key),
    }),
    'category-toggle': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
        'type': 'button',
        'aria-label': part.props.label,
        'title': part.props.label,
        'aria-pressed': String(!state.categories.find(category => category.name === part.key)?.hidden),
      }),
      press: ({ api, key }) => api.toggleCategory(key),
    }),
    'collection': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (_state, part) => ({ href: `/collection/${part.key}` }),
      on: {
        click: (event, { api, key }) => api.follow(event, `/collection/${key}`),
      },
    }),
    'favorite': slot<{ value: string, label: string, pressed: boolean }>({
      props: { value: 'key', label: 'string', pressed: 'boolean' },
      attrs: (_state, part) => ({
        'type': 'button',
        'aria-label': part.props.label,
        'title': part.props.label,
        'aria-pressed': String(part.props.pressed),
      }),
      press: ({ api, key }) => api.toggleFavorite(key),
    }),
    'visible': slot<{ value: string, label: string, pressed: boolean }>({
      props: { value: 'key', label: 'string', pressed: 'boolean' },
      attrs: (_state, part) => ({
        'type': 'button',
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
