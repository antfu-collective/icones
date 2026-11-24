<script setup lang='ts'>
import { useThemeColor } from './hooks'

const { style } = useThemeColor()
</script>

<template>
  <!-- On mobile the document scrolls, so iOS scrolls to the top on a status bar tap -->
  <div class="flex flex-col min-h-screen md:h-screen md:overflow-hidden bg-base" :style="style">
    <div class="flex-auto md:h-full md:overflow-overlay">
      <RouterView />
    </div>
    <Progress />
  </div>
</template>
