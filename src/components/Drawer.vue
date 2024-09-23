<script setup lang='ts'>
import { categorySearch, filteredCollections, sortedCollectionsInfo, specialTabs } from '../data'
import { isElectron } from '../env'
import { isFavoritedCollection, recentIconIds, toggleFavoriteCollection } from '../store'

const route = useRoute()
const current = computed(() => route.path.split('/').slice(-1)[0])

const collections = computed(() => {
  if (categorySearch.value) {
    return filteredCollections.value
  }
  else {
    return [
      { id: 'all', name: 'All' },
      { id: 'recent', name: 'Recent' },
      ...sortedCollectionsInfo.value,
    ]
  }
})
</script>

<template>
  <div border="r base" relative>
    <NavPlaceholder class="mb-4" />
    <div
      v-if="!isElectron"
      sticky top-0 bg-base z-1
    >
      <div flex="~ justify-between" border="b base">
        <button
          icon-button text-xl px-4 py-3
          @click="$router.replace('/')"
        >
          <div i-carbon:arrow-left />
        </button>
      </div>

      <!-- Searching -->
      <SearchBar
        v-model:search="categorySearch"
        placeholder="Search category..."
        input-class="text-xs"
        :border="false"
        class="border-b border-base"
      />
    </div>

    <!-- Collections -->
    <RouterLink
      v-for="collection in collections"
      :key="collection.id"
      class="px-3 py-1 flex border-b border-base"
      :to="`/collection/${collection.id}`"
    >
      <div
        class="flex-auto py-1"
        :class="collection.id === current ? 'text-primary' : ''"
      >
        <div class="text-base leading-tight">
          {{ collection.name }}
        </div>
        <div class="text-xs block opacity-50 mt-1">
          {{
            collection.id === 'recent'
              ? `${recentIconIds.length} icons`
              : collection.id !== 'all'
                ? `${collection.total} icons`
                : `${collections.length} iconsets`
          }}
        </div>
      </div>
      <button
        v-if="!specialTabs.includes(collection.id)"
        icon-button
        :class="isFavoritedCollection(collection.id) ? 'op50 hover:op100' : 'op0 hover:op50' "
        class="flex-none text-lg p0.5 -mr-1 hover:text-primary flex"
        @click="toggleFavoriteCollection(collection.id)"
      >
        <div :class="isFavoritedCollection(collection.id) ? 'i-carbon-star-filled' : 'i-carbon-star'" ma />
      </button>
    </RouterLink>
  </div>
</template>
