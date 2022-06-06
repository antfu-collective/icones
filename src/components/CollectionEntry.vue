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
    p2 relative
    border="~ base"
    class="grid grid-cols-[1fr_90px] items-center color-base transition-all"
    hover="text-primary !border-primary shadow"
    :to="`/collection/${collection.id}`"
  >
    <div ml2>
      <div class="flex-auto text-lg leading-1em my1">
        {{ collection.name }}
      </div>
      <div class="flex-auto opacity-50 text-xs flex flex-col">
        <span>{{ collection.author?.name }}</span>
        <span>{{ collection.license?.title }}</span>
        <span>{{ collection.total }} icons</span>
      </div>
    </div>
    <Icons
      :icons="collection.sampleIcons"
      :namespace="`${collection.id}:`"
      color-class=""
      size="xl"
      spacing="m-1"
      class="ma justify-center opacity-75 flex-wrap pointer-events-none"
    />
    <button
      class="group"
      absolute top--1px right--1px p2 border="~ transparent" hover="bg-base border-primary"
      :title="type === 'recent' ? 'Remove from recent' : type === 'favorite' || isFavorited(collection.id) ? 'Remove from favorites' : 'Add to favorites'"
      @click.prevent="onAction"
    >
      <div
        v-if="type === 'recent'"
        i-carbon-delete op0 group-hover="op100"
      />
      <div
        v-else-if="type === 'favorite' || isFavorited(collection.id)"
        i-carbon-bookmark-filled op0 group-hover="op100"
      />
      <div
        v-else
        i-carbon-bookmark op0 group-hover="op100"
      />
    </button>
  </RouterLink>
</template>
