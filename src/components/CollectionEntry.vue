
<script setup lang="ts">
import type { CollectionInfo } from '../data'
import { isFavorited } from '../store'

defineProps<{
  collection: CollectionInfo
}>()
</script>

<template>
  <div
    :key="collection.id"
    class="px-2 py-4 relative bg"
  >
    <router-link
      class="flex flex-col text-gray-900 transition-all text-center justify-center dark:text-gray-300"
      hover="text-primary"
      :to="`/collection/${collection.id}`"
    >
      <div class="flex-auto text-lg">
        {{ collection.name }}
      </div>
      <div class="flex-auto opacity-50 text-xs">
        <span>{{ collection.author?.name }}</span>
        <span class="px-1 opacity-25">/</span>
        <span>{{ collection.license?.title }}</span>
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
</template>
