<script setup lang="ts">
import type { CollectionInfo, PresentType } from '../data'
import { isFavoritedCollection, removeRecentCollection, toggleFavoriteCollection } from '../store'

defineProps<{
  collection: CollectionInfo
  type?: PresentType
}>()
</script>

<template>
  <RouterLink
    :key="collection.id"
    p3 relative
    border="~ base"
    class="grid grid-cols-[1fr_90px] gap2 items-center color-base transition-all translate-z-0"
    hover="text-primary !border-primary shadow"
    :to="`/collection/${collection.id}`"
  >
    <div ml2>
      <div class="flex-auto text-lg leading-1em my1">
        {{ collection.name }}
        <span v-if="isFavoritedCollection(collection.id)" m="l--0.5" op80 text-xs inline-block align-top i-carbon-star-filled />
      </div>
      <div flex="~ col auto" opacity-50 text-xs>
        <span>{{ collection.author?.name }}</span>
        <span op50>{{ collection.license?.title }}</span>
        <span m1 />
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
    <div
      absolute top--1px right--1px
      flex="~ items-center"
      op0 hover="op100 transition-all"
    >
      <button
        class="group"
        border="~ primary" p2 bg-base
        :title="isFavoritedCollection(collection.id) ? 'Remove from favorites' : 'Add to favorites'"
        @click.prevent="toggleFavoriteCollection(collection.id)"
      >
        <div v-if="isFavoritedCollection(collection.id)" i-carbon-star-filled op50 group-hover="op100" />
        <div v-else i-carbon-star op50 group-hover="op100" />
      </button>
      <button
        v-if="type === 'recent'"
        class="group"
        border="~ primary" p2 bg-base ml--1px
        :title="type === 'recent' ? 'Remove from recent' : type === 'favorite' || isFavoritedCollection(collection.id) ? 'Remove from favorites' : 'Add to favorites'"
        @click.prevent="removeRecentCollection(collection.id)"
      >
        <div i-carbon-delete op50 group-hover="op100" />
      </button>
    </div>
  </RouterLink>
</template>
