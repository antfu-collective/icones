<template>
  <nav class="p-4 relative bg-white z-10 dark:bg-black flex border-b border-gray-200">
    <div class="absolute top-0 left-0 bottom-0 flex">
      <IconButton
        v-show="$route.path !== '/'"
        class="text-xl mr-2 my-auto p-4"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
    </div>
    <h1 class="text-lg font-light px-1 m-auto">
      &lt;<Icon icon="mdi:emoticon-happy-outline" class="inline-block align-middle" />>
      <b class="font-bold">Iconify</b>Explorer
    </h1>
  </nav>
</template>
