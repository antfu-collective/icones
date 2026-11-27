/** The default theme, and the one a missing or unknown name falls back to. */
export const DEFAULT_THEME = 'original'

/**
 * The name of the active Sekiso theme, a folder in `src/sekiso/themes`.
 * The `?theme=` query param of any page sets it, so a link can share a theme.
 */
export const themeName = useStorage('icones-theme', DEFAULT_THEME)
