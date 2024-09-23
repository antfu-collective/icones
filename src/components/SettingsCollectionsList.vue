<script setup lang="ts">
import type { CollectionInfo } from '../data'
import { isInstalled } from '../data'
import { isElectron } from '../env'
import { isExcludedCategory, isExcludedCollection, isFavoritedCollection, toggleExcludedCollection, toggleFavoriteCollection } from '../store'

defineProps<{
  collections: readonly CollectionInfo[]
}>()
</script>

<template>
  <div>
    <div
      v-for="c, idx of collections" :key="c.id" flex="~ gap-2" py1 px2 items-center
      border="~ base" mt--1px break-inside-avoid
      :class="idx === 0 ? 'border-t' : ''"
    >
      <RouterLink
        :to="`/collection/${c.id}`"
        flex-auto
        :class="isExcludedCollection(c) ? 'op25 line-through' : ''"
      >
        {{ c.name }}
      </RouterLink>
      <div />
      <div
        v-if="isInstalled(c.id) && !isElectron"
        icon-button class="!op50"
        i-carbon-cloud-auditing
        title="Cached in browser"
      />
      <button
        v-if="!isExcludedCollection(c)"
        icon-button
        :class="isFavoritedCollection(c.id) ? 'i-carbon:star-filled text-yellow' : 'i-carbon:star'"
        title="Toggle Favorite"
        @click="toggleFavoriteCollection(c.id)"
      />
      <button
        v-if="!isExcludedCategory(c.category)"
        icon-button
        :class="isExcludedCollection(c) ? 'i-carbon:view-off text-rose' : 'i-carbon:view'"
        title="Toggle Visible"
        @click="toggleExcludedCollection(c.id)"
      />
    </div>
  </div>
</template>
