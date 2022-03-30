<script setup lang='ts'>
import { isElectron } from '../env'
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <Navbar v-if="!isElectron" />
    <NavElectron v-if="isElectron" />
    <div class="flex-auto overflow-overlay">
      <slot />
    </div>
  </div>
</template>
