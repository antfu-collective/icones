<script setup lang="ts">
import { View } from '@sekiso/vue'
import { navbarView } from '../sekiso/views/navbar'
import { canToggleDark, isDark } from '../store'
import { toggleDark } from '../utils/dark'

const route = useRoute()

const options = computed(() => ({
  home: route.path === '/',
  collection: route.path.startsWith('/collection'),
  dark: isDark.value,
  canToggleDark: canToggleDark.value,
  toggleDark,
}))
</script>

<template>
  <View :of="navbarView" :options="options" />
</template>
