const { fadeAnimation, fadeKeyframes, thal } = require('./app/daisy.config.js')

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
      colors: {
        cyan: {
          50: '#E0FFFF', // Lightest cyan
          100: '#B3FFFF',
          200: '#80FFFF',
          300: '#4DFFFF',
          400: '#1AFFFF',
          500: '#00FFFF', // Base cyan
          600: '#00CCCC',
          700: '#009999',
          800: '#006666',
          900: '#003333', // Dark cyan
          950: '#001919', // Very dark cyan
        },
        green: {
          50: '#E0FFE0', // Lightest green
          100: '#B3FFB3',
          200: '#80FF80',
          300: '#4DFF4D',
          400: '#1AFF1A',
          500: '#00FF00', // Base green
          600: '#00CC00',
          700: '#009900',
          800: '#006600',
          900: '#003300', // Dark green
          950: '#001900', // Very dark green
        },
        red: {
          50: '#FFCCCC', // Lightest red
          100: '#FF9999',
          200: '#FF6666',
          300: '#FF3333',
          400: '#FF0000',
          500: '#FF0000', // Base red
          600: '#CC0000',
          700: '#990000',
          800: '#660000',
          900: '#330000', // Dark red
          950: '#1A0000', // Very dark red
        },
        blue: {
          50: '#CCCCFF', // Lightest blue
          100: '#9999FF',
          200: '#6666FF',
          300: '#3333FF',
          400: '#0000FF', // Base blue
          500: '#0000FF', // Base blue
          600: '#0000CC',
          700: '#000099',
          800: '#000066',
          900: '#000033', // Dark blue
          950: '#00001A', // Very dark blue
        },
        yellow: {
          50: '#FFFFCC', // Lightest yellow
          100: '#FFFF99',
          200: '#FFFF66',
          300: '#FFFF33',
          400: '#FFFF00', // Base yellow
          500: '#FFFF00', // Base yellow
          600: '#CCCC00',
          700: '#999900',
          800: '#666600',
          900: '#333300', // Dark yellow
          950: '#1A1A00', // Very dark yellow
        },
        magenta: {
          50: '#F4CCFF', // Lightest magenta
          100: '#F099FF',
          200: '#F066FF',
          300: '#F033FF',
          400: '#FF00FF', // Base magenta
          500: '#FF00FF', // Base magenta
          600: '#CC00CC',
          700: '#990099',
          800: '#660066',
          900: '#330033', // Dark magenta
          950: '#1A001A', // Very dark magenta
        },
        brown: {
          50: '#E6D6B3', // Lightest brown
          100: '#D2B28C',
          200: '#B99B66',
          300: '#9F8040',
          400: '#865D1A',
          500: '#6D3A00', // Base brown
          600: '#5A3300',
          700: '#472600',
          800: '#331A00',
          900: '#1F0D00', // Dark brown
          950: '#0F0500', // Very dark brown
        },
        gray: {
          50: '#F5F5F5', // Very light gray
          100: '#E0E0E0',
          200: '#B3B3B3',
          300: '#808080',
          400: '#4D4D4D',
          500: '#333333', // Base gray
          600: '#1A1A1A',
          700: '#0D0D0D',
          800: '#0A0A0A',
          900: '#000000', // Black
          950: '#000000', // Very dark gray (same as black)
        },
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: [{ thal }],
  },
}
