import type { CollectionMeta } from '../data'
import {
  collections,
  downloadAndInstall,
  getCollectionMeta,
  getFullMeta,
  isInstalled,
  isMetaLoaded,
  tryInstallFromLocal,
} from '../data'
import { isLocalMode } from '../env'
import { useSearch } from '../hooks'
import { isExcludedCollection, recentIconIds } from './localstorage'

const currentCollectionId = ref('')
const loaded = ref(false)
const installed = ref(false)
const collection = shallowRef<CollectionMeta | null>(null)

export const getSearchResults = createSharedComposable(() => {
  return useSearch(collection)
})

export function useCurrentCollection() {
  return collection
}

export function isCurrentCollectionLoading() {
  return computed(() => !loaded.value)
}

const recentIconsCollection = computed((): CollectionMeta => ({
  id: 'recent',
  name: 'Recent',
  icons: recentIconIds.value,
  categories: Object.fromEntries(
    Array.from(new Set(
      recentIconIds.value.map(i => i.split(':')[0]),
    ))
      .map(id => [collections.find(i => i.id === id)?.name || id, recentIconIds.value.filter(i => i.startsWith(`${id}:`))]),
  ),
}))

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
      icons: meta.flatMap((c) => {
        if (isExcludedCollection(c))
          return []
        return c.icons.map(i => `${c.id}:${i}`)
      }),
    }
    loaded.value = true
  }
  else if (id === 'recent') {
    collection.value = recentIconsCollection.value
    loaded.value = true
  }
  else {
    collection.value = await getCollectionMeta(id)
    loaded.value = true
  }

  return collection.value
}
