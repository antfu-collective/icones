<script setup lang="ts">
import { isDark } from '../store'
</script>

<template>
  <button
    icon-button
    dark:i-carbon-moon i-carbon:sun
    @click="isDark = !isDark"
  />
</template>
