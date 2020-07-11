<template>
  <nav class="shadow p-4 fixed top-0 left-0 right-0 bg-white z-10 dark:bg-black flex">
    <div class="absolute top-0 left-0 bottom-0 flex">
      <IconButton
        v-show="$route.path !== '/'"
        class="text-xl mr-2 my-auto p-4"
        icon="mdi:arrow-left"
        @click="$router.replace('/')"
      />
    </div>
    <h1 class="text-lg font-light px-1 m-auto">
      &lt;<Icon icon="mdi:emoticon-happy-outline" class="inline-block" />>
      <b class="font-bold">Iconify</b>Explorer
    </h1>
  </nav>
  <div class="py-8" />
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Icon from './Icon.vue'
import IconButton from './IconButton.vue'

export default defineComponent({
  components: {
    Icon,
    IconButton
  }
})
</script>