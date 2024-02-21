import { setClientTheme } from './utils'

function listenToPrefersDark() {
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent) => {
      const newTheme = event.matches ? 'dark' : 'light'
      setClientTheme(newTheme)
    }

    prefersDark.addEventListener('change', handleChange)
  }
  catch (e) {
    console.error(e)
  }
}

export default listenToPrefersDark
