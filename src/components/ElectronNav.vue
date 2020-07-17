<template>
  <div class="electron-nav dragging md:border-b border-gray-200 flex-none flex justify-start">
    <div class="mac-controls flex-none" />
    <IconButton
      v-show="$route.path !== '/'"
      class="text-lg mx-1 px-3 flex-none"
      icon="carbon:chevron-left"
      @click="$router.replace('/')"
    />
    <div class="inline-block text-sm text-gray-800 my-auto ml-3 font-light"><b class="font-bold">Iconify</b>Explorer</div>
    <div class="flex-auto"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style>
.electron-nav {
  height: 37px
}

.mac-controls {
  width: 70px;
}

.electron-nav .icon-button svg {
  margin-top: -2px;
}
</style>