<template>
  <nav
    class="dragging p-2 relative bg-white z-10 flex border-b border-gray-200 flex-1-0"
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
      <div
        class="opacity-0 text-xl mx-3 mr-4 my-auto flex-none"
      >
        <IconButton icon="carbon:logo-github" />
      </div>
      <div
        class="opacity-0 text-xl mx-3 mr-4 my-auto flex-none"
      >
        <IconButton icon="carbon:logo-github" />
      </div>
      <h1 class="text-xl py-1 m-auto flex-auto text-center font-light" style="letter-spacing: 2px">
        Icônes
      </h1>
      <router-link
        class="non-dragging text-xl mx-3 mr-4 my-auto flex-none"
        to="/collection/all"
      >
        <IconButton icon="carbon:search" style="padding-bottom: 3px" />
      </router-link>
      <a
        class="non-dragging text-xl mx-3 mr-4 my-auto flex-none"
        href="https://github.com/antfu/icones"
        target="_blank"
      >
        <IconButton icon="carbon:logo-github" style="padding-bottom: 3px" />
      </a>
    </template>

    <!-- Searching -->
    <div v-if="collection" class="flex">
      <input
        v-model="search"
        class="text-base outline-none py-2 px-4 flex-auto m-0 w-full"
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
