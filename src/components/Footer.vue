<script setup lang="ts">
const buildDate = new Date(__BUILD_TIME__)
const buildTime = useDateFormat(buildDate, 'YYYY/MM/DD HH:mm')
const timeAgo = useTimeAgo(buildDate)
</script>

<template>
  <footer class="text-center text-sm pt-8 pb-6">
    <p class="color-fade">
      built by
      <a
        class="hover:color-base"
        href="https://github.com/antfu"
        target="_blank"
      >@antfu</a>,
      powered by
      <a
        class="hover:color-base"
        href="https://iconify.design"
        target="_blank"
      >Iconify</a>
    </p>
    <div color-fade mt-1 italic>
      Last update: {{ buildTime }} ({{ timeAgo }})
    </div>
  </footer>
</template>
