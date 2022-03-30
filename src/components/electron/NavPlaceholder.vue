<script setup lang="ts">
import { isElectron } from '../../env'
</script>

<template>
  <div v-if="isElectron" class="flex-none" style="height: 27px;">
    <slot />
  </div>
</template>
