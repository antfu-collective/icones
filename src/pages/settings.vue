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
      <div px4>
        <h1 text-xl>
          Features
        </h1>
        <div class="flex items-center gap-2 w-full border border-base rounded bg-transparent shadow-sm ">
          <span class="p-1 px-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="m10 7l-.516 1.394c-.676 1.828-1.014 2.742-1.681 3.409s-1.581 1.005-3.409 1.681L3 14l1.394.516c1.828.676 2.742 1.015 3.409 1.681s1.005 1.581 1.681 3.409L10 21l.516-1.394c.676-1.828 1.015-2.742 1.681-3.409s1.581-1.005 3.409-1.681L17 14l-1.394-.516c-1.828-.676-2.742-1.014-3.409-1.681s-1.005-1.581-1.681-3.409zm8-4l-.221.597c-.29.784-.435 1.176-.72 1.461c-.286.286-.678.431-1.462.72L15 6l.598.221c.783.29 1.175.435 1.46.72c.286.286.431.678.72 1.462L18 9l.221-.597c.29-.784.435-1.176.72-1.461c.286-.286.678-.431 1.462-.72L21 6l-.598-.221c-.783-.29-1.175-.435-1.46-.72c-.286-.286-.431-.678-.72-1.462z"
              />
            </svg>
          </span>
          <input
            v-model="apikey"
            type="text" placeholder="AI prompt, icon name, or keywords"
            class="text-base outline-none w-full  py-1 m-0 "
          >
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
            <button
              icon-button :class="isExcludedCategory(c.name) ? 'i-carbon:view-off text-red' : 'i-carbon:view'"
              title="Toggle Visible" @click="toggleExcludedCategory(c.name)"
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
