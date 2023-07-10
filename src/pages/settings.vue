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
    <div py-4 of-hidden grid="~ rows-[max-content_1fr]">
      <!-- <h1 text-xl>
        Features
      </h1>

      <input id="toggle-dark-mode" v-model="darkMode" type="checkbox"> -->

      <div px4>
        <h1 text-xl>
          Collections
        </h1>
        <p op50 mb5>
          Manage collections to be listed in the home page and search results.
        </p>
      </div>

      <div of-y-auto w-full px4 pb4 class="masonry">
        <div v-for="c of categorizedCollections" :key="c.name" mb-10>
          <div flex py1 px2 break-inside-avoid>
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

          <SettingsCollectionsList :collections="c.collections" />
        </div>
      </div>
    </div>
  </WithNavbar>
</template>

<style>
.masonry {
  list-style: none;
  column-gap: 1em;
  column-count: 1;
}
@screen sm {
  .masonry {
    column-count: 2;
  }
}
@screen md {
  .masonry {
    column-count: 3;
  }
}
@screen lg {
  .masonry {
    column-count: 4;
  }
}
@screen xl {
  .masonry {
    column-count: 5;
  }
}
</style>
