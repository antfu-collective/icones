<script setup lang="ts">
import { isTauri } from '../env'
</script>

<template>
  <div v-if="isTauri" class="flex-none" style="height: 27px;">
    <slot />
  </div>
</template>
