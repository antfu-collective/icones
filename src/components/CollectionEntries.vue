<script setup lang="ts">
import type { CollectionInfo } from '../data'

defineProps<{ collections: CollectionInfo[] }>()
</script>

<template>
  <div class="collections-list grid overflow-y-overly">
    <CollectionEntry
      v-for="collection of collections"
      :key="collection.id"
      class="border-r border-b border-gray-200 dark:border-dark-200"
      :collection="collection"
    />
  </div>
</template>

<style>
.collections-list {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
