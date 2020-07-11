const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './index.html',
    './src/**/*.vue',
    './src/**/*.js',
    // etc.
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
