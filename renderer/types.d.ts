import type { Component as _Component } from "vue";
import type { Auth as _Auth } from "#framework/utils/initAuth";
import { Component } from "vue";
import { I18nGlobal } from "./i18n";

type AnyFunction = (...args: any) => any;

export type InferData<T extends AnyFunction> = Awaited<ReturnType<T>>;

// See https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
export type Component = _Component;

export type PageProps = Record<string, unknown>;

declare global {
  namespace Vike {
    interface PageContext {
      // Note: Page will typically be undefined in onRenderHtml() when setting the `ssr` config flag
      // to `false` (SPA mode).
      Page?: Component;

      /** &lt;title>${title}&lt;/title> - has precedence over the config */
      title?: string;
      config: Config;

      routeParams: Record<string, string>;
      i18n: I18nGlobal;
      acceptLanguage: string;

      cookies: string;

      abortReason?:
      | string
      | { notAdmin: true }
    }
    interface Config {
      Wrapper?: Component;
      beforeRenderMode?: "client-only" | "server-only" | "server-and-client";
    }
  }
  namespace Lucia {
    type Auth = _Auth;
    type DatabaseUserAttributes = {
      username: string;
    };
    type DatabaseSessionAttributes = {};
  }
}
