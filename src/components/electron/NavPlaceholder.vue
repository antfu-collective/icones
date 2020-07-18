<template>
  <div v-if="isElectron" class="flex-none" style="height: 27px;" />
</template>

<script setup lang="ts">
export { isElectron } from '../../env'
</script>
