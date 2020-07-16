// @ts-ignore
import { computed, ref } from 'vue'
import infoJSON from '../public/collections-info.json'
import { favoritedCollections } from './store'

export interface CollectionInfo {
  id: string
  name: string
  author?: string
  license?: string
  licenseURL?: string
  url?: string
  sampleIcons?: string[]
}

export interface CollectionMeta extends CollectionInfo {
  icons: string[]
  categories?: Record<string, string[]>
}

const loadedMeta = ref<CollectionMeta[]>([])
const installed: string[] = []

export const collections = infoJSON.map(c => Object.freeze(c as CollectionInfo))

export const sortedCollectionsInfo = computed(() => {
  return [...collections]
    .sort((a, b) => favoritedCollections.value.indexOf(b.id) - favoritedCollections.value.indexOf(a.id))
})

export async function install(id: string) {
  if (installed.includes(id))
    return true

  const data = Object.freeze(await fetch(`/collections/${id}-raw.json`)
    .then(r => r.json()))

  window.Iconify.addCollection(data)
  installed.push(id)
  return true
}

export function isInstalled(id: string) {
  return installed.includes(id)
}

export function isMetaLoaded(id: string) {
  return !!loadedMeta.value.find(i => i.id === id)
}

export async function getMeta(id: string): Promise<CollectionMeta | null> {
  let meta = loadedMeta.value.find(i => i.id === id)
  if (meta)
    return meta

  meta = Object.freeze(await fetch(`/collections/${id}-meta.json`).then(r => r.json()))

  if (!meta)
    return null

  loadedMeta.value.push(meta)

  return meta
}

export async function getFullMeta() {
  if (loadedMeta.value.length === collections.length)
    return loadedMeta.value

  loadedMeta.value = Object.freeze(await fetch('/collections-meta.json')
    .then(r => r.json()))

  return loadedMeta.value
}

install('carbon')
