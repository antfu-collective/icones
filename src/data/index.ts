import type { IconifyJSON } from 'iconify-icon'
import { notNullish } from '@antfu/utils'
import { addCollection } from 'iconify-icon'
import { categorySearch, favoritedIds, inProgress, isFavorited, isRecent, progressMessage, recentIds, sortAlphabetically } from '../store'
import { isLocalMode, staticPath } from '../env'
import { loadCollection, saveCollection } from '../store/indexedDB'
import infoJSON from './collections-info.json'

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
}

const loadedMeta = ref<CollectionMeta[]>([])
const installed = ref<string[]>([])

const sanitize = (q: string) => q.toLowerCase().replaceAll(' ', '')

export const collections = infoJSON.map(c => Object.freeze(c as any as CollectionInfo))
export const categories = Array.from(new Set(collections.map(i => i.category).filter(notNullish)))

export const filteredCollections = computed(() =>
  collections
    .filter(collection => sanitize(collection.name).includes(sanitize(categorySearch.value)))
    .sort((a, b) => {
      if (sortAlphabetically.value)
        return sanitize(a.name).localeCompare(sanitize(b.name))

      return 0
    }),
)

export const sortedCollectionsInfo = computed(() =>
  filteredCollections.value
    .sort((a, b) => favoritedIds.value.indexOf(b.id) - favoritedIds.value.indexOf(a.id)),
)

export const favoritedCollections = computed(() =>
  filteredCollections.value.filter(i => isFavorited(i.id))
    .sort((a, b) => favoritedIds.value.indexOf(b.id) - favoritedIds.value.indexOf(a.id)),
)

export const recentCollections = computed(() =>
  filteredCollections.value.filter(i => isRecent(i.id))
    .sort((a, b) => recentIds.value.indexOf(b.id) - recentIds.value.indexOf(a.id)),
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
  if (id === 'all')
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
  if (id === 'all')
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

export async function getMeta(id: string): Promise<CollectionMeta | null> {
  let meta = loadedMeta.value.find(i => i.id === id)
  if (meta)
    return meta

  meta = Object.freeze(
    await fetch(`${staticPath}/collections/${id}-meta.json`).then(r => r.json()),
  )

  if (!meta)
    return null

  loadedMeta.value.push(meta)

  return meta
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
