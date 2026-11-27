import type { Navigate } from './link'
import { definePrimitive } from '@ui-sdk/core'
import { external, followLink } from './link'

/** A way to copy or download an icon. */
export interface DetailFormat {
  type: string
  name: string
  /** A tag after the name, like `TS`. */
  tag?: string
}

export interface DetailGroup {
  name: string
  formats: readonly DetailFormat[]
}

export interface DetailOptions {
  open?: boolean
  /** The icon id, `prefix:name`. */
  icon?: string
  /** The id in the case the user picked. */
  name?: string
  cases?: readonly { key: string, label: string }[]
  preferredCase?: string
  license?: { title: string, url: string } | null
  /** The icon's set, shown when the page holds icons of every set. */
  collection?: { id: string, name: string } | null
  categories?: readonly string[]
  inBag?: boolean
  selecting?: boolean
  copyColor?: boolean
  color?: string
  /** The preview color is close to the page's, so the preview needs a backdrop. */
  lowContrast?: boolean
  groups?: readonly DetailGroup[]
  downloads?: readonly DetailFormat[]
  links?: readonly { name: string, href: string }[]
  managers?: readonly string[]
  manager?: string
  /** The package of the icon set, for the install command. */
  packageName?: string
  /** Something was just copied. */
  copied?: boolean
  navigate?: Navigate
  close?: () => void
  copy?: (type: string) => void
  download?: (type: string) => void
  copyInstall?: () => void
  toggleBag?: () => void
  toggleSelecting?: () => void
  toggleCopyColor?: () => void
  setColor?: (color: string) => void
  setCase?: (key: string) => void
  setManager?: (manager: string) => void
  showHelp?: () => void
}

function stateOf(options: DetailOptions) {
  return {
    open: options.open ?? false,
    icon: options.icon ?? '',
    name: options.name ?? '',
    cases: options.cases ?? [],
    preferredCase: options.preferredCase ?? '',
    license: options.license ?? null,
    collection: options.collection ?? null,
    categories: options.categories ?? [],
    inBag: options.inBag ?? false,
    selecting: options.selecting ?? false,
    copyColor: options.copyColor ?? false,
    color: options.color ?? '#888888',
    lowContrast: options.lowContrast ?? false,
    groups: options.groups ?? [],
    downloads: options.downloads ?? [],
    links: options.links ?? [],
    managers: options.managers ?? [],
    manager: options.manager ?? '',
    packageName: options.packageName ?? '',
    copied: options.copied ?? false,
  }
}

function labelled(label: string): Record<string, string> {
  return { 'aria-label': label, 'title': label }
}

function categoryHref(icon: string, category: string): string {
  return `/collection/${icon.split(':')[0]}?category=${encodeURIComponent(category)}`
}

/** The sheet of one icon: its preview, its name, and every way to copy or download it. */
export const detail = definePrimitive({
  name: 'detail',
  options: {
    open: 'boolean',
    icon: 'string',
    name: 'string',
    cases: 'value',
    preferredCase: 'string',
    license: 'value',
    collection: 'value',
    categories: 'value',
    inBag: 'boolean',
    selecting: 'boolean',
    copyColor: 'boolean',
    color: 'string',
    lowContrast: 'boolean',
    groups: 'value',
    downloads: 'value',
    links: 'value',
    managers: 'value',
    manager: 'string',
    packageName: 'string',
    copied: 'boolean',
    navigate: 'value',
    close: 'value',
    copy: 'value',
    download: 'value',
    copyInstall: 'value',
    toggleBag: 'value',
    toggleSelecting: 'value',
    toggleCopyColor: 'value',
    setColor: 'value',
    setCase: 'value',
    setManager: 'value',
    showHelp: 'value',
  },
  state: (options: DetailOptions) => ({
    ...stateOf(options),
    caseOpen: false,
    /** The format whose code shows in the preview, and where its button is. */
    previewing: '',
    previewX: 0,
    previewY: 0,
  }),
  sync: options => stateOf(options),
  api: (context) => {
    const { store } = context
    const options = () => context.options()
    return {
      close(): void {
        store.set({ caseOpen: false, previewing: '' })
        options().close?.()
      },
      copy(type: string): void {
        options().copy?.(type)
      },
      download(type: string): void {
        options().download?.(type)
      },
      copyInstall(): void {
        options().copyInstall?.()
      },
      toggleBag(): void {
        options().toggleBag?.()
      },
      toggleSelecting(): void {
        options().toggleSelecting?.()
      },
      toggleCopyColor(): void {
        options().toggleCopyColor?.()
      },
      setColor(color: string): void {
        options().setColor?.(color)
      },
      toggleCase(open = !store.get().caseOpen): void {
        store.set({ caseOpen: open })
      },
      setCase(key: string): void {
        options().setCase?.(key)
      },
      setManager(manager: string): void {
        options().setManager?.(manager)
      },
      showHelp(): void {
        options().showHelp?.()
      },
      /** Shows the code of a format above its button, or hides it with no format. */
      preview(type: string, el?: Element): void {
        const rect = el?.getBoundingClientRect()
        store.set({
          previewing: type,
          previewX: rect
            ? Math.round(rect.left + rect.width / 2)
            : 0,
          previewY: rect
            ? Math.round(rect.top)
            : 0,
        })
      },
      follow(event: Event, to: string): void {
        followLink(event, to, options().navigate)
      },
    }
  },
  slots: slot => ({
    'root': slot({}),
    'backdrop': slot({
      attrs: () => ({ 'aria-hidden': 'true' }),
      on: {
        click: (_event, { api }) => api.close(),
      },
    }),
    'panel': slot({
      role: 'dialog',
      attrs: (state, part) => ({ 'aria-modal': 'true', 'aria-label': state.icon || undefined, 'id': `${part.id}-panel` }),
    }),
    'close': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.close(),
    }),
    // A label: a click on the preview opens the color input inside it
    'preview': slot({}),
    'color': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({ 'type': 'color', 'value': state.color, 'aria-label': part.props.label }),
      on: {
        input: (event, { api }) => api.setColor((event.target as HTMLInputElement).value),
      },
    }),
    'help': slot({
      attrs: () => ({ type: 'button' }),
      press: ({ api }) => api.showHelp(),
    }),
    'copy-name': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.copy('id'),
    }),
    'case-toggle': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        'type': 'button',
        ...labelled(part.props.label),
        'aria-expanded': String(state.caseOpen),
      }),
      press: ({ api }) => api.toggleCase(),
    }),
    'cases': slot({
      present: state => state.caseOpen,
      bind: (el, part) => {
        const close = (event: PointerEvent) => {
          const target = event.target as HTMLElement
          if (!el.contains(target) && !target.closest('[data-slot="detail-case-toggle"]'))
            part.api.toggleCase(false)
        }
        document.addEventListener('pointerdown', close)
        return () => document.removeEventListener('pointerdown', close)
      },
    }),
    'case': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        'type': 'button',
        'aria-pressed': String(state.preferredCase === part.key),
      }),
      press: ({ api, key }) => api.setCase(key),
    }),
    'license': slot({
      present: state => Boolean(state.license),
      attrs: state => external(state.license?.url ?? ''),
    }),
    'collection': slot({
      present: state => Boolean(state.collection),
      attrs: state => ({ href: `/collection/${state.collection?.id ?? ''}` }),
      on: {
        click: (event, { api, store }) => api.follow(event, `/collection/${store.get().collection?.id ?? ''}`),
      },
    }),
    'category': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        href: categoryHref(state.icon, part.key),
      }),
      on: {
        click: (event, { api, key, store }) => api.follow(event, categoryHref(store.get().icon, key)),
      },
    }),
    'bag': slot({
      attrs: state => ({
        'type': 'button',
        'aria-pressed': String(state.inBag),
      }),
      press: ({ api }) => api.toggleBag(),
    }),
    'selecting': slot({
      present: state => state.inBag,
      attrs: state => ({
        'type': 'button',
        'aria-pressed': String(state.selecting),
      }),
      press: ({ api }) => api.toggleSelecting(),
    }),
    'copy-color': slot({
      attrs: state => ({
        'type': 'button',
        'aria-pressed': String(state.copyColor),
      }),
      press: ({ api }) => api.toggleCopyColor(),
    }),
    'snippet': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: () => ({ type: 'button' }),
      press: ({ api, key }) => api.copy(key),
      on: {
        pointerenter: (event, { api, key }) => api.preview(key, event.currentTarget as Element),
        pointerleave: (_event, { api }) => api.preview(''),
        focus: (event, { api, key }) => api.preview(key, event.currentTarget as Element),
        blur: (_event, { api }) => api.preview(''),
      },
    }),
    'snippet-preview': slot({
      present: state => state.previewing !== '',
      attrs: () => ({ 'aria-hidden': 'true' }),
    }),
    'download': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: () => ({ type: 'button' }),
      press: ({ api, key }) => api.download(key),
    }),
    'link': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => external(state.links.find(link => link.name === part.key)?.href ?? ''),
    }),
    'install-docs': slot({
      attrs: () => external('https://iconify.design/docs/icons/json.html'),
    }),
    'manager': slot<{ value: string }>({
      props: { value: 'key' },
      attrs: (state, part) => ({
        'type': 'button',
        'aria-pressed': String(state.manager === part.key),
      }),
      press: ({ api, key }) => api.setManager(key),
    }),
    'copy-install': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({
        type: 'button',
        ...labelled(part.props.label),
      }),
      press: ({ api }) => api.copyInstall(),
    }),
    'toast': slot({
      attrs: () => ({ 'aria-live': 'polite' }),
    }),
  }),
  agent: {
    actions: [
      'close',
      'copy',
      'download',
      'toggleBag',
      'toggleSelecting',
      'toggleCopyColor',
      'setColor',
      'setCase',
      'setManager',
    ],
  },
})
