import Locale from "./Locale";
import { i18nConfig } from "./config";

function detectLocale(acceptLanguageHeader: string) {
  const preferredLanguages = acceptLanguageHeader.split(",").map((lang) => {
    const [language, priority = "q=1.0"] = lang.trim().split(";");
    return { lang: language, priority: parseFloat(priority.split("=")[1]) };
  });

  preferredLanguages.sort((a, b) => b.priority - a.priority);

  let lang;

  for (const preferred of preferredLanguages) {
    if (i18nConfig.locales?.includes(preferred.lang)) {
      lang = preferred.lang;
      break;
    }
  }

  if (!lang) {
    return undefined;
  }

  return Locale.parse(lang);
}

export default detectLocale;
