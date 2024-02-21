export type Theme = 'dark' | 'light'

export type ColorScheme = 'light dark' | 'dark light' | 'light' | 'dark'

export interface ThemeContext {
  colorScheme: ColorScheme
}

export interface ThemeConfig {
  primary: Theme
  secondary?: Theme
}
