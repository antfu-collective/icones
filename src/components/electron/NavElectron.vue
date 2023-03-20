<template>
  <div
    class="electron-nav dragging cursor-pointer flex-none flex justify-start items-center fixed top-0 left-0 z-50 border-base bg-base border-r border-b rounded-br opacity-0 hover:opacity-100 transition-all duration-300"
  >
    <div class="mac-controls flex-none" />
    <IconButton
      v-if="$route.path !== '/'" to="/"
      class="text-lg px-2 flex-none ma"
      icon="carbon:chevron-left"
    />
  </div>
</template>

<style>
.electron-nav {
  height: 38px;
}

.mac-controls {
  width: 70px;
}

.electron-nav .icon-button svg {
  margin-top: -2px;
}
</style>
