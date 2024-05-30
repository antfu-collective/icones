<script setup lang='ts'>
import { useThemeColor } from './hooks'

const { style } = useThemeColor()
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-base" :style="style">
    <div class="h-full flex-auto overflow-overlay">
      <RouterView />
    </div>
    <Progress />
  </div>
</template>
