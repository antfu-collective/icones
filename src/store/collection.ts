import { ref } from 'vue'
import {
  isMetaLoaded,
  isInstalled,
  CollectionMeta,
  getFullMeta,
  install,
  getMeta,
} from '../data'
import { useSearch } from '../hooks'

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
    installed.value = await install(id)
  }

  if (id === 'all') {
    const meta = await getFullMeta()
    collection.value = {
      id: 'all',
      name: 'All',
      icons: meta.flatMap((c) => c.icons.map((i) => `${c.id}:${i}`)),
    }
  } else {
    collection.value = await getMeta(id)
    loaded.value = true
  }

  return collection.value 
}
