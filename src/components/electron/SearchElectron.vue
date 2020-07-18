<template>
  <Notification v-if="isElectron" class="text-right" :value="isSearchOpen">
    <div v-if="collection" class="flex text-gray-500">
      <Icon icon="carbon:search" class="m-auto flex-none opacity-60" />
      <input
        ref="input"
        v-model="search"
        class="text-base outline-none py-1 px-4 flex-auto m-0"
        :placeholder="`Search...`"
        @keydown.esc="isSearchOpen = false"
      >
      <Icon icon="carbon:close" class="m-auto text-lg -mr-1 opacity-60" @click="isSearchOpen = false" />
    </div>
  </Notification>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { getSearchResults, isSearchOpen } from '../../store'
import { isElectron } from '../../env'

export default defineComponent({
  setup() {
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

    return {
      search,
      collection,
      isElectron,
      isSearchOpen,
      input,
    }
  },
})
</script>
