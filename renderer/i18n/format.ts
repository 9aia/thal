import { DEFAULT_I18N_CONFIG, i18nConfig } from "./config";
import { FormatCallback, NumberDeclensionRule, VarValue } from "./types";

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

export const formatDate = (
  date: Date,
  datetimeFormat: string,
  options?: Intl.DateTimeFormatOptions
) => {
  return date.toLocaleDateString(datetimeFormat, options);
};

type InterpolateOptions = { datetimeFormat: string };

export const interpolate = (
  text: string,
  key: string,
  value: VarValue,
  options: InterpolateOptions
) => {
  let formattedValue: string;

  const isDataObject = typeof value === "object" && "date" in value;

  if (value instanceof Date) {
    formattedValue = formatDate(value, options?.datetimeFormat);
  } else if (isDataObject) {
    const formatOptions: any = {...value};
    delete formatOptions['date'];

    formattedValue = formatDate(value.date, options?.datetimeFormat, formatOptions)
  } else {
    formattedValue = String(value);
  }

  return text.replaceAll(`{${key}}`, formattedValue);
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

type FormatOptions = {
  numberDeclensionRule?: NumberDeclensionRule;
  datetimeFormat?: string;
};

export const format = <T>(
  text: string,
  values: Partial<Record<string, VarValue>> = {},
  callbackFn: FormatCallback<T>,
  initialValue: T,
  options?: FormatOptions
) => {
  const numberDeclensionRule =
    options?.numberDeclensionRule || DEFAULT_NUMBER_DECLENSION_RULE;
  const datetimeFormat =
    options?.datetimeFormat ||
    i18nConfig.defaultDatetimeFormat ||
    DEFAULT_I18N_CONFIG.defaultDatetimeFormat;

  text = startEscaping(text);

  return (
    text.match(MESSAGE_PATTERN)?.reduce((prev, part) => {
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

      part = interpolate(declension.text, key, value, { datetimeFormat });

      part = endEscaping(part);

      return callbackFn({
        prev,
        part,
        key,
        dynamic: true,
        form: declension.form,
      });
    }, initialValue) || initialValue
  );
};

export const formatToString = (
  text: string,
  values: Partial<Record<string, VarValue>> = {},
  options?: FormatOptions
) => {
  const cb: FormatCallback<string> = (options) => {
    return options.prev + options.part;
  };

  return format(text, values, cb, "", options);
};
