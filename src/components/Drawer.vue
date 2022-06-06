<script setup lang='ts'>
import { sortedCollectionsInfo } from '../data'
import { isFavorited, toggleFavorite } from '../store'
import { isElectron } from '../env'

const route = useRoute()
const current = computed(() => route.path.split('/').slice(-1)[0])

const collections = computed(() => {
  return [
    { id: 'all', name: 'All' },
    ...sortedCollectionsInfo.value,
  ]
})
</script>

<template>
  <div class="border-r border-gray-200 dark:border-dark-200">
    <NavPlaceholder class="mb-4" />
    <div
      v-if="!isElectron"
      class="sticky top-0 bg-white dark:bg-dark-100 z-1 border-b border-gray-200 dark:border-dark-200"
    >
      <IconButton
        v-show="$route.path !== '/'"
        class="text-xl my-auto px-4 py-3 align-middle inline-block"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
    </div>

    <!-- Collections -->
    <router-link
      v-for="collection in collections"
      :key="collection.id"
      class="px-4 py-2 flex border-b border-gray-200 dark:border-dark-200"
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
          {{ collection.id !== 'all' ? `${collection.total} icons` : `${collections.length} iconsets` }}
        </div>
      </div>
      <button
        v-if="collection.id !== 'all'"
        :class="isFavorited(collection.id) ? 'op50 hover:op100' : 'op0 hover:op50' "
        class="flex-none text-lg p0.5 -mr-1 hover:text-primary flex"
        @click="() => toggleFavorite(collection.id)"
      >
        <div :class="isFavorited(collection.id) ? 'i-carbon-star-filled' : 'i-carbon-star'" ma />
      </button>
    </router-link>
  </div>
</template>
