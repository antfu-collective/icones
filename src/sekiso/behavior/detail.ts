import { defineBehavior, external, link, port } from '@sekiso/core/behavior'

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

function categoryHref(icon: string, category: string): string {
  return `/collection/${icon.split(':')[0]}?category=${encodeURIComponent(category)}`
}

const PREVIEW_HIDE_DELAY = 300

/** The sheet of one icon: its preview, its name, and every way to copy or download it. */
export const detail = defineBehavior({
  name: 'detail',
  inputs: {
    open: false,
    /** The icon id, `prefix:name`. */
    icon: '',
    /** The id in the case the user picked. */
    name: '',
    cases: [] as readonly { key: string, label: string }[],
    preferredCase: '',
    license: null as { title: string, url: string } | null,
    /** The icon's set, shown when the page holds icons of every set. */
    collection: null as { id: string, name: string } | null,
    categories: [] as readonly string[],
    inBag: false,
    selecting: false,
    copyColor: false,
    color: '#888888',
    /** The preview color is close to the page's, so the preview needs a backdrop. */
    lowContrast: false,
    groups: [] as readonly DetailGroup[],
    downloads: [] as readonly DetailFormat[],
    links: [] as readonly { name: string, href: string }[],
    managers: [] as readonly string[],
    manager: '',
    /** The package of the icon set, for the install command. */
    packageName: '',
    /** Something was just copied. */
    copied: false,
  },
  ports: {
    close: port(),
    copy: port<(type: string) => void>(),
    download: port<(type: string) => void>(),
    copyInstall: port(),
    toggleBag: port(),
    toggleSelecting: port(),
    toggleCopyColor: port(),
    setColor: port<(color: string) => void>(),
    setCase: port<(key: string) => void>(),
    setManager: port<(manager: string) => void>(),
    showHelp: port(),
  },
  state: () => ({
    caseOpen: false,
    /** The format whose code shows in the preview, and where its button is. */
    previewing: '',
    previewX: 0,
    previewY: 0,
  }),
  api: (context) => {
    const { store } = context
    const options = () => context.options()
    let hideTimer: ReturnType<typeof setTimeout> | undefined

    function cancelHide(): void {
      clearTimeout(hideTimer)
    }

    context.onDestroy(cancelHide)

    return {
      close(): void {
        cancelHide()
        store.set({ caseOpen: false, previewing: '' })
        options().close?.()
      },
      toggleCase(open = !store.get().caseOpen): void {
        store.set({ caseOpen: open })
      },
      /** Shows the code of a format above its button, or hides it with no format. */
      preview(type: string, el?: Element): void {
        cancelHide()
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
      holdPreview(): void {
        cancelHide()
      },
      releasePreview(): void {
        cancelHide()
        hideTimer = setTimeout(() => {
          store.set({ previewing: '' })
        }, PREVIEW_HIDE_DELAY)
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
      attrs: (_state, part) => ({ title: part.props.label }),
      press: ({ api }) => api.close(),
    }),
    // A label: a click on the preview opens the color input inside it
    'preview': slot({}),
    'color': slot({
      attrs: state => ({ type: 'color', value: state.color }),
      on: {
        input: (event, { api }) => api.setColor((event.target as HTMLInputElement).value),
      },
    }),
    'help': slot({
      press: ({ api }) => api.showHelp(),
    }),
    'copy-name': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({ title: part.props.label }),
      press: ({ api }) => api.copy('id'),
    }),
    'case-toggle': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (state, part) => ({
        'title': part.props.label,
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
      ...link(state => `/collection/${state.collection?.id ?? ''}`),
    }),
    'category': slot<{ value: string }>({
      props: { value: 'key' },
      ...link((state, part) => categoryHref(state.icon, part.key)),
    }),
    'bag': slot({
      attrs: state => ({
        'aria-pressed': String(state.inBag),
      }),
      press: ({ api }) => api.toggleBag(),
    }),
    'selecting': slot({
      present: state => state.inBag,
      attrs: state => ({
        'aria-pressed': String(state.selecting),
      }),
      press: ({ api }) => api.toggleSelecting(),
    }),
    'copy-color': slot({
      attrs: state => ({
        'aria-pressed': String(state.copyColor),
      }),
      press: ({ api }) => api.toggleCopyColor(),
    }),
    'snippet': slot<{ value: string }>({
      props: { value: 'key' },
      press: ({ api, key }) => api.copy(key),
      on: {
        pointerenter: (event, { api, key }) => api.preview(key, event.currentTarget as Element),
        pointerleave: (_event, { api }) => api.releasePreview(),
        focus: (event, { api, key }) => api.preview(key, event.currentTarget as Element),
        blur: (_event, { api }) => {
          const stayed = document.querySelector('[data-slot="detail-snippet-preview"]:hover, [data-slot="detail-snippet"]:hover')
          if (stayed)
            return
          api.preview('')
        },
      },
    }),
    'snippet-preview': slot({
      present: state => state.previewing !== '',
      attrs: () => ({ 'aria-hidden': 'true' }),
      on: {
        pointerenter: (_event, { api }) => api.holdPreview(),
        pointerleave: (_event, { api }) => api.releasePreview(),
      },
    }),
    'download': slot<{ value: string }>({
      props: { value: 'key' },
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
        'aria-pressed': String(state.manager === part.key),
      }),
      press: ({ api, key }) => api.setManager(key),
    }),
    'copy-install': slot<{ label: string }>({
      props: { label: 'string' },
      attrs: (_state, part) => ({ title: part.props.label }),
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
