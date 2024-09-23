<script setup lang="ts">
import { isSearchOpen } from '../../data'
import { isElectron } from '../../env'
import { getSearchResults } from '../../store'

const { search, collection } = getSearchResults()
const input = ref<HTMLInputElement | null>(null)

watch(isSearchOpen, (v) => {
  if (input.value) {
    if (v) {
      input.value.focus()
    }
    else {
      input.value.blur()
      search.value = ''
    }
  }
})
</script>

<template>
  <Notification v-if="isElectron" class="text-right md:hidden" :value="isSearchOpen">
    <div v-if="collection" class="flex text-base">
      <Icon icon="carbon:search" class="m-auto flex-none opacity-60" />
      <input
        ref="input"
        v-model="search"
        class="text-base outline-none py-1 px-4 flex-auto m-0 bg-transparent"
        placeholder="Search..."
        @keydown.esc="isSearchOpen = false"
      >
      <Icon icon="carbon:close" class="m-auto text-lg -mr-1 opacity-60" @click="isSearchOpen = false" />
    </div>
  </Notification>
</template>
