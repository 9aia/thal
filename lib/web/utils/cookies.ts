export function parseCookies(cookie: string = "") {
  const cookies: Record<string, string> = {};

  if (cookie) {
    const cookieStrings = cookie.split(";");

    cookieStrings.forEach((cookie) => {
      const [name, value] = cookie.split("=").map((part) => part.trim());
      cookies[name] = value;
    });
  }

  return cookies;
}

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export class Cookies {
  static set(name: string, value: string, options: CookieOptions = {}) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (options.expires) {
      if (typeof options.expires === "number") {
        const expires = new Date();
        expires.setTime(expires.getTime() + options.expires * 1000);
        cookieString += `; expires=${expires.toUTCString()}`;
      } else if (options.expires instanceof Date) {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += "; secure";
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }

  static get(name: string): string | null {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (decodeURIComponent(cookieName) === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  static delete(name: string, options: CookieOptions = {}) {
    if (this.get(name) !== null) {
      this.set(name, "", { ...options, expires: -1 });
    }
  }
}
