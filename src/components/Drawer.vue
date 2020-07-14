<template>
  <div class="border-r border-gray-200">
    <div
      class="border-b border-gray-200"
    >
      <IconButton
        v-show="$route.path !== '/'"
        class="text-xl my-auto p-4 align-middle inline-block"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
    </div>
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
          {{ collection.icons.length }} icons
        </div>
      </div>
      <IconButton
        v-if="collection.id != 'all'"
        class="flex-none text-lg p-2 -mr-3"
        :class="isFavorited(collection.id) ? '' : 'opacity-0 hover:opacity-50' "
        :icon="isFavorited(collection.id) ? 'carbon:bookmark' : 'carbon:up-to-top'"
        @click="()=>toggleFavorite(collection.id)"
      />
    </router-link>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { sortedCollections, all } from '../data'
import { isFavorited, toggleFavorite } from '../store'

export default defineComponent({
  setup() {
    const route = useRoute()
    const current = computed(() => route.path.split('/').slice(-1)[0])

    const collections = computed(() => {
      return [
        all,
        ...sortedCollections.value,
      ]
    })

    return {
      collections,
      current,
      toggleFavorite,
      isFavorited,
    }
  },
})
</script>
