import Fuse from 'fuse.js'
import { ref, computed, markRaw, Ref, watch } from 'vue'
import { useThrottle } from '@vueuse/core'
import { collections, all } from '../data'
import { showCategories } from '../store'

export function useSearch(id: Ref<string>, defaultCategory = '', defaultSearch = '') {
  const category = ref(defaultCategory)
  const search = ref(defaultSearch)
  const throttledSearch = useThrottle(search, 150)

  const collection = computed(() => {
    return id.value === 'all'
      ? all
      : collections.find(c => c.id === id.value)!
  })

  const iconSource = computed(() => {
    if (category.value && showCategories.value)
      return collection.value.categories?.[category.value] || []
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

  watch(id, () => { category.value = defaultCategory })

  return {
    collection,
    search,
    category,
    icons,
  }
}
