const thal = {
  'primary': '#00ffff',
  'secondary': '#0F172A',
  'accent': '#0000ff',
  'neutral': '#ffffff',
  'base-100': '#F5F5F5',
  'info': '#0000ff',
  'success': '#00ff00',
  'warning': '#ff6600',
  'error': '#ff0000',
}

const fadeAnimation = {
  fade: 'fade 1s ease-in-out',
}

const fadeKeyframes = {
  fade: {
    '0%': {
      opacity: '1',
    },
    '100%': {
      opacity: '0',
    },
  },
}

module.exports = { fadeAnimation, fadeKeyframes, thal }
