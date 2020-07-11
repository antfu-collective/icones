<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 transition-transform duration-500 text-center"
    :class="value ? '': 'opacity-0 pointer-events-none'"
    :style="value ? {}: {transform: 'translateY(-150%)'}"
  >
    <div
      class="shadow-xl px-4 py-1 rounded bg-white inline-block m-2"
    >
      <slot />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      defualt: false
    }
  }
})
</script>