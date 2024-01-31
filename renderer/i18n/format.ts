import { FormatCallback, NumberDeclensionRule } from "./types";

export const MESSAGE_PATTERN = /{[^{}]+}\s?(?:\([^)]+\))?|[^{}]+/g;

export const DEFAULT_NUMBER_DECLENSION_RULE: NumberDeclensionRule = (
  forms,
  count
) => {
  return count === 1 ? 0 : forms.length - 1;
};

export const startEscaping = (text: string) => {
  return (text = text
    .replaceAll("\\{", "__CURLY_OPEN")
    .replaceAll("\\}", "__CURLY_CLOSE")
    .replaceAll("\\|", "__PIPE")
    .replaceAll("\\(", "__PARENTHESES_OPEN")
    .replaceAll("\\)", "__PARENTHESES_CLOSE"));
};

export const endEscaping = (text: string) => {
  return (text = text
    .replaceAll("__CURLY_OPEN", "{")
    .replaceAll("__CURLY_CLOSE", "}")
    .replaceAll("__PIPE", "|")
    .replaceAll("__PARENTHESES_OPEN", "(")
    .replaceAll("__PARENTHESES_CLOSE", ")"));
};

export const interpolate = (
  text: string,
  key: string,
  value: string | number
) => {
  return text.replaceAll(`{${key}}`, String(value));
};

export const declineForNumber = (
  text: string,
  formsString: string,
  value: any,
  numberDeclensionRule: NumberDeclensionRule
) => {
  const forms = formsString.split("|");
  const i = numberDeclensionRule(forms, value);

  if (i > forms.length || typeof value !== "number") {
    return { text };
  }

  const form = forms[i];

  text = text.replaceAll(`(${formsString})`, form);
  return { text, form };
};

export const format = <T>(
  text: string,
  values: Partial<Record<string, string | number>> = {},
  callbackFn: FormatCallback<T>,
  initialValue: T,
  options?: { numberDeclensionRule?: NumberDeclensionRule }
) => {
  const numberDeclensionRule =
    options?.numberDeclensionRule || DEFAULT_NUMBER_DECLENSION_RULE;

  text = startEscaping(text);

  return text.match(MESSAGE_PATTERN)?.reduce((prev, part) => {
    const isNamed = part.startsWith("{");

    if (!isNamed) {
      part = endEscaping(part);
      return callbackFn({ prev, part });
    }

    const key = part.substring(1, part.indexOf("}"));
    const value = (values as any)[key];

    if (value === undefined) {
      part = endEscaping(part);
      return callbackFn({ prev, part, key });
    }

    const pluralFormMatch = part.match(/\(([^)]+)\)/);

    let declension: ReturnType<typeof declineForNumber> = { text: part };

    if (pluralFormMatch) {
      const forms = pluralFormMatch[1];
      declension = declineForNumber(part, forms, value, numberDeclensionRule);
    }

    part = interpolate(declension.text, key, value);

    part = endEscaping(part);

    return callbackFn({
      prev,
      part,
      key,
      dynamic: true,
      form: declension.form,
    });
  }, initialValue);
};

export const formatToString = (
  text: string,
  values: Partial<Record<string, string | number>> = {},
  options?: { numberDeclensionRule?: NumberDeclensionRule }
) => {
  const cb: FormatCallback<string> = (options) => {
    return options.prev + options.part;
  };

  return format(text, values, cb, "", options);
};
