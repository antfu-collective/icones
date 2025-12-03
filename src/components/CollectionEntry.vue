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
    :class="collection.hidden ? 'opacity-64 border-dashed hover:opacity-100' : ''"
    class="grid grid-cols-[1fr_90px] gap2 items-center color-base transition-all translate-z-0 group"
    hover="text-primary !border-primary shadow"
    :to="`/collection/${collection.id}`"
  >
    <div ml2>
      <div class="flex-auto text-lg leading-1em my1" :class="{ 'line-through group-hover:no-underline': collection.hidden }">
        {{ collection.name }}
        <span inline-flex align-top flex="items-center gap-0.5" m="l--0.5">
          <span v-if="isFavoritedCollection(collection.id)" op80 text-xs inline-block i-carbon-star-filled />
          <span v-if="collection.hidden" op80 text-xs text-orange inline-block i-carbon:information-disabled />
        </span>
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
      op0 group-hover="op100 transition-all"
      un-children="op-64 hover:op-100"
    >
      <button
        border="~ primary" p2 bg-base
        :title="isFavoritedCollection(collection.id) ? 'Remove from favorites' : 'Add to favorites'"
        :class="{ 'border-dashed': collection.hidden }"
        @click.prevent="toggleFavoriteCollection(collection.id)"
      >
        <div v-if="isFavoritedCollection(collection.id)" i-carbon-star-filled />
        <div v-else i-carbon-star />
      </button>
      <button
        v-if="type === 'recent'"
        border="~ primary" p2 bg-base ml--1px
        :title="type === 'recent' ? 'Remove from recent' : type === 'favorite' || isFavoritedCollection(collection.id) ? 'Remove from favorites' : 'Add to favorites'"
        :class="{ 'border-dashed': collection.hidden }"
        @click.prevent="removeRecentCollection(collection.id)"
      >
        <div i-carbon-delete />
      </button>
    </div>
  </RouterLink>
</template>
