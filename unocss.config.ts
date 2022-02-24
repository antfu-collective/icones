import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  theme: {
    colors: {
      primary: 'var(--theme-color)',
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
