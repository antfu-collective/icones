import { defineBehavior, external, link, navigate, option, port } from '@sekiso/core/behavior'
import { createDraft } from './draft'

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

/** The widths the sidebar can take, in px, and the one a double click goes back to. */
export const DRAWER_WIDTH = {
  min: 200,
  max: 480,
  default: 280,
  step: 16,
}

function clampWidth(width: number): number {
  return Math.round(Math.min(DRAWER_WIDTH.max, Math.max(DRAWER_WIDTH.min, width)))
}

/** Whether the sidebar sits on the left of the page. A theme may put it on the right. */
function drawerOnLeft(drawer: Element | null): boolean {
  if (!drawer)
    return true
  const rect = drawer.getBoundingClientRect()
  return rect.left + rect.width / 2 < window.innerWidth / 2
}

/** The menu's choices that are not a way to show the icons. */
const TASKS: Record<string, CollectionTask> = {
  cache: 'cache',
  download_iconfont: 'iconfont',
  download_svgs: 'svgs',
  download_json: 'json',
}

/** The page of one icon set: its details, its filters, the search, and what to do with the icons. */
export const collection = defineBehavior({
  name: 'collection',
  inputs: {
    collection: null as CollectionView | null,
    loading: false,
    category: '',
    variant: '',
    /** How many icons match, and how many show. */
    total: 0,
    shown: 0,
    /** The set is stored in the browser. */
    cached: false,
    /** A pack is in progress. */
    busy: false,
    favorite: false,
    dark: false,
    canToggleDark: true,
    size: 24,
    sizeMin: 16,
    sizeMax: 128,
    sizeStep: 4,
    list: 'grid' as 'grid' | 'list',
    mode: 'normal' as ActiveMode,
    drawerCollapsed: false,
    /** The width of the sidebar, in px. */
    drawerWidth: DRAWER_WIDTH.default,
    bag: 0,
    /** Something was just copied. */
    copied: false,
  },
  options: {
    /** The search of icons. The field follows it, ahead of it while the typing goes on. */
    search: option.string(),
  },
  ports: {
    navigate,
    setSearch: port<(search: string) => void>(),
    setCategory: port<(category: string) => void>(),
    setVariant: port<(variant: string) => void>(),
    setSize: port<(size: number) => void>(),
    setList: port<(list: 'grid' | 'list') => void>(),
    setMode: port<(mode: ActiveMode) => void>(),
    run: port<(task: CollectionTask) => void>(),
    loadMore: port(),
    loadAll: port(),
    toggleFavorite: port(),
    toggleDark: port<(event?: Event) => void>(),
    toggleDrawer: port(),
    setDrawerWidth: port<(width: number) => void>(),
    openBag: port(),
  },
  state: options => ({
    draft: options.search ?? '',
    sizeOpen: false,
    helpOpen: false,
    /** The sidebar is being dragged to a new width. */
    resizing: false,
  }),
  api: (context) => {
    const { store } = context
    const options = () => context.options()
    const draft = createDraft(context as never, (o: { search?: string }) => o.search, search => options().setSearch?.(search))

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
      setDrawerWidth(width: number): void {
        options().setDrawerWidth?.(clampWidth(width))
      },
      setResizing(resizing: boolean): void {
        store.set({ resizing })
      },
    }
  },
  slots: slot => ({
    'root': slot({}),
    'drawer-toggle': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        'title': part.props.label,
        'aria-expanded': String(!state.drawerCollapsed),
      }),
      press: ({ api }) => api.toggleDrawer(),
    }),
    // The edge of the sidebar: drag it, or use the arrow keys, to change its width
    'resizer': slot<{ label: string }>({
      props: { label: 'string' },
      role: 'separator',
      focus: 'native',
      keys: [
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
      ],
      present: state => !state.drawerCollapsed,
      attrs: (state, part) => ({
        'tabindex': '0',
        'title': part.props.label,
        'aria-orientation': 'vertical',
        'aria-valuenow': String(state.drawerWidth),
        'aria-valuemin': String(DRAWER_WIDTH.min),
        'aria-valuemax': String(DRAWER_WIDTH.max),
      }),
      on: {
        keydown: (event, { api, store }) => {
          const key = (event as KeyboardEvent).key
          const left = drawerOnLeft(document.querySelector('[data-slot="drawer"]'))
          const width = store.get().drawerWidth
          const grow = left ? 'ArrowRight' : 'ArrowLeft'
          const shrink = left ? 'ArrowLeft' : 'ArrowRight'
          if (key === grow)
            api.setDrawerWidth(width + DRAWER_WIDTH.step)
          else if (key === shrink)
            api.setDrawerWidth(width - DRAWER_WIDTH.step)
          else if (key === 'Home')
            api.setDrawerWidth(DRAWER_WIDTH.min)
          else if (key === 'End')
            api.setDrawerWidth(DRAWER_WIDTH.max)
          else
            return
          event.preventDefault()
        },
        dblclick: (_event, { api }) => api.setDrawerWidth(DRAWER_WIDTH.default),
        pointerdown: (event, { api }) => {
          const pointer = event as PointerEvent
          if (pointer.button !== 0)
            return
          const handle = pointer.currentTarget as HTMLElement
          const drawer = document.querySelector('[data-slot="drawer"]')
          if (!drawer)
            return
          pointer.preventDefault()
          handle.setPointerCapture(pointer.pointerId)
          const left = drawerOnLeft(drawer)
          const rect = drawer.getBoundingClientRect()
          api.setResizing(true)
          const move = (e: PointerEvent) => api.setDrawerWidth(left
            ? e.clientX - rect.left
            : rect.right - e.clientX)
          const stop = () => {
            api.setResizing(false)
            handle.removeEventListener('pointermove', move)
            handle.removeEventListener('pointerup', stop)
            handle.removeEventListener('pointercancel', stop)
          }
          handle.addEventListener('pointermove', move)
          handle.addEventListener('pointerup', stop)
          handle.addEventListener('pointercancel', stop)
        },
      },
    }),
    'website': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => Boolean(state.collection?.url),
      attrs: (state, part) => ({
        ...external(state.collection?.url ?? ''),
        title: part.props.label,
      }),
    }),
    'npm': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => Boolean(state.collection?.npm),
      attrs: (state, part) => ({
        ...external(state.collection?.npm ?? ''),
        title: part.props.label,
      }),
    }),
    'license': slot({
      present: state => Boolean(state.collection?.license),
      attrs: state => external(state.collection?.license?.url ?? ''),
    }),
    'size-toggle': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        'title': part.props.label,
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
    'size': slot<{ text: string }>({
      props: { text: 'string' },
      attrs: (state, part) => ({
        'type': 'range',
        'min': String(state.sizeMin),
        'max': String(state.sizeMax),
        'step': String(state.sizeStep),
        'value': String(state.size),
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
        'title': part.props.label,
        'aria-pressed': String(state.dark),
      }),
      press: ({ api }, event) => api.toggleDark(event),
    }),
    'settings': slot<{ label: string }>({
      props: { label: 'string' },
      ...link(() => '/settings', (_state, part) => ({ title: part.props.label })),
    }),
    'favorite': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.collection !== null && !state.collection.special,
      attrs: (state, part) => ({
        'title': part.props.label,
        'aria-pressed': String(state.favorite),
      }),
      press: ({ api }) => api.toggleFavorite(),
    }),
    // A native select: the value is the way the icons show, and any other choice runs and goes back to it
    'menu': slot({
      attrs: state => ({ value: state.list }),
      on: {
        change: (event, { api, store }) => {
          const select = event.target as HTMLSelectElement
          api.choose(select.value)
          select.value = store.get().list
        },
      },
    }),
    // The group's own `label` attribute names it, so it takes its text as `name`, not `label`
    'menu-group': slot<{ value: string, name: string }>({
      props: { value: 'key', name: 'string' },
      present: (state, part) => part.key !== 'downloads' || !state.collection?.special,
      attrs: (_state, part) => ({ label: part.props.name }),
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
        'aria-pressed': String(state.category === part.key),
      }),
      press: ({ api, key }) => api.toggleCategory(key),
    }),
    'variant': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
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
        type: 'text',
        name: 's',
        value: state.draft,
        placeholder: part.props.label,
        autocomplete: 'off',
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
      attrs: (_state, part) => ({ title: part.props.label }),
      press: ({ api }) => api.clear(),
    }),
    'help-toggle': slot<{ value: string, label: string }>({
      props: { value: 'key', label: 'string' },
      attrs: (state, part) => ({
        'title': part.props.label,
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
      press: ({ api }) => api.loadMore(),
    }),
    'load-all': slot({
      present: state => state.total > state.shown && state.collection !== null && !state.collection.special,
      press: ({ api }) => api.loadAll(),
    }),
    'bag': slot<{ label: string }>({
      props: { label: 'string' },
      present: state => state.bag > 0,
      attrs: (_state, part) => ({ title: part.props.label }),
      press: ({ api }) => api.openBag(),
    }),
    'mode': slot({
      attrs: state => ({
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
