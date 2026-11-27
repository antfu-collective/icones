<script setup lang='ts'>
import type { HomeSection } from '../sekiso/behavior/home'
import { Scope, View } from '@sekiso/vue'
import { categories, categorySearch, favoritedCollections, filteredCollections, recentCollections } from '../data'
import { home } from '../sekiso/behavior/home'
import { homeSearchView, homeView } from '../sekiso/views/home'
import { favoritedCollectionIds, removeRecentCollection, toggleFavoriteCollection } from '../store'

const sections = shallowRef(getSections(categorySearch.value))

// Both lists derive from the search results, so they change after each search,
// and also after a favorite or recent change, which is reflected at once
watch([favoritedCollections, recentCollections], () => {
  sections.value = getSections(categorySearch.value)
})

function getSections(search: string): HomeSection[] {
  if (search) {
    return [
      { name: 'Result', type: 'result', collections: filteredCollections.value },
    ]
  }
  return [
    { name: 'Favorites', type: 'favorite', collections: favoritedCollections.value },
    { name: 'Recent', type: 'recent', collections: recentCollections.value },
    ...categories.map(category => ({
      name: category,
      type: 'normal' as const,
      collections: filteredCollections.value.filter(collection => collection.category === category),
    })),
  ]
}

const router = useRouter()
onKeyStroke('/', (e) => {
  e.preventDefault()
  router.replace('/collection/all')
})

const platform = (navigator as any).userAgentData?.platform || navigator.platform || ''

const options = computed(() => ({
  search: categorySearch.value,
  sections: sections.value,
  favorites: favoritedCollectionIds.value,
  mac: platform.toUpperCase().includes('MAC'),
  navigate: (to: string) => router.push(to),
  setSearch: (search: string) => categorySearch.value = search,
  toggleFavorite: toggleFavoriteCollection,
  removeRecent: removeRecentCollection,
}))
</script>

<template>
  <!-- One instance for both views, so the search and the list share it -->
  <Scope :of="home" :options="options">
    <WithNavbar>
      <template #header>
        <View :of="homeSearchView" />
      </template>
      <View :of="homeView" />
    </WithNavbar>
  </Scope>
</template>
