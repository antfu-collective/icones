<script setup lang="ts">
const header = ref<HTMLElement>()
const { height } = useElementSize(header, undefined, { box: 'border-box' })
</script>

<template>
  <div
    class="flex min-h-screen md:h-screen flex-col md:overflow-hidden"
    :style="{ '--header-height': `${height}px` }"
  >
    <!-- On mobile the document scrolls, so the header sticks to the top -->
    <div ref="header" class="flex-none max-md:sticky top-0 z-10 bg-base">
      <Navbar />
      <slot name="header" />
    </div>
    <div class="flex-auto flex flex-col md:of-hidden">
      <slot />
    </div>
  </div>
</template>
