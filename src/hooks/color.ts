import { themeColor } from '../store'

export function useThemeColor() {
  const style = computed<any>(() => ({
    '--theme-color': themeColor.value,
  }))

  return {
    style,
  }
}
