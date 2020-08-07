<template>
  <nav
    class="
      dragging p-2 relative bg-white z-10 flex border-b border-gray-200 flex-none
      dark:bg-dark-100 dark:border-dark-200 dark:text-gray-200
    "
    :class="$route.path !== '/' ? 'md:hidden' : ''"
  >
    <!-- In Collections -->
    <template v-if="$route.path !== '/'">
      <IconButton
        class="non-dragging text-xl mx-3 my-auto flex-none"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
    </template>

    <!-- Homepage Only -->
    <template v-else>
      <div class="mx-3 mr-4 my-auto flex-none">
        <select v-model="categoryFilter" class="opacity-50 bg-transparent font-normal w-auto outline-none focus:outline-none">
          <option :value="null">All</option>
          <option v-for="category of categories" :key="category" :value="category">
            {{ category.split('/')[0].trim() }}
          </option>
        </select>
      </div>
      <h1 class="text-xl py-1 m-auto flex-auto text-center font-light" style="letter-spacing: 2px">
        Icônes
      </h1>
      <router-link
        class="non-dragging text-xl mx-3 my-auto flex-none"
        to="/collection/all"
      >
        <IconButton icon="carbon:search" style="padding-bottom: 3px" />
      </router-link>
      <a
        class="non-dragging text-xl mx-3 my-auto flex-none"
        href="https://github.com/antfu/icones"
        target="_blank"
      >
        <IconButton icon="codicon:github" style="padding-bottom: 3px" />
      </a>
      <div
        class="non-dragging text-xl mx-3 my-auto flex-none"
      >
        <DarkSwitcher />
      </div>
    </template>

    <!-- Searching -->
    <div v-if="collection" class="flex">
      <input
        v-model="search"
        class="text-base outline-none py-2 px-4 flex-auto m-0 w-full"
        placeholder="Search..."
      >
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSearchResults, isDark } from '../store'
import { categories, categoryFilter } from '../data'

export default defineComponent(() => ({
  ...getSearchResults(),
  isDark,
  categories,
  categoryFilter,
}))
</script>
