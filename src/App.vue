<script setup lang='ts'>
import { themeColor } from './store'

const style = computed<any>(() => ({
  '--theme-color': themeColor.value,
}))
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg" :style="style">
    <div class="h-full flex-auto overflow-overlay">
      <RouterView />
    </div>
    <Progress />
  </div>
</template>
