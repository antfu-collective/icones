import { defineBehavior, external, link, navigate, port } from '@sekiso/core/behavior'

/** The bar at the top of every page: back, the app name, and the dark switch. */
export const navbar = defineBehavior({
  name: 'navbar',
  inputs: {
    /** The page is the home page, so there is nowhere to go back to. */
    home: false,
    /** The page shows an icon set. The bar then holds its search, and only on small screens. */
    collection: false,
    dark: false,
    /** The active theme lets the user pick light or dark. */
    canToggleDark: true,
  },
  ports: {
    navigate,
    /** Switches light and dark. It takes the click, to start the transition from it. */
    toggleDark: port<(event?: Event) => void>(),
  },
  slots: slot => ({
    root: slot({}),
    back: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.home,
      ...link(() => '/', (_state, part) => ({ title: part.props.label })),
    }),
    github: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.collection,
      attrs: (_state, part) => ({
        ...external('https://github.com/antfu/icones'),
        title: part.props.label,
      }),
    }),
    settings: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.collection,
      ...link(() => '/settings', (_state, part) => ({ title: part.props.label })),
    }),
    dark: slot<{ label: string }>({
      props: { label: 'string' },
      present: state => !state.collection && state.canToggleDark,
      attrs: (state, part) => ({
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
