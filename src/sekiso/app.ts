import type { App } from '@sekiso/core/app'
import type { Theme } from '@sekiso/core/theme'
import { createApp } from '@sekiso/core/app'
import { createI18n } from '@sekiso/core/i18n'
import en from './locales/en.json'

/** Every theme by its folder name in `themes/`, so a new theme needs no edit here. */
export const themes: Readonly<Record<string, Theme>> = Object.fromEntries(
  Object.entries(import.meta.glob<Theme>('./themes/*/index.ts', { eager: true, import: 'default' }))
    .map(([path, theme]) => [path.split('/')[2]!, theme]),
)

/** The themes in the order the theme pickers list them. */
export const themeOrder = ['original', 'washi', 'geist'].filter(name => name in themes)

export function resolveTheme(name: string | null | undefined): Theme {
  return themes[name ?? ''] ?? themes.original!
}

/** The composition root: it puts the theme, the i18n engine and the ports every screen shares together. */
export function createIconesApp(themeName: string, navigate: (to: string) => void): App {
  return createApp({
    theme: resolveTheme(themeName),
    i18n: createI18n({ locale: 'en', messages: en }),
    ports: { navigate },
  })
}
