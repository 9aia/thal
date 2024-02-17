export type Theme = "dark" | "light";

export type ColorScheme = "light dark" | "dark light" | "light" | "dark";

export type ThemeContext = {
  colorScheme: ColorScheme;
};

export type ThemeConfig = {
  primary: Theme;
  secondary?: Theme;
};
