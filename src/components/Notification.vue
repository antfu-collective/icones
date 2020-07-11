<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 text-center overflow-hidden"
    :class="value ? '': 'pointer-events-none'"
  >
    <div
      class="shadow-xl px-4 py-1 rounded bg-white inline-block m-2 transition-transform duration-500"
      :style="value ? {}: {transform: 'translateY(-150%)'}"
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
      defualt: false,
    },
  },
})
</script>
