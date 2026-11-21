import type { Ref } from 'vue'
import type { CollectionMeta } from '../data'
import { asyncExtendedMatch, AsyncFzf } from 'fzf'
import { computed, markRaw, ref, watch } from 'vue'
import { specialTabs } from '../data'
import { predictWords } from '../utils/predict'
import { cleanupQuery } from '../utils/query'

export function useSearch(collection: Ref<CollectionMeta | null>) {
  const route = useRoute()
  const router = useRouter()

  const category = computed({
    get() {
      return route.query.category as string || ''
    },
    set(value: string) {
      router.replace({
        query: cleanupQuery({ ...route.query, category: value }),
      })
    },
  })
  const variant = computed({
    get() {
      return route.query.variant as string || ''
    },
    set(value: string) {
      router.replace({
        query: cleanupQuery({ ...route.query, variant: value }),
      })
    },
  })
  const search = computed({
    get() {
      return route.query.s as string || ''
    },
    set(value: string) {
      router.replace({
        query: cleanupQuery({ ...route.query, s: value }),
      })
    },
  })

  const isAll = computed(() => collection.value && specialTabs.includes(collection.value.id))
  const searchParts = computed(() => search.value.trim().toLowerCase().split(' ').filter(Boolean))

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
  let controller: AbortController | undefined

  function filterAll(pattern: string) {
    return iconSource.value.filter(i => i.includes(pattern))
  }

  async function find(pattern: string, extended: boolean) {
    const finder = extended ? fzf : fzfFast
    const result = await finder.value.find(pattern)
    return result.map(i => i.item)
  }

  async function runSearch() {
    controller?.abort()
    controller = new AbortController()
    const signal = controller.signal

    const parts = searchParts.value
    if (!parts.length) {
      icons.value = iconSource.value
      return
    }

    const extended = useExtendedMatch.value
    const plain = isAll.value && !extended
    const typed = parts.join(' ')

    try {
      const results = plain
        ? filterAll(typed)
        : await find(typed, extended)
      if (signal.aborted)
        return
      icons.value = results

      // The user writes fzf syntax, keep the query as typed
      if (/['^$!|]/.test(typed))
        return

      // Append the matches of the predicted words, after the matches of the typed text.
      // Corrections and completions come first, then related words, each in score order.
      const predictions = await predictWords(typed, signal)
      const ordered = [
        ...predictions.filter(p => p.kind !== 'related'),
        ...predictions.filter(p => p.kind === 'related'),
      ]
      const merged = [...results]
      const seen = new Set(merged)
      for (const prediction of ordered) {
        // The quote makes fzf match the word exactly
        const word = plain
          ? prediction.word
          : `'${prediction.word}`
        const index = parts.indexOf(prediction.from)
        const pattern = index < 0
          ? word
          : parts.map((part, i) => i === index
              ? word
              : part).join(' ')
        const matches = plain
          ? filterAll(pattern)
          : await find(pattern, true)
        if (signal.aborted)
          return
        for (const icon of matches) {
          if (!seen.has(icon)) {
            seen.add(icon)
            merged.push(icon)
          }
        }
      }
      if (merged.length > results.length)
        icons.value = merged
    }
    catch {
      // The search is canceled
    }
  }

  const debouncedSearch = useDebounceFn(runSearch, 200)

  watch([
    category,
    variant,
    () => collection.value?.id,
  ], () => {
    runSearch()
  })

  watchEffect(() => {
    if (!search.value) {
      controller?.abort()
      icons.value = iconSource.value
      return
    }

    // Show the plain matches at once, the predictions follow after the debounce
    if (isAll.value && !useExtendedMatch.value)
      icons.value = filterAll(searchParts.value.join(' '))

    debouncedSearch()
  })

  return {
    collection,
    search,
    category,
    variant,
    icons,
  }
}

// @unocss-include
export function getSearchHighlightHTML(
  text: string,
  search: string,
  baseClass = 'color-fade',
  activeClass = 'text-primary',
) {
  const start = text.indexOf(search || '')

  if (!search || start < 0)
    return `<span class="${baseClass}">${text}</span>`

  const end = start + search.length
  return `<span class="${baseClass}">${text.slice(0, start)}<b class="${activeClass}">${text.slice(start, end)}</b>${text.slice(end)}</span>`
}

export function arrayIntersection<T>(a: T[], b: T[]) {
  const set = new Set(b)
  return a.filter(i => set.has(i))
}
