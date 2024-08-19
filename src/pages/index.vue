<script setup lang='ts'>
import type { PresentType } from '../data'
import { categories, categorySearch, favoritedCollections, filteredCollections, recentCollections } from '../data'

const searchbar = ref<{ input: HTMLElement }>()

const categorized = ref(getIconList(categorySearch.value))

let categorizeDebounceTimer: NodeJS.Timeout | null = null

watch([categorySearch, favoritedCollections, recentCollections], ([newVal]) => {
  if (categorizeDebounceTimer)
    clearTimeout(categorizeDebounceTimer)
  categorizeDebounceTimer = setTimeout(() => {
    categorizeDebounceTimer = null
    categorized.value = getIconList(newVal)
  }, 500)
})

function getIconList(searchString: string) {
  if (searchString) {
    return [
      {
        name: 'Result',
        type: 'result' as PresentType,
        collections: filteredCollections.value,
      },
    ]
  }
  else {
    return [
      {
        name: 'Favorites',
        type: 'favorite' as PresentType,
        collections: favoritedCollections.value,
      },
      {
        name: 'Recent',
        type: 'recent' as PresentType,
        collections: recentCollections.value,
      },
      ...categories.map(category => ({
        name: category,
        type: 'normal' as PresentType,
        collections: filteredCollections.value.filter(collection => collection.category === category),
      })),
    ]
  }
}

const router = useRouter()
onKeyStroke('/', (e) => {
  e.preventDefault()
  router.replace('/collection/all')
})
onMounted(() => searchbar.value?.input.focus())

const isMacOS = navigator.platform.toUpperCase().includes('MAC')

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    router.replace(`/collection/all?s=${categorySearch.value}`)
    categorySearch.value = ''
  }
}
</script>

<template>
  <WithNavbar>
    <div of-hidden grid="~ rows-[max-content_1fr]">
      <!-- Searching -->
      <div md:mx-6 md:mt-6>
        <SearchBar
          ref="searchbar"
          v-model:search="categorySearch"
          placeholder="Search category..."
          flex
          @on-keydown="onKeydown"
        />
        <RouterLink
          :class="categorySearch ? '' : 'op0 pointer-events-none'"
          px4 py2 w-full mt--1px text-sm z--1 h-10
          flex="~ gap-2" items-center
          border="~ base rounded-b"
          hover="text-primary !border-primary shadow"
          :to="`/collection/all?s=${categorySearch}`"
        >
          <div i-carbon-direction-right-01 scale-y--100 op50 />
          Search for all icons...
          <div>
            <kbd text-sm border="~ base rounded" px1>{{ isMacOS ? '⌘' : 'Ctrl' }}</kbd> + <kbd text-sm border="~ base rounded" px1>Enter</kbd>
          </div>
        </RouterLink>
      </div>

      <div of-y-auto>
        <!-- Category listing -->
        <template v-for="c of categorized" :key="c.name">
          <div v-if="(c.collections).length" px4>
            <div px-2 op50 mt6 text-lg>
              {{ c.name }}
            </div>
            <CollectionEntries
              of-hidden
              :collections="c.collections"
              :type="c.type"
            />
          </div>
        </template>

        <div
          v-if="categorized.every(c => !c.collections.length)"
          class="flex flex-col flex-grow w-full py-6 justify-center items-center"
        >
          <Icon icon="ph:x-circle-bold" class="text-4xl mb-2 opacity-20" />
          <span class="text-lg opacity-60">There is no result corresponding to your search query.</span>
        </div>
        <Footer />
      </div>
    </div>
  </WithNavbar>
</template>
