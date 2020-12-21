<template>
  <IconButton
    :icon="isDark ? 'carbon:moon' : 'carbon:sun'"
    style="padding-bottom: 3px"
    @click="isDark = !isDark"
  />
</template>

<script setup lang="ts">
import { isDark } from '../store'
</script>
