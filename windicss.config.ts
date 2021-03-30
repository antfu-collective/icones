import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  theme: {
    extend: {
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
      },
      opacity: {
        10: '0.1',
        60: '0.6',
        85: '0.85',
      },
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
      spacing: {
        '7': '1.75rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
        '256': '64rem',
        '1em': '1em',
      },
    },
  },
  darkMode: 'class',
})
