<script setup lang='ts'>
withDefaults(defineProps<{
  value?: boolean
  direction?: string
}>(), {
  value: false,
  direction: 'bottom',
})
</script>

<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 z-60"
    :class="value ? '': 'pointer-events-none'"
  >
    <div
      class="
        bg-white bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-500 ease-out
        dark:bg-dark-100
      "
      :class="value ? 'opacity-85': 'opacity-0'"
      @click="$emit('close')"
    />
    <div
      class="
        bg-white absolute transition-all duration-200 ease-out shadow rounded-md transform border
        dark:bg-dark-100 dark:border-dark-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
      "
      :class="value ? 'opacity-100': 'opacity-0'"
    >
      <slot />
    </div>
  </div>
</template>
