<template>
  <nav class="shadow p-4 fixed top-0 left-0 right-0 bg-white z-10 dark:bg-black">
    <h1 class="text-base font-light px-1">
      &lt;<Icon icon="mdi:emoticon-happy-outline" class="inline-block" />>
      <b class="font-bold">Iconify</b>Explorer
    </h1>
  </nav>
  <div class="py-6"/>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
  components: {
    Icon
  }
})
</script>