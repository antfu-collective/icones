import { AsyncFzf, asyncExtendedMatch } from 'fzf'
import type { Ref } from 'vue'
import { computed, markRaw, ref, watch } from 'vue'
import type { CollectionMeta } from '../data'

export function useSearch(collection: Ref<CollectionMeta | null>, defaultCategory = '', defaultSearch = '') {
  const category = ref(defaultCategory)
  const search = ref(defaultSearch)
  const isAll = computed(() => collection.value && collection.value.id === 'all')

  const iconSource = computed(() => {
    if (!collection.value)
      return []

    if (category.value)
      return (collection.value.categories && collection.value.categories[category.value]) || []
    else
      return collection.value.icons
  })

  const fzf = computed(() => {
    return markRaw(new AsyncFzf(iconSource.value, {
      casing: 'case-insensitive',
      match: asyncExtendedMatch,
    }))
  })

  const fzfFast = computed(() => {
    return markRaw(new AsyncFzf(iconSource.value, {
      casing: 'case-insensitive',
      // v1 is faster
      // https://fzf.netlify.app/docs/latest#async-finder-considering-other-options-first
      fuzzy: 'v1',
    }))
  })

  const icons = ref<string[]>([])

  watchEffect(() => {
    const searchQuery = search.value.toLowerCase()
    
    if (!searchQuery) {
      icons.value = iconSource.value
      return
    }

    // Matching any character used in extended match
    // https://github.com/junegunn/fzf#search-syntax
    const useExtendedMatch = /[ '^$!]/.test(searchQuery)

    const aliases = [
      ['cog', 'gear'],
    ]

    const aliasSet = useExtendedMatch ? null : aliases.find(set => set.includes(searchQuery))

    if (isAll.value && !useExtendedMatch) {
      icons.value = iconSource.value.filter(i => {
        if (aliasSet) {
          return aliasSet.some(alias => i.includes(alias))
        }
        return i.includes(searchQuery)
      })
      return
    }

    const finder = useExtendedMatch || aliasSet ? fzf : fzfFast
    const query = aliasSet ? aliasSet.join(' | ') : searchQuery

    finder.value.find(query).then((result) => {
      icons.value = result.map(i => i.item)
    }).catch(() => {
      // The search is canceled
    })
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
