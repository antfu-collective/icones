import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: {
    'border-base': 'border-hex-888/15',
    'border-dark-only': 'border-transparent dark:border-dark-100',
    'bg-base': 'bg-white dark:bg-[#181818]',
    'color-base': 'text-gray-900 dark:text-gray-300',
    'color-fade': 'text-gray-900:50 dark:text-gray-300:50',
    'icon-button': 'op50 hover:op100 my-auto',
  },
  presets: [
    presetUno(),
    presetIcons(),
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
