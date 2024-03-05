const { fadeAnimation, fadeKeyframes } = require('./src/ui/animations/fade')

module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
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
  plugins: [require('daisyui')],
  daisyui: {
    themes: [require('./src/ui/config/daisy.js')],
  },
}
