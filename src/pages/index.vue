<template>
  <WithNavbar>
    <NavPlaceholder class="sm:border-b border-gray-200 text-center m-auto flex font-light dark:border-dark-200" style="height:37px">
      <div class="m-auto">
        Icônes
      </div>
    </NavPlaceholder>
    <div class="collections-list grid overflow-y-overlay">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="
          px-2 py-4 border-r border-b border-gray-200 relative
          dark:border-dark-200
        "
      >
        <router-link
          class="
            flex flex-col text-gray-900 text-center justify-center hover:text-primary
            dark:text-gray-300
          "
          :to="`/collection/${collection.id}`"
        >
          <div class="flex-auto text-lg">
            {{ collection.name }}
          </div>
          <div class="flex-auto opacity-50 text-xs">
            <span>{{ collection.author }}</span>
            <span class="px-1 opacity-25">/</span>
            <span>{{ collection.license }}</span>
            <span class="px-1 opacity-25">/</span>
            <span>{{ collection.total }} icons</span>
          </div>
          <Icons
            :icons="collection.sampleIcons"
            :namespace="`${collection.id}:`"
            color-class=""
            size="xl"
            spacing="m-1"
            class="mt-2 mb-1 justify-center opacity-75 overflow-hidden flex-none pointer-events-none"
          />
        </router-link>
        <IconButton
          v-if="isFavorited(collection.id)"
          class="absolute top-0 right-0 p-2 text-lg dark:text-gray-100"
          icon="carbon:bookmark"
        />
      </div>
    </div>
    <Footer />
  </WithNavbar>
</template>

<script setup lang='ts'>
import { sortedCollectionsInfo as collections } from '../data'
import { isFavorited } from '../store'
import { sample } from '../utils/sample'
</script>

<style>
.collections-list {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
