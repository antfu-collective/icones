<template>
  <div class="fixed top-0 bottom-0 left-0 right-0 z-40" :class="value ? '': 'pointer-events-none'">
    <div
      class="bg-black bg-opacity-75 bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-500 ease-out"
      :class="value ? '': 'opacity-0'"
      @click="$emit('close')"
    />
    <div
      class="bg-white absolute shadow-2xl transition-all duration-200 ease-out"
      :class="positionClass"
      :style="value ? {}: {transform}"
    >
      <slot />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      defualt: false,
    },
    direction: {
      type: String,
      default: 'bottom',
    },
  },
  setup(props) {
    const positionClass = computed(() => {
      switch (props.direction) {
        case 'bottom':
          return 'bottom-0 left-0 right-0'
        case 'top':
          return 'top-0 left-0 right-0'
        case 'left':
          return 'bottom-0 left-0 top-0'
        case 'right':
          return 'bottom-0 top-0 right-0'
      }
    })

    const transform = computed(() => {
      switch (props.direction) {
        case 'bottom':
          return 'translateY(100%)'
        case 'top':
          return 'translateY(-100%)'
        case 'left':
          return 'translateX(-100%)'
        case 'right':
          return 'translateX(100%)'
      }
    })

    return {
      transform,
      positionClass,
    }
  },
})
</script>
