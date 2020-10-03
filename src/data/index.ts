import type { IconifyJSON } from '@iconify/iconify'
import { computed, ref } from 'vue'
import Iconify from '@purge-icons/generated'
import infoJSON from '../../public/collections-info.json'
import { favoritedCollections } from '../store'
import { isElectron, staticPath } from '../env'
import { saveCollection, loadCollection } from '../store/indexedDB'

export interface CollectionInfo {
  id: string
  name: string
  author?: string
  license?: string
  licenseURL?: string
  url?: string
  sampleIcons?: string[]
  category?: string
  palette?: string
  prepacked?: IconifyJSON
}

export interface CollectionMeta extends CollectionInfo {
  icons: string[]
  categories?: Record<string, string[]>
}

const loadedMeta = ref<CollectionMeta[]>([])
const installed = ref<string[]>([])

export const collections = infoJSON.map(c => Object.freeze(c as any as CollectionInfo))
export const categories = Array.from(new Set(collections.map(i => i.category).filter(Boolean)))
export const categoryFilter = ref<string | null>(null)

export const sortedCollectionsInfo = computed(() => {
  return collections
    .filter((c) => {
      if (!categoryFilter.value)
        return true
      return c.category === categoryFilter.value
    })
    .sort(
      (a, b) =>
        favoritedCollections.value.indexOf(b.id)
      - favoritedCollections.value.indexOf(a.id),
    )
})

export const isInstalled = (id: string) => installed.value.includes(id)
export const isMetaLoaded = (id: string) => !!loadedMeta.value.find(i => i.id === id)

// install the preview icons on the homepage
export function preInstall() {
  for (const collection of collections) {
    if (collection.prepacked)
      Iconify.addCollection(collection.prepacked as any)
  }
}

export async function tryInstallFromLocal(id: string) {
  if (id === 'all')
    return false

  if (isElectron)
    return true

  if (installed.value.includes(id))
    return true

  const result = await loadCollection(id)
  if (!result || !result.data)
    return false

  const data = result.data
  Iconify.addCollection(data)
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

  Iconify.addCollection(data)
  installed.value.push(id)

  if (!isElectron)
    saveCollection(id, data) // async

  return true
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
if (isElectron)
  downloadAndInstall('carbon')
