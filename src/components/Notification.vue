<script setup lang='ts'>
withDefaults(
  defineProps<{ value?: boolean }>(),
  { value: false },
)
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 text-center"
    :class="value ? '' : 'pointer-events-none overflow-hidden'"
  >
    <div
      class="
        px-3 py-1 rounded inline-block m-3 transition-all duration-300 text-primary
        bg-base border border-base
        flex flex-inline items-center
      "
      :style="value ? {} : { transform: 'translateY(-150%)' }"
      :class="value ? 'shadow' : 'shadow-none'"
    >
      <slot />
    </div>
  </div>
</template>
