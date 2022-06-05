<script setup lang="ts">
const buildTime = __BUILD_TIME__
</script>

<template>
  <footer class="text-center text-sm pt-8 pb-6">
    <p class="text-gray-500">
      built by
      <a
        class="opacity-75 hover:opacity-100"
        href="https://github.com/antfu"
        target="_blank"
      >@antfu</a>,
      powered by
      <a
        class="opacity-75 hover:opacity-100"
        href="https://iconify.design"
        target="_blank"
      >Iconify</a>
    </p>
    <a
      class="text-gray-500 font-light hover:opacity-100"
      href="https://github.com/antfu/icones"
      target="_blank"
    >
      <Icon icon="carbon:code" class="inline-block text-lg align-middle" />
      Source Code
    </a>
    <div class="text-gray-500 mt-1 font-light opacity-75 hover:opacity-100 italic">
      Last update: {{ buildTime }}
    </div>
  </footer>
</template>
