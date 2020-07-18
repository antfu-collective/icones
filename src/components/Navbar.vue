<template>
  <nav class="dragging p-2 relative bg-white z-10 dark:bg-black flex border-b border-gray-200">
    <!-- In Collections -->
    <template v-if="$route.path !== '/'">
      <IconButton
        class="non-dragging text-xl mx-3 my-auto flex-none"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
      <div class="flex-auto" />
    </template>

    <!-- Homepage Only -->
    <template v-else>
      <div
        class="opacity-0 text-xl mx-3 mr-4 my-auto flex-none"
      >
        <IconButton icon="carbon:logo-github" />
      </div>
      <h1 class="text-base font-light py-2 m-auto flex-auto text-center">
        <a href="https://iconify.design" target="_blank" class="font-bold">Iconify</a>Explorer
      </h1>
      <a
        class="non-dragging text-xl mx-3 mr-4 my-auto flex-none"
        href="https://github.com/antfu/iconify-explorer"
        target="_blank"
      >
        <IconButton icon="carbon:logo-github" />
      </a>
    </template>

    <!-- Searching -->
    <div v-if="collection" class="flex">
      <Icon icon="carbon:search" class="m-auto opacity-60" />
      <input
        v-model="search"
        class="text-base outline-none py-2 px-4 flex-auto m-0"
        :placeholder="`Search...`"
      >
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSearchResults } from '../store'

export default defineComponent(() => getSearchResults())
</script>
