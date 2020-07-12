<template>
  <div class="border-r border-gray-200">
    <router-link
      v-for="collection in collections"
      :key="collection.id"
      :to="`/collection/${collection.id}`"
    >
      <div
        class="px-4 py-2 border-b border-gray-200"
        :style="{color: (collection.id === current ? 'var(--theme-color)' : '#555')}"
      >
        <div class="text-base">
          {{ collection.name }}
        </div>
        <div class="text-xs block opacity-50 -mt-1">
          {{ collection.icons.length }} icons
        </div>
      </div>
    </router-link>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { collections, all } from '../data'

export default defineComponent({
  setup() {
    const route = useRoute()
    const current = computed(() => route.path.split('/').slice(-1)[0])

    return {
      collections: [
        all,
        ...collections,
      ],
      current,
    }
  },
})
</script>
