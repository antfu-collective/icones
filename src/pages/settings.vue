<script setup lang="ts">
import type { PresentType } from '../data'
import { categories, collections } from '../data'
import { isExcludedCategory, toggleExcludedCategory } from '../store'

const categorizedCollections = computed(() => categories.map(category => ({
  name: category,
  type: 'normal' as PresentType,
  collections: collections.filter(collection => collection.category === category),
})))

const apikey = useStorage('gemini_api_key', '')
</script>

<template>
  <WithNavbar>
    <div py-4 of-hidden grid="~ rows-[max-content_1fr]">
      <div px4 mb2>
        <h1 text-xl>
          Gemini AI Key
        </h1>
        <p op50 mb2>
          To Generate api key , please visit the
          <a href="https://aistudio.google.com/apikey" target="_blank" class="font-semibold hover:underline">
            AI Studio page
          </a>
          and follow the instructions to obtain your API key.
        </p>
        <div class="flex items-center gap-2 w-full border border-base rounded bg-transparent shadow-sm ">
          <span class="i-carbon-api-key icon-button mx-2 p-1 px-2 text-lg text-gray-500" />

          <input v-model="apikey" type="password" placeholder="Place the Gemini API Key here"
            class="text-base outline-none w-full  py-1 m-0 ">
        </div>
      </div>
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
            <button icon-button :class="isExcludedCategory(c.name) ? 'i-carbon:view-off text-red' : 'i-carbon:view'"
              title="Toggle Visible" @click="toggleExcludedCategory(c.name)" />
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
