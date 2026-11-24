<script setup lang="ts">
defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Change color',
  },
})

const emit = defineEmits(['update:value'])
</script>

<template>
  <div class="relative">
    <div>
      <slot />
    </div>
    <input
      class="absolute top-0 bottom-0 left-0 right-0 opacity-0 w-full h-full cursor-pointer"
      :value="value"
      :aria-label="label"
      type="color"
      @input="e => emit('update:value', (e.target as any).value)"
    >
  </div>
</template>
