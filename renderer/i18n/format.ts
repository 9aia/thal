import { PluralRule } from "./types";

export const DEFAULT_PLURAL_RULE: PluralRule = (plurals, count) => {
  return count === 1 ? 0 : plurals.length - 1;
};

export const format = (
  text: string,
  values: Partial<Record<string, string | number>> = {},
  pluralRule = DEFAULT_PLURAL_RULE
) => {
  // escaping
  const PIPE = "\\p";
  text = text.replaceAll("\\|", PIPE);

  console.log(text);

  Object.keys(values).forEach((key) => {
    const value = values[key];

    const pluralPattern = new RegExp(`{${key}}\\s\\(([^}|]+(\\|[^}|]+)*)\\)`, "g");
    
    // pluralization
    text = text.replace(pluralPattern, (match, plurals) => {
      const pluralForms = plurals.split("|");

      if (typeof value !== "number") {
        return match;
      }

      const i = pluralRule(pluralForms, value);
      
      if(i > pluralForms.length) {
        return match;
      }

      const pluralForm = pluralForms[i];

      return `${value} ${pluralForm}`;
    });

    // vars alone
    text = text.replaceAll(`{${key}}`, String(value));
  });

  // escaping
  text = text
    .replaceAll("\\{", "{")
    .replaceAll("\\}", "}")
    .replaceAll(PIPE, "|")
    .replaceAll("\\b", "\\");

  return text;
};
