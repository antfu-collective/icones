<script setup lang='ts'>
import type { PresentType } from '../data'
import { categories, categorySearch, favoritedCollections, filteredCollections, recentCollections } from '../data'

const searchbar = ref<{ input: HTMLElement }>()

const categorized = shallowRef(getIconList(categorySearch.value))
const availableCategories = computed(() => categorized.value.filter(c => c.collections.length > 0))

// Both lists derive from the search results, so they change after each search,
// and also after a favorite or recent change, which is reflected at once
watch([favoritedCollections, recentCollections], () => {
  categorized.value = getIconList(categorySearch.value)
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

const platform = (navigator as any).userAgentData?.platform || navigator.platform || ''
const isMacOS = platform.toUpperCase().includes('MAC')

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    router.replace(`/collection/all?s=${categorySearch.value}`)
    categorySearch.value = ''
  }
}
</script>

<template>
  <WithNavbar>
    <!-- Searching -->
    <template #header>
      <div px-4 pt-4 md:px-6 md:pt-6>
        <SearchBar
          ref="searchbar"
          v-model:search="categorySearch"
          placeholder="Search category..."
          flex
          :class="categorySearch ? '!rounded-b-none' : ''"
          @on-keydown="onKeydown"
        />
        <RouterLink
          :class="categorySearch ? '' : 'op0 pointer-events-none max-md:hidden'"
          px4 py2 w-full mt--1px text-sm z--1 h-10
          flex="~ gap-2" items-center
          border="~ base rounded-b-lg"
          hover="text-primary !border-primary shadow"
          :to="`/collection/all?s=${categorySearch}`"
        >
          <div i-carbon-direction-right-01 scale-y--100 op50 />
          Search for all icons...
          <div max-md:hidden>
            <kbd text-sm border="~ base rounded" px1>{{ isMacOS ? '⌘' : 'Ctrl' }}</kbd> + <kbd text-sm border="~ base rounded" px1>Enter</kbd>
          </div>
        </RouterLink>
      </div>
    </template>

    <div flex-auto md:of-y-auto relative space-y-4 md:space-y-6 pt-2 md:pt-0>
      <!-- Category listing -->
      <template v-for="c of availableCategories" :key="c.name">
        <div px-2 md:px-4>
          <div
            px-2 py-1 sticky top-0 bg-base z-1
            class="max-md:top-[var(--header-height)]"
            flex="~ items-baseline gap-2"
          >
            <span text-lg op50>{{ c.name }}</span>
            <span text-xs op50>{{ c.collections.length }}</span>
          </div>
          <CollectionEntries
            of-hidden
            :collections="c.collections"
            :type="c.type"
          />
        </div>
      </template>

      <div
        v-if="availableCategories.length === 0"
        class="flex flex-col flex-grow w-full py-6 justify-center items-center"
      >
        <Icon icon="ph:x-circle-bold" class="text-4xl mb-2 opacity-20" />
        <span class="text-lg opacity-60">There is no result corresponding to your search query.</span>
      </div>

      <Footer />
    </div>
  </WithNavbar>
</template>
