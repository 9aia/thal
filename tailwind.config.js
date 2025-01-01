const { fadeAnimation, fadeKeyframes } = require('./layers/ui/animations/fade')

module.exports = {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        ...fadeAnimation,
      },
      keyframes: {
        ...fadeKeyframes,
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: [require('./layers/ui/config/daisy.js')],
  },
}
