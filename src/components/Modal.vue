<template>
  <div class="fixed top-0 bottom-0 left-0 right-0 z-40" :class="value ? '': 'pointer-events-none'">
    <div
      class="bg-black bg-opacity-75 bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-200"
      :class="value ? '': 'opacity-0'"
      @click="$emit('close')"
    />
    <div
      class="bg-white bottom-0 left-0 right-0 p-2 absolute shadow-2xl transition-all duration-300"
      :style="value ? {}: {transform: 'translateY(100%)'}"
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