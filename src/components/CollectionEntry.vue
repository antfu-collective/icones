<script setup lang="ts">
import type { CollectionInfo, PresentType } from '../data'
import { isFavorited, removeRecent, toggleFavorite } from '../store'

const props = defineProps<{
  collection: CollectionInfo
  type?: PresentType
}>()

function onAction() {
  if (props.type === 'recent')
    removeRecent(props.collection.id)
  else
    toggleFavorite(props.collection.id)
}
</script>

<template>
  <RouterLink
    :key="collection.id"
    px-2 py-4 relative
    border="~ base"
    class="flex flex-col text-gray-900 transition-all text-center justify-center dark:text-gray-300"
    hover="text-primary !border-primary shadow"
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
    <button
      class="group"
      absolute top-1 right-1 p2 hover="bg-gray/10" rounded
      @click.prevent="onAction"
    >
      <div
        v-if="type === 'recent'"
        i-carbon-delete op0 group-hover="op100"
      />
      <div
        v-else-if="type === 'favorite' || isFavorited(collection.id)"
        i-carbon-bookmark-filled op50 group-hover="op100 i-carbon-bookmark"
      />
      <div
        v-else
        i-carbon-bookmark-filled op0 group-hover="op100"
      />
    </button>
  </RouterLink>
</template>
