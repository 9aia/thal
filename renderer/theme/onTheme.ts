import { PageContext } from "vike/types";
import { parseCookies } from "../utils/cookies";
import { DEFAULT_COLOR_SCHEME, parseColorScheme } from "./theme";

const onTheme = (pageContext: PageContext) => {
  const cookies = parseCookies(pageContext.cookies);
  const cookie = cookies["theme"];

  const { primary, secondary } = parseColorScheme(
    pageContext.config.theme?.colorScheme || DEFAULT_COLOR_SCHEME
  );
  const themeClass = (cookie || primary).replace("light", "");

  const compoundScheme: any = {
    light: "light dark",
    dark: "dark light",
  };
  const colorScheme = secondary
    ? compoundScheme[cookie || primary]
    : cookie || primary;

  return { themeClass, colorScheme };
};

export default onTheme;
