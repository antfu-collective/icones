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
span.iconify {
  background: #5551;
  border-radius: 100%;
  min-width: 1em;
  min-height: 1em;
  display: block;
}
</style>
