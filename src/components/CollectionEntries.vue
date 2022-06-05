<script setup lang="ts">
import type { CollectionInfo, PresentType } from '../data'

defineProps<{
  collections: CollectionInfo[]
  type?: PresentType
}>()
</script>

<template>
  <div class="collections-list grid gap2" p2>
    <CollectionEntry
      v-for="collection of collections"
      :key="collection.id"
      :type="type"
      :collection="collection"
    />
  </div>
</template>

<style>
.collections-list {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
