import { defineConfig, presetAttributify, presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: {
    // The colors come from the tokens of the active Sekiso theme, see `src/sekiso/schema.ts`
    'border-base': 'border-[var(--k-line)]',
    'border-dark-only': 'border-transparent dark:border-[var(--k-line)]',
    'bg-base': 'bg-[var(--k-surface)]',
    'color-base': 'text-[var(--k-fg)]',
    'color-fade': 'text-[var(--k-muted)]',
    'icon-button': 'op50 hover:op100 my-auto shrink-0',
  },
  presets: [
    presetWind3(),
    presetIcons(),
    presetAttributify(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  theme: {
    colors: {
      primary: 'var(--k-accent)',
      dark: {
        100: '#222',
        200: '#333',
        300: '#444',
        400: '#555',
        500: '#666',
        600: '#777',
        700: '#888',
        800: '#999',
        900: '#aaa',
      },
    },
  },
})
