<script setup lang="ts">
import { View } from '@sekiso/vue'
import { themeOrder } from '../sekiso/app'
import { navbarView } from '../sekiso/views/navbar'
import { canToggleDark, isDark, themeName } from '../store'
import { toggleDark } from '../utils/dark'

const route = useRoute()
const router = useRouter()

const options = computed(() => ({
  home: route.path === '/',
  collection: route.path.startsWith('/collection'),
  dark: isDark.value,
  canToggleDark: canToggleDark.value,
  theme: themeName.value,
  themes: themeOrder,
  navigate: (to: string) => router.push(to),
  toggleDark,
  setTheme: (name: string) => themeName.value = name,
}))
</script>

<template>
  <View :of="navbarView" :options="options" />
</template>
