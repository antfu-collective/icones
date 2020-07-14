/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    content: [
      './index.html',
      './src/**/*.vue',
      './src/**/*.js',
      './src/**/*.ts',
    ],
    options: {
      whitelist: [
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
        'text-6xl',
        'text-7xl',
        'text-8xl',
      ],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
      },
      opacity: {
        60: '0.6',
      },
      colors: {
        primary: 'var(--theme-color)',
      },
    },
  },
}
