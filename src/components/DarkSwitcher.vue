<script setup lang="ts">
import { canToggleDark } from '../store'
import { toggleDark } from '../utils/dark'
</script>

<template>
  <button
    v-if="canToggleDark"
    type="button"
    icon-button
    title="Toggle dark mode"
    aria-label="Toggle dark mode"
    dark:i-carbon-moon i-carbon:sun
    @click="toggleDark"
  />
</template>
