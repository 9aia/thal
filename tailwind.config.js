const { fadeAnimation, fadeKeyframes } = require('./lib/daisy/animations/fade')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './lib/**/*.{vue,js,ts,jsx,tsx}',
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
  darkMode: 'class',
  plugins: [require('daisyui')],
  daisyui: {
    themes: [require('./lib/daisy/styles/daisy.js')],
  },
}
