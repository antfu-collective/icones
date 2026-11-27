<script setup lang="ts">
import type { SettingsCategory, SettingsTheme } from '../sekiso/behavior/settings'
import { View } from '@sekiso/vue'
import { categories, collections, isInstalled } from '../data'
import { themeOrder, themes } from '../sekiso/app'
import { settingsView } from '../sekiso/views/settings'
import {
  isExcludedCategory,
  isExcludedCollection,
  isFavoritedCollection,
  themeName,
  toggleExcludedCategory,
  toggleExcludedCollection,
  toggleFavoriteCollection,
} from '../store'

const router = useRouter()

/** A few colors of each theme, to preview it by */
const themeChoices: SettingsTheme[] = themeOrder.map(name => ({
  name,
  swatches: ['surface', 'fg', 'accent', 'star'].map(token => themes[name]!.tokens[token]!),
}))

const settingsCategories = computed<SettingsCategory[]>(() => categories.map(category => ({
  name: category,
  hidden: Boolean(isExcludedCategory(category)),
  collections: collections
    .filter(collection => collection.category === category)
    .map(collection => ({
      id: collection.id,
      name: collection.name,
      favorite: isFavoritedCollection(collection.id),
      excluded: isExcludedCollection(collection),
      cached: isInstalled(collection.id),
    })),
})))

const options = computed(() => ({
  theme: themeName.value,
  themes: themeChoices,
  categories: settingsCategories.value,
  navigate: (to: string) => router.push(to),
  setTheme: (name: string) => themeName.value = name,
  toggleCategory: toggleExcludedCategory,
  toggleFavorite: toggleFavoriteCollection,
  toggleCollection: toggleExcludedCollection,
}))
</script>

<template>
  <WithNavbar>
    <View :of="settingsView" :options="options" />
  </WithNavbar>
</template>
