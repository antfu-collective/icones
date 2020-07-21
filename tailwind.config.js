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
      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' },
      },
    },
  },
}
