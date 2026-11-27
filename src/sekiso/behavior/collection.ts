import type { Navigate } from './link'
import { definePrimitive } from '@ui-sdk/core'
import { createDraft } from './draft'
import { external, followLink } from './link'

/** What the page shows of the open icon set. */
export interface CollectionView {
  id: string
  name: string
  /** `all` and `recent` hold icons of every set. */
  special: boolean
  /** The set is deprecated. */
  hidden?: boolean
  url?: string
  npm?: string
  author?: string
  license?: { title: string, url: string }
  categories: readonly string[]
  variants: readonly string[]
}

/** What a click on an icon does: open it, put it in the bag, or copy its name. */
export type ActiveMode = 'normal' | 'select' | 'copy'

/** What the menu of the icon set can pack or store. */
export type CollectionTask = 'cache' | 'iconfont' | 'svgs' | 'json'

export interface CollectionOptions {
  collection?: CollectionView | null
  loading?: boolean
  search?: string
  category?: string
  variant?: string
  /** How many icons match, and how many show. */
  total?: number
  shown?: number
  /** The set is stored in the browser. */
  cached?: boolean
  /** A pack is in progress. */
  busy?: boolean
  favorite?: boolean
  dark?: boolean
  canToggleDark?: boolean
  size?: number
  sizeMin?: number
  sizeMax?: number
  sizeStep?: number
  list?: 'grid' | 'list'
  mode?: ActiveMode
  drawerCollapsed?: boolean
  bag?: number
  /** Something was just copied. */
  copied?: boolean
  navigate?: Navigate
  setSearch?: (search: string) => void
  setCategory?: (category: string) => void
  setVariant?: (variant: string) => void
  setSize?: (size: number) => void
  setList?: (list: 'grid' | 'list') => void
  setMode?: (mode: ActiveMode) => void
  run?: (task: CollectionTask) => void
  loadMore?: () => void
  loadAll?: () => void
  toggleFavorite?: () => void
  toggleDark?: (event?: Event) => void
  toggleDrawer?: () => void
  openBag?: () => void
}

function stateOf(options: CollectionOptions) {
  return {
    collection: options.collection ?? null,
    loading: options.loading ?? false,
    category: options.category ?? '',
    variant: options.variant ?? '',
    total: options.total ?? 0,
    shown: options.shown ?? 0,
    cached: options.cached ?? false,
    busy: options.busy ?? false,
    favorite: options.favorite ?? false,
    dark: options.dark ?? false,
    canToggleDark: options.canToggleDark ?? true,
    size: options.size ?? 24,
    sizeMin: options.sizeMin ?? 16,
    sizeMax: options.sizeMax ?? 128,
    sizeStep: options.sizeStep ?? 4,
    list: options.list ?? 'grid',
    mode: options.mode ?? 'normal',
    drawerCollapsed: options.drawerCollapsed ?? false,
    bag: options.bag ?? 0,
    copied: options.copied ?? false,
  }
}

/** The menu's choices that are not a way to show the icons. */
const TASKS: Record<string, CollectionTask> = {
  cache: 'cache',
  download_iconfont: 'iconfont',
  download_svgs: 'svgs',
  download_json: 'json',
}

function labelled(label: string): Record<string, string> {
  return { 'aria-label': label, 'title': label }
}

/** The page of one icon set: its details, its filters, the search, and what to do with the icons. */
export const collection = definePrimitive({
  name: 'collection',
  options: {
    collection: 'value',
    loading: 'boolean',
    search: 'string',
    category: 'string',
    variant: 'string',
    total: 'number',
    shown: 'number',
    cached: 'boolean',
    busy: 'boolean',
    favorite: 'boolean',
    dark: 'boolean',
    canToggleDark: 'boolean',
    size: 'number',
    sizeMin: 'number',
    sizeMax: 'number',
    sizeStep: 'number',
    list: 'string',
    mode: 'string',
    drawerCollapsed: 'boolean',
    bag: 'number',
    copied: 'boolean',
    navigate: 'value',
    setSearch: 'value',
    setCategory: 'value',
    setVariant: 'value',
    setSize: 'value',
    setList: 'value',
    setMode: 'value',
    run: 'value',
    loadMore: 'value',
    loadAll: 'value',
    toggleFavorite: 'value',
    toggleDark: 'value',
    toggleDrawer: 'value',
    openBag: 'value',
  },
  state: (options: CollectionOptions) => ({
    ...stateOf(options),
    draft: options.search ?? '',
    sizeOpen: false,
    helpOpen: false,
  }),
  sync: options => stateOf(options),
  api: (context) => {
    const { store } = context
    const options = () => context.options()
    const draft = createDraft(context as never, (o: CollectionOptions) => o.search, search => options().setSearch?.(search))

    return {
      ...draft,
      toggleCategory(category: string): void {
        options().setCategory?.(store.get().category === category
          ? ''
          : category)
      },
      toggleVariant(variant: string): void {
        options().setVariant?.(store.get().variant === variant
          ? ''
          : variant)
      },
      toggleHelp(open = !store.get().helpOpen): void {
        store.set({ helpOpen: open })
      },
      toggleSize(open = !store.get().sizeOpen): void {
        store.set({ sizeOpen: open })
      },
      setSize(size: number): void {
        options().setSize?.(size)
      },
      /** A choice of the menu: a way to show the icons, a mode, or a task. */
      choose(choice: string): void {
        if (choice === 'grid' || choice === 'list')
          options().setList?.(choice)
        else if (choice === 'select' || choice === 'copy')
          options().setMode?.(choice)
        else if (TASKS[choice])
          options().run?.(TASKS[choice])
      },
      exitMode(): void {
        options().setMode?.('normal')
      },
      loadMore(): void {
        options().loadMore?.()
      },
      loadAll(): void {
        options().loadAll?.()
      },
      toggleFavorite(): void {
        options().toggleFavorite?.()
      },
      toggleDark(event?: Event): void {
        options().toggleDark?.(event)
      },
      toggleDrawer(): void {
        options().toggleDrawer?.()
      },
      openBag(): void {
        options().openBag?.()
      },
      follow(event: Event, to: string): void {
        followLink(event, to, options().navigate)
      },
    }
  },
  slots: slot => ({
    'root': slot({}),
    'drawer-toggle': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        'type': 'button',
        ...labelled(part.props.label),
        'aria-expanded': String(!state.drawerCollapsed),
      }),
      press: ({ api }) => api.toggleDrawer(),
    }),
    'website': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => Boolean(state.collection?.url),
      attrs: (state, part) => ({
        ...external(state.collection?.url ?? ''),
        ...labelled(part.props.label),
      }),
    }),
    'npm': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => Boolean(state.collection?.npm),
      attrs: (state, part) => ({
        ...external(state.collection?.npm ?? ''),
        ...labelled(part.props.label),
      }),
    }),
    'license': slot({
      present: state => Boolean(state.collection?.license),
      attrs: state => external(state.collection?.license?.url ?? ''),
    }),
    'size-toggle': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        'type': 'button',
        ...labelled(part.props.label),
        'aria-haspopup': 'true',
        'aria-expanded': String(state.sizeOpen),
      }),
      press: ({ api }) => api.toggleSize(),
    }),
    'size-menu': slot({
      present: state => state.sizeOpen,
      on: {
        keydown: (event, { api }) => {
          if ((event as KeyboardEvent).key !== 'Escape')
            return
          event.stopPropagation()
          api.toggleSize(false)
        },
      },
      bind: (el, part) => {
        // A click outside the menu, but not on its button, closes it
        const close = (event: PointerEvent) => {
          const target = event.target as HTMLElement
          if (!el.contains(target) && !target.closest('[data-slot="collection-size-toggle"]'))
            part.api.toggleSize(false)
        }
        document.addEventListener('pointerdown', close)
        return () => document.removeEventListener('pointerdown', close)
      },
    }),
    'size': slot<{ label: string, text: string }>({
      props: { label: 'string', text: 'string' },
      attrs: (state, part) => ({
        'type': 'range',
        'min': String(state.sizeMin),
        'max': String(state.sizeMax),
        'step': String(state.sizeStep),
        'value': String(state.size),
        'aria-label': part.props.label,
        'aria-valuetext': part.props.text,
      }),
      on: {
        input: (event, { api }) => api.setSize(Number((event.target as HTMLInputElement).value)),
      },
      bind: (el) => {
        // The element is not in the page yet when it binds
        const frame = requestAnimationFrame(() => el.focus())
        return () => cancelAnimationFrame(frame)
      },
    }),
    'dark': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.canToggleDark,
      attrs: (state, part) => ({
        'type': 'button',
        ...labelled(part.props.label),
        'aria-pressed': String(state.dark),
      }),
      press: ({ api }, event) => api.toggleDark(event),
    }),
    'settings': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({
        href: '/settings',
        ...labelled(part.props.label),
      }),
      on: {
        click: (event, { api }) => api.follow(event, '/settings'),
      },
    }),
    'favorite': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.collection !== null && !state.collection.special,
      attrs: (state, part) => ({
        'type': 'button',
        ...labelled(part.props.label),
        'aria-pressed': String(state.favorite),
      }),
      press: ({ api }) => api.toggleFavorite(),
    }),
    // A native select: the value is the way the icons show, and any other choice runs and goes back to it
    'menu': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({ 'aria-label': part.props.label, 'value': state.list }),
      on: {
        change: (event, { api, store }) => {
          const select = event.target as HTMLSelectElement
          api.choose(select.value)
          select.value = store.get().list
        },
      },
    }),
    'menu-group': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      present: (state, part) => part.key !== 'downloads' || !state.collection?.special,
      attrs: (_state, part) => ({ label: part.props.label }),
    }),
    'menu-option': slot<{ value: string }>({
      props: { value: 'key' },
      present: (state, part) => part.key !== 'cache' || !state.cached,
      attrs: (state, part) => ({
        value: part.key,
        selected: part.key === state.list
          ? ''
          : undefined,
        disabled: state.busy && part.key.startsWith('download')
          ? ''
          : undefined,
      }),
    }),
    'category': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        'type': 'button',
        'aria-pressed': String(state.category === part.key),
      }),
      press: ({ api, key }) => api.toggleCategory(key),
    }),
    'variant': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        'type': 'button',
        'aria-pressed': String(state.variant === part.key),
      }),
      press: ({ api, key }) => api.toggleVariant(key),
    }),
    // The search shows twice: in the page on large screens, in the bar on small ones
    'search': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: () => ({ action: '/collection/all', method: 'get' }),
      on: {
        submit: event => event.preventDefault(),
      },
    }),
    'input': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
        'type': 'text',
        'name': 's',
        'value': state.draft,
        'aria-label': part.props.label,
        'placeholder': part.props.label,
        'autocomplete': 'off',
      }),
      on: {
        input: (event, { api }) => api.type((event.target as HTMLInputElement).value),
      },
      bind: (el, part) => {
        // The search of the page takes the focus, and `/` brings it back
        if (part.key !== 'page')
          return
        // The element is not in the page yet when it binds
        const frame = requestAnimationFrame(() => el.focus())
        const onKey = (event: KeyboardEvent) => {
          if (event.key !== '/' || document.activeElement === el)
            return
          event.preventDefault()
          el.focus()
        }
        document.addEventListener('keydown', onKey)
        return () => {
          cancelAnimationFrame(frame)
          document.removeEventListener('keydown', onKey)
        }
      },
    }),
    'clear': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      present: state => state.draft !== '',
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.clear(),
    }),
    'help-toggle': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
        'type': 'button',
        ...labelled(part.props.label),
        'aria-expanded': String(state.helpOpen),
        'aria-controls': `search-syntax-${part.key}`,
      }),
      press: ({ api }) => api.toggleHelp(),
    }),
    'help': slot<{ value: string }>({
      props: { value: 'key' },
      present: state => state.helpOpen,
      attrs: (_state, part) => ({ id: `search-syntax-${part.key}` }),
      on: {
        keydown: (event, { api }) => {
          if ((event as KeyboardEvent).key === 'Escape')
            api.toggleHelp(false)
        },
      },
      bind: (el, part) => {
        const close = (event: PointerEvent) => {
          const target = event.target as HTMLElement
          if (!el.contains(target) && !target.closest('[data-slot="collection-help-toggle"]'))
            part.api.toggleHelp(false)
        }
        document.addEventListener('pointerdown', close)
        return () => document.removeEventListener('pointerdown', close)
      },
    }),
    'load-more': slot({
      present: state => state.total > state.shown,
      attrs: () => ({ type: 'button' }),
      press: ({ api }) => api.loadMore(),
    }),
    'load-all': slot({
      present: state => state.total > state.shown && state.collection !== null && !state.collection.special,
      attrs: () => ({ type: 'button' }),
      press: ({ api }) => api.loadAll(),
    }),
    'bag': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.bag > 0,
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.openBag(),
    }),
    'mode': slot({
      attrs: state => ({
        'type': 'button',
        'aria-hidden': state.mode === 'normal'
          ? 'true'
          : undefined,
        'tabindex': state.mode === 'normal'
          ? '-1'
          : undefined,
      }),
      press: ({ api }) => api.exitMode(),
    }),
    'toast': slot({
      attrs: () => ({ 'aria-live': 'polite' }),
    }),
  }),
  agent: {
    actions: [
      'type',
      'clear',
      'toggleCategory',
      'toggleVariant',
      'setSize',
      'choose',
      'exitMode',
      'loadMore',
      'loadAll',
      'toggleFavorite',
      'openBag',
    ],
  },
})
