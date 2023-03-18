import type { IconifyJSON } from 'iconify-icon'
import { notNullish } from '@antfu/utils'
import { addCollection } from 'iconify-icon'
import { AsyncFzf } from 'fzf'
import { favoritedCollectionIds, inProgress, isFavoritedCollection, isRecentCollection, progressMessage, recentCollectionIds, sortAlphabetically } from '../store'
import { isLocalMode, staticPath } from '../env'
import { loadCollection, saveCollection } from '../store/indexedDB'
import infoJSON from './collections-info.json'
import { variantCategories } from './variant-category'

export const specialTabs = ['all', 'recent']

export type PresentType = 'favorite' | 'recent' | 'normal'

export interface CollectionInfo {
  id: string
  name: string
  author?: { name: string; url: string }
  license?: { title: string; url: string }
  url?: string
  sampleIcons?: string[]
  category?: string
  palette?: string
  total?: number
  prepacked?: IconifyJSON
}

export interface CollectionMeta extends CollectionInfo {
  icons: string[]
  categories?: Record<string, string[]>
  variants?: Record<string, string[]>
}

const loadedMeta = ref<CollectionMeta[]>([])
const installed = ref<string[]>([])

export const collections = infoJSON.map(c => Object.freeze(c as any as CollectionInfo))
export const categories = Array.from(new Set(collections.map(i => i.category).filter(notNullish)))

export const isSearchOpen = ref(false)
export const categorySearch = ref('')

const fzf = new AsyncFzf(collections, {
  casing: 'case-insensitive',
  fuzzy: 'v1',
  selector: v => `${v.name} ${v.id} ${v.category} ${v.author}`,
})

export const filteredCollections = ref<CollectionInfo[]>(collections)

watch(categorySearch, (q) => {
  if (!q) {
    filteredCollections.value = collections
  }
  else {
    fzf.find(q).then((result) => {
      filteredCollections.value = result
        .map(i => i.item)
        .sort((a, b) => {
          if (sortAlphabetically.value)
            return a.name.localeCompare(b.name)
          return 0
        })
    }).catch(() => {
      // The search is canceled
    })
  }
})

export const sortedCollectionsInfo = computed(() =>
  filteredCollections.value
    .sort((a, b) => favoritedCollectionIds.value.indexOf(b.id) - favoritedCollectionIds.value.indexOf(a.id)),
)

export const favoritedCollections = computed(() =>
  filteredCollections.value.filter(i => isFavoritedCollection(i.id))
    .sort((a, b) => favoritedCollectionIds.value.indexOf(b.id) - favoritedCollectionIds.value.indexOf(a.id)),
)

export const recentCollections = computed(() =>
  filteredCollections.value.filter(i => isRecentCollection(i.id))
    .sort((a, b) => recentCollectionIds.value.indexOf(b.id) - recentCollectionIds.value.indexOf(a.id)),
)

export const isInstalled = (id: string) => installed.value.includes(id)
export const isMetaLoaded = (id: string) => !!loadedMeta.value.find(i => i.id === id)

// install the preview icons on the homepage
export function preInstall() {
  for (const collection of collections) {
    if (collection.prepacked)
      addCollection(collection.prepacked as any)
  }
}

export async function tryInstallFromLocal(id: string) {
  if (specialTabs.includes(id))
    return false

  if (isLocalMode)
    return true

  if (installed.value.includes(id))
    return true

  const result = await loadCollection(id)
  if (!result || !result.data)
    return false

  const data = result.data
  addCollection(data)
  installed.value.push(id)

  return true
}

// load full iconset
export async function downloadAndInstall(id: string) {
  if (specialTabs.includes(id))
    return false

  if (installed.value.includes(id))
    return true

  const data = Object.freeze(await fetch(`${staticPath}/collections/${id}-raw.json`).then(r => r.json()))

  addCollection(data)
  installed.value.push(id)

  if (!isLocalMode)
    saveCollection(id, data) // async

  return true
}

export async function cacheCollection(id: string) {
  progressMessage.value = 'Downloading...'
  inProgress.value = true
  await nextTick()
  await downloadAndInstall(id)
  inProgress.value = false
}

export async function getCollectionMeta(id: string): Promise<CollectionMeta | null> {
  let meta = loadedMeta.value.find(i => i.id === id)
  if (meta)
    return meta

  meta = await fetch(`${staticPath}/collections/${id}-meta.json`).then(r => r.json())

  if (!meta)
    return null

  meta.variants ||= getVariantCategories(meta)

  meta = Object.freeze(meta)

  loadedMeta.value.push(meta)

  return meta
}

function getVariantCategories(collection: CollectionMeta) {
  const variantsRule = variantCategories[collection.id]
  if (!variantsRule)
    return

  const variants: Record<string, string[]> = {}

  for (const icon of collection.icons) {
    const name = variantsRule.find(i => icon.endsWith(i[1]))?.[0] || 'Regular'
    if (!variants[name])
      variants[name] = []
    variants[name].push(icon)
  }

  return variants
}

export async function getFullMeta() {
  if (loadedMeta.value.length === collections.length)
    return loadedMeta.value

  loadedMeta.value = Object.freeze(
    await fetch(`${staticPath}/collections-meta.json`).then(r => r.json()),
  )

  return loadedMeta.value
}

preInstall()
