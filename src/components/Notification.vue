<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 text-center"
    :class="value ? '': 'pointer-events-none overflow-hidden'"
  >
    <div
      class="
        px-4 py-1 rounded bg-white inline-block m-3 transition-all duration-300 text-primary border
        dark:bg-dark-100 dark:border-dark-300
      "
      :style="value ? {}: {transform: 'translateY(-150%)'}"
      :class="value ? 'shadow': 'shadow-none'"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue'

defineProps({
  value: {
    type: Boolean,
    defualt: false,
  },
})
</script>
