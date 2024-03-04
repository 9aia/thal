const { fadeAnimation, fadeKeyframes } = require('./lib/daisy/animations/fade')

module.exports = {
  content: [
    './lib/**/*.{vue,js,ts,jsx,tsx}',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
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
    themes: [require('./lib/daisy/styles/daisy.js')],
  },
}
