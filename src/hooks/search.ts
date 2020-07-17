import Fuse from 'fuse.js'
import { ref, computed, markRaw, Ref, watch } from 'vue'
import { useThrottle } from '@vueuse/core'
import { CollectionMeta } from '../data'

export function useSearch(collection: Ref<CollectionMeta | null>, defaultCategory = '', defaultSearch = '') {
  const category = ref(defaultCategory)
  const search = ref(defaultSearch)
  const throttledSearch = useThrottle(search, 300)

  const iconSource = computed(() => {
    if (!collection.value)
      return []

    if (category.value)
      return (collection.value.categories && collection.value.categories[category.value]) || []
    else
      return collection.value.icons
  })

  const fuse = computed(() => {
    const icons = iconSource.value.map(icon => ({ icon }))
    return markRaw(new Fuse(icons, {
      includeScore: false,
      keys: ['icon'],
    }))
  })

  const icons = computed(() => {
    const searchString = throttledSearch.value.trim().toLowerCase()
    if (!searchString)
      return iconSource.value
    else
      return fuse.value.search(searchString).map(i => i.item.icon)
  })

  watch(collection, () => { category.value = defaultCategory })

  return {
    collection,
    search,
    category,
    icons,
  }
}

export function getSearchHighlightHTML(text: string, search: string, baseClass = 'text-gray-500', activeClass = 'text-primary') {
  const start = text.indexOf(search || '')

  if (!search || start < 0)
    return `<span class="${baseClass}">${text}</span>`

  const end = start + search.length
  return `<span class="${baseClass}">${text.slice(0, start)}<b class="${activeClass}">${text.slice(start, end)}</b>${text.slice(end)}</span>`
}
