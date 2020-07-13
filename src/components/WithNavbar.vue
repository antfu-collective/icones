<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <Navbar :class="navClass" />
    <div class="flex-auto overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    navClass: {
      type: String,
      default: '',
    },
  },
})
</script>
