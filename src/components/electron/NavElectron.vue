<template>
  <div
    class="
      electron-nav dragging flex-none flex justify-start fixed top-0 left-0 z-50 border-gray-200 bg-white border-r border-b rounded-br opacity-0 hover:opacity-100 transition-all duration-300
      dark:bg-dark-100 dark:border-dark-200 dark:text-gray-200
    "
  >
    <div class="mac-controls flex-none" />
    <IconButton
      v-if="$route.path !== '/'"
      class="text-lg px-2 flex-none"
      icon="carbon:chevron-left"
      @click="$router.replace('/')"
    />
    <!-- <div class="inline-block text-sm my-auto ml-1 font-light text-gray-800 dark:text-white" /> -->
    <div class="flex-auto" />
  </div>
</template>

<style>
.electron-nav {
  height: 37px;
}

.mac-controls {
  width: 75px;
}

.electron-nav .icon-button svg {
  margin-top: -2px;
}
</style>
