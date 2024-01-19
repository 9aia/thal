/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./design/**/*.{vue,js,ts,jsx,tsx}",
    "./renderer/**/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [require("./design/styles/daisy.js")],
  },
};
