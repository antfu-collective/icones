<script setup lang="ts">
import type { PresentType } from '../data'
import { categories, collections } from '../data'
import { isExcludedCategory, toggleExcludedCategory } from '../store'

const categorizedCollections = computed(() => categories.map(category => ({
  name: category,
  type: 'normal' as PresentType,
  collections: collections.filter(collection => collection.category === category),
})))
</script>

<template>
  <WithNavbar>
    <div p4 h-screen grid pb-20>
      <!-- <h1 text-xl>
        Features
      </h1>

      <input id="toggle-dark-mode" v-model="darkMode" type="checkbox"> -->

      <h1 text-xl>
        Collections
      </h1>
      <p op50 mb5>
        Manage collections to be listed in the home page and search results.
      </p>

      <div flex="~ gap-4" w-full of-auto>
        <div v-for="c of categorizedCollections" :key="c.name">
          <div flex py1 px2>
            <h1 font-bold op75 flex-auto>
              {{ c.name }}
            </h1>
            <button
              icon-button
              :class="isExcludedCategory(c.name) ? 'i-carbon:view-off text-red' : 'i-carbon:view'"
              title="Toggle Visible"
              @click="toggleExcludedCategory(c.name)"
            />
          </div>

          <SettingsCollectionsList :collections="c.collections" w-70 />
        </div>
      </div>
    </div>
  </WithNavbar>
</template>
