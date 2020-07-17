<template>
  <nav class="dragging p-2 relative bg-white z-10 dark:bg-black flex border-b border-gray-200">
      <IconButton
        v-show="$route.path !== '/'"
        class="non-dragging text-xl mx-3 my-auto flex-none"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
    <h1 class="text-base font-light py-2 m-auto flex-auto text-center">
      <span v-if="collection"></span>
      <template v-if="$route.path === '/'">
        <b class="font-bold">Iconify</b>Explorer
      </template>
    </h1>
    <div v-if="collection" class="flex">
      <Icon icon="carbon:search" class="m-auto opacity-60"/>
      <input
        v-model="search"
        class="text-base outline-none py-2 px-4 flex-auto m-0"
        :placeholder="`Search...`"
      />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSearchResults } from '../store'

export default defineComponent(() => getSearchResults())
</script>