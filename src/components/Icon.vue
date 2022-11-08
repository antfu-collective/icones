<script setup lang="ts">
const { icon } = defineProps({
  icon: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <iconify-icon :icon="icon" :class="$attrs.class" mode="style" />
</template>

<style>
iconify-icon {
  min-width: 1em;
  min-height: 1em;
  display: block;
}
</style>
