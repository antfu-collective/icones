<script setup lang='ts'>
import type { ActiveMode, CollectionTask, CollectionView } from '../sekiso/behavior/collection'
import type { DrawerItem } from '../sekiso/behavior/drawer'
import { Scope, View } from '@sekiso/vue'
import { cacheCollection, categorySearch, downloadAndInstall, filteredCollections, isInstalled, sortedCollectionsInfo, specialTabs } from '../data'
import { isLocalMode } from '../env'
import { IconSetKey } from '../hooks'
import { collection as collectionPrimitive } from '../sekiso/behavior/collection'
import { drawer } from '../sekiso/behavior/drawer'
import { collectionView } from '../sekiso/views/collection'
import {
  activeMode,
  bags,
  canToggleDark,
  clampIconSize,
  drawerCollapsed,
  drawerWidth,
  favoritedCollectionIds,
  getSearchResults,
  ICON_SIZE_MAX,
  ICON_SIZE_MIN,
  ICON_SIZE_STEP,
  iconSize,
  inProgress,
  isCurrentCollectionLoading,
  isDark,
  isFavoritedCollection,
  listType,
  progressMessage,
  recentIconIds,
  showHelp,
  toggleBag,
  toggleFavoriteCollection,
} from '../store'
import { toggleDark } from '../utils/dark'
import { getIconSnippet } from '../utils/icons'
import { PackIconFont, PackJsonZip, PackSvgZip } from '../utils/pack'
import { cleanupQuery } from '../utils/query'

const route = useRoute()
const router = useRouter()

const showBag = ref(false)
const copied = ref(false)
const current = computed({
  get() {
    return (route.query.icon as string) || ''
  },
  set(value) {
    router.replace({
      query: cleanupQuery({ ...route.query, icon: value }),
    })
  },
})

const { search, icons, category, collection, variant } = getSearchResults()
const loading = isCurrentCollectionLoading()

const max = ref(isLocalMode ? 500 : 200)
const maxMap = new Map<string, number>()
const id = computed(() => collection.value?.id)
const isSpecial = computed(() => id.value != null && specialTabs.includes(id.value))
const namespace = computed(() => (id.value != null && !isSpecial.value)
  ? `${id.value}:`
  : '')

watch(namespace, () => {
  max.value = maxMap.get(namespace.value) || 200
})

function onCopy(status: boolean) {
  copied.value = status
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

async function copyText(text?: string) {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
    }
  }
  return false
}

async function onSelect(icon: string) {
  switch (activeMode.value) {
    case 'select':
      toggleBag(icon)
      break
    case 'copy':
      onCopy(await copyText(await getIconSnippet([collection.value!], icon, 'id', true) || icon))
      break
    default:
      current.value = icon
      break
  }
}

function loadMore() {
  max.value += 100
  maxMap.set(namespace.value, max.value)
}

async function loadAll() {
  if (!namespace.value)
    return
  await cacheCollection(collection.value!.id)
  max.value = icons.value.length
  maxMap.set(namespace.value, max.value)
}

provide(IconSetKey, {
  icons,
  max,
  namespace,
  search,
  select: onSelect,
  loadMore,
})

function next(delta = 1) {
  const name = current.value.startsWith(namespace.value)
    ? current.value.slice(namespace.value.length)
    : current.value
  const index = icons.value.indexOf(name)
  if (index === -1)
    return
  const newOne = icons.value[index + delta]
  if (newOne)
    current.value = namespace.value + newOne
}

/** Packs or stores the whole set, with the progress on screen. */
async function run(task: CollectionTask) {
  const set = collection.value
  if (!set)
    return
  if (task === 'cache') {
    await cacheCollection(set.id)
    return
  }
  progressMessage.value = 'Downloading...'
  inProgress.value = true
  await nextTick()
  await downloadAndInstall(set.id)
  progressMessage.value = 'Packing up...'
  await nextTick()
  const ids = set.icons.map(i => `${set.id}:${i}`)
  if (task === 'iconfont')
    await PackIconFont([set], ids, { fontName: set.name, fileName: set.id })
  else if (task === 'svgs')
    await PackSvgZip([set], ids, set.id)
  else
    await PackJsonZip([set], ids, set.id)
  inProgress.value = false
}

function isTyping(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
}

// `+` and `-` resize the icons, unless the user types in a field
onKeyStroke(['+', '=', '-'], (e) => {
  if (isTyping(e) || e.ctrlKey || e.metaKey || e.altKey || current.value)
    return
  e.preventDefault()
  iconSize.value = clampIconSize(iconSize.value + (e.key === '-'
    ? -ICON_SIZE_STEP
    : ICON_SIZE_STEP))
})

onKeyStroke('Escape', () => {
  if (current.value !== '') {
    current.value = ''
    document.querySelector<HTMLElement>('[data-slot="collection-search"][data-place="page"] [data-slot="collection-input"]')?.focus()
  }
})

const view = computed((): CollectionView | null => {
  const set = collection.value
  if (!set)
    return null
  return {
    id: set.id,
    name: set.name,
    special: isSpecial.value,
    hidden: set.hidden,
    url: set.url || set.author?.url,
    npm: isSpecial.value
      ? undefined
      : `https://npmx.dev/package/@iconify-json/${set.id}`,
    author: set.author?.name,
    license: set.license,
    categories: Object.keys(set.categories ?? {}).sort(),
    variants: Object.keys(set.variants ?? {}).sort(),
  }
})

const options = computed(() => ({
  collection: view.value,
  loading: !collection.value || loading.value,
  search: search.value,
  category: category.value,
  variant: variant.value,
  total: icons.value.length,
  shown: Math.min(max.value, icons.value.length),
  cached: Boolean(id.value && isInstalled(id.value)),
  busy: inProgress.value,
  favorite: Boolean(id.value && isFavoritedCollection(id.value)),
  dark: isDark.value,
  canToggleDark: canToggleDark.value,
  size: iconSize.value,
  sizeMin: ICON_SIZE_MIN,
  sizeMax: ICON_SIZE_MAX,
  sizeStep: ICON_SIZE_STEP,
  list: listType.value === 'list'
    ? 'list' as const
    : 'grid' as const,
  mode: activeMode.value,
  drawerCollapsed: drawerCollapsed.value,
  drawerWidth: drawerWidth.value,
  bag: bags.value.length,
  copied: copied.value,
  navigate: (to: string) => router.push(to),
  setSearch: (value: string) => search.value = value,
  setCategory: (value: string) => category.value = value,
  setVariant: (value: string) => variant.value = value,
  setSize: (size: number) => iconSize.value = clampIconSize(size),
  setList: (list: 'grid' | 'list') => listType.value = list,
  setMode: (mode: ActiveMode) => activeMode.value = mode,
  run,
  loadMore,
  loadAll,
  toggleFavorite: () => id.value && toggleFavoriteCollection(id.value),
  toggleDark,
  toggleDrawer: () => drawerCollapsed.value = !drawerCollapsed.value,
  setDrawerWidth: (width: number) => drawerWidth.value = width,
  openBag: () => showBag.value = true,
}))

const drawerItems = computed((): DrawerItem[] => {
  const sets = categorySearch.value
    ? filteredCollections.value
    : sortedCollectionsInfo.value
  const items = sets.map(set => ({
    id: set.id,
    name: set.name,
    special: false,
    hidden: set.hidden,
    count: set.total ?? 0,
  }))
  if (categorySearch.value)
    return items
  return [
    {
      id: 'all',
      name: 'All',
      special: true,
      count: items.length,
    },
    {
      id: 'recent',
      name: 'Recent',
      special: true,
      count: recentIconIds.value.length,
    },
    ...items,
  ]
})

const drawerOptions = computed(() => ({
  items: drawerItems.value,
  current: route.path.split('/').slice(-1)[0],
  search: categorySearch.value,
  favorites: favoritedCollectionIds.value,
  query: (route.query.s as string) || '',
  navigate: (to: string) => router.push(to),
  home: () => router.replace('/'),
  setSearch: (value: string) => categorySearch.value = value,
  toggleFavorite: toggleFavoriteCollection,
}))
</script>

<template>
  <!-- One instance of each, for the page, the sidebar and the search in the navigation bar -->
  <Scope :of="collectionPrimitive" :options="options">
    <Scope :of="drawer" :options="drawerOptions">
      <WithNavbar>
        <View :of="collectionView" />
        <Bag :open="showBag" @close="showBag = false" @select="onSelect" />
        <IconDetail
          :icon="current"
          :show-collection="isSpecial"
          @close="current = ''"
          @copy="onCopy"
          @next="next(1)"
          @prev="next(-1)"
        />
        <HelpPage :open="showHelp" @close="showHelp = false" />
      </WithNavbar>
    </Scope>
  </Scope>
</template>
