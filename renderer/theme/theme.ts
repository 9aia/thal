import { Cookies } from "../utils/cookies";
import { ColorScheme, Theme, ThemeConfig } from "./types";

export function setClientTheme(theme: Theme) {
  const classList = document.documentElement?.classList;
  classList.value = theme === "dark" ? "dark" : "";

  Cookies.set("theme", theme);
}

export function toggleClientTheme() {
  const theme = (Cookies.get("theme") as Theme) || "light";
  const newTheme = theme === "dark" ? "light" : "dark";

  setClientTheme(newTheme);
}

export const DEFAULT_COLOR_SCHEME = "light dark";

export function parseColorScheme(colorScheme: ColorScheme): ThemeConfig {
  const [primary, secondary] = colorScheme.split(" ") as [Theme, Theme?];
  return { primary, secondary };
}
