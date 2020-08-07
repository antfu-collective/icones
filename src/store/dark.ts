import { watch } from 'vue'
import { useStorage, usePreferredDark } from '@vueuse/core'

export const isDark = useStorage('icones-dark', usePreferredDark().value)

watch(
  isDark,
  (v) => {
    const html = document.getElementsByTagName('html')[0]
    html.classList.toggle('mode-dark', v)
  },
  { immediate: true },
)
