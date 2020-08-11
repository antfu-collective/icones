<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 text-center"
    :class="value ? '': 'pointer-events-none overflow-hidden'"
  >
    <div
      v-wind
      class="
        px-4 py-1 rounded bg-white inline-block m-3 transition-all duration-300 text-primary border
        dark:{bg-dark-100 border-dark-300}
      "
      :style="value ? {}: {transform: 'translateY(-150%)'}"
      :class="value ? 'shadow': 'shadow-none'"
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
