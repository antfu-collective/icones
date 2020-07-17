<template>
  <div class="border-r border-gray-200">
    <NavPlaceholder class="mb-4"/>
    <!-- Collections -->
    <router-link
      v-for="collection in collections"
      :key="collection.id"
      class="px-4 py-2 border-b border-gray-200 flex"
      :to="`/collection/${collection.id}`"
    >
      <div
        class="flex-auto"
        :style="{color: (collection.id === current ? 'var(--theme-color)' : '#555')}"
      >
        <div class="text-base">
          {{ collection.name }}
        </div>
        <div class="text-xs block opacity-50 -mt-1">
          {{ collection.total }} icons
        </div>
      </div>
      <div
        :class="isFavorited(collection.id) ? '' : 'opacity-0 hover:opacity-50' "
      >
        <IconButton
          v-if="collection.id != 'all'"
          class="flex-none text-lg p-2 -mr-3"
          :icon="isFavorited(collection.id) ? 'carbon:bookmark' : 'carbon:up-to-top'"
          @click="()=>toggleFavorite(collection.id)"
        />
      </div>
    </router-link>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { sortedCollectionsInfo } from '../data'
import { isFavorited, toggleFavorite } from '../store'
import { isElectron } from '../env'

export default defineComponent({
  setup() {
    const route = useRoute()
    const current = computed(() => route.path.split('/').slice(-1)[0])

    const collections = computed(() => {
      return [
        { id: 'all', name: 'All' },
        ...sortedCollectionsInfo.value,
      ]
    })

    return {
      collections,
      current,
      toggleFavorite,
      isFavorited,
      isElectron,
    }
  },
})
</script>
