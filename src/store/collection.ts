import type { CollectionMeta } from '../data'
import {
  downloadAndInstall,
  getFullMeta,
  getMeta,
  isInstalled,
  isMetaLoaded,
  tryInstallFromLocal,
} from '../data'
import { useSearch } from '../hooks'
import { isLocalMode } from '../env'

const currentCollectionId = ref('')
const loaded = ref(false)
const installed = ref(false)
const collection = ref<CollectionMeta | null>(null)
const searchResult = useSearch(collection)

export function getSearchResults() {
  return searchResult
}

export function useCurrentCollection() {
  return collection
}

export function isCurrentCollectionLoading() {
  return computed(() => !loaded.value)
}

export async function setCurrentCollection(id: string) {
  currentCollectionId.value = id

  if (!id) {
    loaded.value = false
    installed.value = false
    collection.value = null
    return collection.value
  }

  loaded.value = isMetaLoaded(id)
  installed.value = isInstalled(id)

  if (!installed.value) {
    if (isLocalMode)
      installed.value = await downloadAndInstall(id)
    else
      installed.value = await tryInstallFromLocal(id)
  }

  if (id === 'all') {
    const meta = await getFullMeta()
    collection.value = {
      id: 'all',
      name: 'All',
      icons: meta.flatMap(c => c.icons.map(i => `${c.id}:${i}`)),
    }
    loaded.value = true
  }
  else {
    collection.value = await getMeta(id)
    loaded.value = true
  }

  return collection.value
}
