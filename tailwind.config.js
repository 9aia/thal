const { fadeAnimation, fadeKeyframes } = require("./layers/ui/animations/fade")

module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
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
  plugins: [require("daisyui")],
  daisyui: {
    themes: [require("./layers/ui/config/daisy.js")],
  },
}
