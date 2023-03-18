<script setup lang='ts'>
import { categorySearch, sortedCollectionsInfo, specialTabs } from '../data'
import { isFavoritedCollection, recentIconIds, sortAlphabetically, toggleFavoriteCollection } from '../store'
import { isElectron } from '../env'

const route = useRoute()
const current = computed(() => route.path.split('/').slice(-1)[0])

const collections = computed(() => {
  return [
    { id: 'all', name: 'All' },
    { id: 'recent', name: 'Recent' },
    ...sortedCollectionsInfo.value,
  ]
})
</script>

<template>
  <div border="r base">
    <NavPlaceholder class="mb-4" />
    <div
      v-if="!isElectron"
      sticky top-0 bg-base z-1
    >
      <div border="b base">
        <button
          v-show="$route.path !== '/'"
          icon-button text-xl px-4 py-3
          @click="$router.replace('/')"
        >
          <div i-carbon:arrow-left />
        </button>
      </div>

      <!-- Searching -->
      <div class="hidden py-2 md:flex border-b rounded outline-none py-1 px-4 dark:border-dark-200">
        <Icon icon="carbon:search" class="m-auto flex-none opacity-60" />
        <form action="/collection/all" class="flex-auto" role="search" method="get" @submit.prevent>
          <input
            v-model="categorySearch"
            aria-label="Search"
            class="text-xs outline-none w-full py-1 px-4 m-0 bg-transparent font-normal"
            name="s"
            placeholder="Search category..."
            autofocus
            autocomplete="off"
          >
        </form>

        <button
          class="flex items-center transition"
          :class="{
            'text-gray-500 hover:text-gray-600': sortAlphabetically,
            'text-gray-300 hover:text-gray-400': !sortAlphabetically,
          }"
          @click="sortAlphabetically = !sortAlphabetically"
        >
          <Icon
            icon="mdi:sort-alphabetical-ascending"
            class="m-auto text-lg -mr-1 "
          />
        </button>
      </div>
    </div>

    <!-- Collections -->
    <RouterLink
      v-for="collection in collections"
      :key="collection.id"
      class="px-4 py-2 flex border-b border-base"
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
