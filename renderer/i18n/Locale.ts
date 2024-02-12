import { ILocale } from "./types.d";

class Locale {
  static stringify(locale: ILocale) {
    let str = locale.lang;

    if (locale.region) str += "-" + locale.region;

    return str;
  }

  static parse(lang: string): ILocale {
    const parsed = lang.split("-");

    return {
      lang: parsed[0],
      region: parsed[1],
    };
  }
}

export default Locale;
