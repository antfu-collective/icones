<template>
  <WithNavbar>
    <div class="">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <router-link
          v-for="collection in collections"
          :key="collection.id"
          :to="`/collection/${collection.id}`"
        >
          <div class="flex flex-col py-4 relative border-r border-b border-gray-200 transition-all duration-300 text-gray-900 hover:text-primary">
            <div class="flex-auto bg-opacity-50 text-center">
              <div class="text-lg">
                {{ collection.name }}
              </div>
              <div class="text-gray-500 text-sm block leading-none">
                {{ collection.author }}
              </div>
            </div>
            <Icons
              :icons="collection.icons.slice(0, 7)"
              :namespace="`${collection.id}:`"
              class="py-2 justify-center overflow-hidden flex-none pointer-events-none"
            />
            <div class="flex-auto bg-opacity-50 text-center">
              <div class="text-gray-500 text-xs block">
                {{ collection.license }}
              </div>
              <div class="text-gray-500 text-xs block">
                {{ collection.icons.length }} icons
              </div>
            </div>
            <IconButton v-if="isFavorited(collection.id)" class="absolute top-0 right-0 p-2 text-lg" icon="carbon:bookmark" />
          </div>
        </router-link>
      </div>
    </div>
    <Footer />
  </WithNavbar>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { sortedCollections } from '../data'
import { isFavorited } from '../store'
import { sample } from '../utils/sample'

export default defineComponent({
  data() {
    return {
      collections: sortedCollections,
      isFavorited,
      sample,
    }
  },
})
</script>
