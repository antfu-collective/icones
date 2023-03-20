import { AsyncFzf, asyncExtendedMatch } from 'fzf'
import type { Ref } from 'vue'
import { computed, markRaw, ref, watch } from 'vue'
import type { CollectionMeta } from '../data'
import { specialTabs } from '../data'
import { searchAlias } from '../data/search-alias'

export function useSearch(collection: Ref<CollectionMeta | null>) {
  const category = ref('')
  const variant = ref('')
  const search = ref('')

  const isAll = computed(() => collection.value && specialTabs.includes(collection.value.id))
  const searchParts = computed(() => search.value.trim().toLowerCase().split(' ').filter(Boolean))

  const aliasedSearchCandidates = computed(() => {
    const options = new Set([
      searchParts.value.join(' '),
    ])

    searchParts.value.forEach((i, idx, arr) => {
      const alias = searchAlias.find(a => a.includes(i))
      if (alias?.length) {
        alias.forEach((a) => {
          options.add([...arr.slice(0, idx), a, arr.slice(idx + 1)].filter(Boolean).join(' ').trim())
        })
      }
    })

    return [...options]
  })

  // Matching any character used in extended match
  // https://github.com/junegunn/fzf#search-syntax
  const useExtendedMatch = computed(() => /[ '^$!]/.test(search.value))

  const iconSource = computed(() => {
    if (!collection.value)
      return []

    return (category.value && variant.value)
      ? arrayIntersection(
        collection.value.categories?.[category.value] || [],
        collection.value.variants?.[variant.value] || [],
      )
      : category.value
        ? (collection.value.categories?.[category.value] || [])
        : variant.value
          ? (collection.value.variants?.[variant.value] || [])
          : collection.value.icons
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

  function runSearch() {
    const finder = (useExtendedMatch.value || aliasedSearchCandidates.value.length > 1)
      ? fzf
      : fzfFast

    const searchString = aliasedSearchCandidates.value.join(' | ')

    finder.value.find(searchString)
      .then((result) => {
        icons.value = result.map(i => i.item)
      }).catch(() => {
        // The search is canceled
      })
  }

  const debouncedSearch = useDebounceFn(runSearch, 200)

  watch([category, variant], () => {
    runSearch()
  })

  watchEffect(() => {
    if (!search.value) {
      icons.value = iconSource.value
      return
    }

    if (isAll.value && !useExtendedMatch.value) {
      icons.value = iconSource.value
        .filter(i => aliasedSearchCandidates.value.some(s => i.includes(s)))
      return
    }

    debouncedSearch()
  })

  watch(
    collection,
    () => {
      category.value = ''
      variant.value = ''
    },
  )

  return {
    collection,
    search,
    category,
    variant,
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

export function arrayIntersection<T>(a: T[], b: T[]) {
  return a.filter(i => b.includes(i))
}
