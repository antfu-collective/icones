<template>
  <IconButton
    :icon="isDark ? 'carbon:moon' : 'carbon:sun'"
    style="padding-bottom: 3px"
    @click="isDark = !isDark"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isDark } from '../store'

export default defineComponent(() => ({ isDark }))
</script>
