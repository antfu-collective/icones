<script setup lang="ts">
import type { CollectionInfo } from '../data'
import { isInstalled } from '../data'
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
      <span
        v-if="isInstalled(c.id)"
        i-carbon-cloud-auditing op50 shrink-0
        role="img"
        aria-label="Cached in browser"
        title="Cached in browser"
      />
      <button
        v-if="!isExcludedCollection(c)"
        icon-button
        :class="isFavoritedCollection(c.id) ? 'i-carbon:star-filled text-yellow' : 'i-carbon:star'"
        title="Toggle Favorite"
        :aria-label="`Favorite ${c.name}`"
        :aria-pressed="isFavoritedCollection(c.id)"
        @click="toggleFavoriteCollection(c.id)"
      />
      <button
        v-if="!isExcludedCategory(c.category)"
        icon-button
        :class="isExcludedCollection(c) ? 'i-carbon:view-off text-rose' : 'i-carbon:view'"
        title="Toggle Visible"
        :aria-label="`Show ${c.name}`"
        :aria-pressed="!isExcludedCollection(c)"
        @click="toggleExcludedCollection(c.id)"
      />
    </div>
  </div>
</template>
