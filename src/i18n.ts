import { i18nConfig } from "#framework/i18n";

const translations = {
  "Hello, {user}": {
    pt: "Olá, {user}",
  },
  "Choose your plan": {
    pt: "Escolha seu plano",
  },
  "You have {n} {apple|apples} and {m} {box|boxes}": {
    pt: "Você tem {n} {maçã|maçãs} e {m} {caixa|caixas}" 
  }
} as const;

i18nConfig.locales = ["en", "pt"];
i18nConfig.fallbackLocale = true;
i18nConfig.translations = translations;

declare global {
  namespace I18n {
    type MessageSchema = typeof translations;
  }
}
