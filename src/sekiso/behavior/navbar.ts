import type { Navigate } from './link'
import { definePrimitive } from '@ui-sdk/core'
import { external, followLink } from './link'

export interface NavbarOptions {
  /** The page is the home page, so there is nowhere to go back to. */
  home?: boolean
  /** The page shows an icon set. The bar then holds its search, and only on small screens. */
  collection?: boolean
  dark?: boolean
  /** The active theme lets the user pick light or dark. */
  canToggleDark?: boolean
  navigate?: Navigate
  /** Port: switches light and dark. It takes the click, to start the transition from it. */
  toggleDark?: (event?: Event) => void
}

function stateOf(options: NavbarOptions) {
  return {
    home: options.home ?? false,
    collection: options.collection ?? false,
    dark: options.dark ?? false,
    canToggleDark: options.canToggleDark ?? true,
  }
}

/** The bar at the top of every page: back, the app name, and the dark switch. */
export const navbar = definePrimitive({
  name: 'navbar',
  options: {
    home: 'boolean',
    collection: 'boolean',
    dark: 'boolean',
    canToggleDark: 'boolean',
    navigate: 'value',
    toggleDark: 'value',
  },
  state: (options: NavbarOptions) => stateOf(options),
  sync: options => stateOf(options),
  api: context => ({
    follow(event: Event, to: string): void {
      followLink(event, to, context.options().navigate)
    },
    toggleDark(event?: Event): void {
      context.options().toggleDark?.(event)
    },
  }),
  slots: slot => ({
    root: slot({}),
    back: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.home,
      attrs: (_state, part) => ({ 'href': '/', 'aria-label': part.props.label, 'title': part.props.label }),
      on: {
        click: (event, { api }) => api.follow(event, '/'),
      },
    }),
    github: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.collection,
      attrs: (_state, part) => ({
        ...external('https://github.com/antfu/icones'),
        'aria-label': part.props.label,
        'title': part.props.label,
      }),
    }),
    settings: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.collection,
      attrs: (_state, part) => ({ 'href': '/settings', 'aria-label': part.props.label, 'title': part.props.label }),
      on: {
        click: (event, { api }) => api.follow(event, '/settings'),
      },
    }),
    dark: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.collection && state.canToggleDark,
      attrs: (state, part) => ({
        'type': 'button',
        'aria-label': part.props.label,
        'title': part.props.label,
        'aria-pressed': String(state.dark),
      }),
      press: ({ api }, event) => api.toggleDark(event),
    }),
  }),
  agent: {
    actions: ['toggleDark'],
  },
})
