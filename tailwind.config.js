/* eslint-disable @typescript-eslint/no-var-requires */

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
        'schema-dark',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
        'text-6xl',
        'text-7xl',
        'text-8xl',
        'mode-dark',
      ],
    },
  },
  theme: {
    darkSelector: '.schema-dark',
    extend: {
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
      },
      opacity: {
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
        7: '1.75rem',
        72: '18rem',
        84: '21rem',
        96: '24rem',
        128: '32rem',
        256: '64rem',
        '1em': '1em',
      },
    },
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'dark-group-hover', 'hover'],
    borderColor: ['dark', 'dark-disabled', 'dark-focus', 'dark-active', 'active', 'focus', 'disabled'],
    textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'active'],
  },
  plugins: [
    require('tailwindcss-dark-mode')(),
  ],
}
