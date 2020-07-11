const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './index.html',
    './src/**/*.vue',
    './src/**/*.js',
    './src/**/*.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('tailwindcss-dark-mode')()
  ]
}
