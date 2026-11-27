<script setup lang="ts">
// The large preview of the icon dialog, for the `preview` outlet of `detailView`
defineProps<{ icon: string }>()
</script>

<template>
  <Icon :key="icon" outer-class="icon-preview" :icon="icon" />
</template>

<style>
/* Scale wide icons (like logos) down so the preview fits the screen */
.icon-preview {
  font-size: min(4.5rem, (100vw - 3rem) / var(--icon-ratio, 1));
}
@media (min-width: 768px) {
  .icon-preview {
    font-size: min(6rem, 36vw / var(--icon-ratio, 1));
  }
}
</style>
