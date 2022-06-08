<script setup lang='ts'>
import type { PresentType } from '../data'
import { categories, collections, favoritedCollections, recentCollections } from '../data'

const categorized = computed(() => [
  {
    name: 'Favorites',
    type: 'favorite' as PresentType,
    collections: favoritedCollections.value,
  },
  {
    name: 'Recent',
    type: 'recent' as PresentType,
    collections: recentCollections.value,
  },
  ...categories.map(category => ({
    name: category,
    type: 'normal' as PresentType,
    collections: collections.filter(collection => collection.category === category),
  })),
])
</script>

<template>
  <WithNavbar>
    <NavPlaceholder class="sm:border-b border-base text-center m-auto flex font-light h-37px">
      <div class="m-auto">
        Icônes
      </div>
    </NavPlaceholder>
    <template v-for="c of categorized" :key="c.name">
      <div v-if="c.collections.length" px4>
        <div px-2 op50 mt6 text-lg>
          {{ c.name }}
        </div>
        <CollectionEntries
          :collections="c.collections"
          :type="c.type"
        />
      </div>
    </template>
    <Footer />
  </WithNavbar>
</template>
