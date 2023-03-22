<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <Navbar />
    <div class="flex-auto flex flex-col" :class="route.path !== '/settings' ? 'overflow-overlay' : null">
      <slot />
    </div>
  </div>
</template>
