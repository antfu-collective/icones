/**
 * The color scheme the user picked with the dark switch.
 * It applies to the themes that follow it, see `scheme` in `src/sekiso/schema.ts`.
 */
export const preferDark = useDark({
  storageKey: 'icones-schema',
  // `isDark` below decides the class on `<html>`, from the theme and this choice
  onChanged: () => {},
})

/**
 * The scheme of the active theme: `light dark` when it follows the dark switch.
 * `src/sekiso/app.ts` keeps it current.
 */
export const themeScheme = ref('light dark')

/** Whether the page is dark now, from the active theme and the dark switch. */
export const isDark = computed(() => themeScheme.value === 'light dark'
  ? preferDark.value
  : themeScheme.value === 'dark')

/** Whether the active theme lets the user pick light or dark. */
export const canToggleDark = computed(() => themeScheme.value === 'light dark')

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
