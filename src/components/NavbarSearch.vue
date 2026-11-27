<script setup lang="ts">
// The search of an icon set in the navigation bar on small screens, for the `search` outlet of `navbarView`
import { getSearchResults } from '../store'

const { search } = getSearchResults()
</script>

<template>
  <SearchBar
    v-model:search="search"
    class="flex items-center w-full rounded-lg bg-gray-400/10 text-base"
    :style="false"
    :icon="false"
    help
  />
</template>
