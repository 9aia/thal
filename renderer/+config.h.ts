import type { Config, ConfigEffect, ConfigEnv, PageContext } from "vike/types";
import type { Component } from "./types";
import { Plugin } from "vue";

const toggleSsrRelatedConfig: ConfigEffect = ({
  configDefinedAt,
  configValue,
}) => {
  if (typeof configValue !== "boolean") {
    throw new Error(`${configDefinedAt} should be a boolean`);
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by then making the `Page` implementation
      // accessible only in the client's renderer.
      Page: {
        env: configValue
          ? { server: true, client: true } // default
          : { client: true },
      },
    },
  };
};

const beforeRenderModeEffect: ConfigEffect = ({
  configDefinedAt,
  configValue,
}) => {
  type ConfigValue = "server-only" | "client-only" | "server-and-client";
  const values: Array<ConfigValue> = [
    "server-only",
    "client-only",
    "server-and-client",
  ];

  if (!values.includes(configValue as ConfigValue) && configValue) {
    throw new Error(
      `${configDefinedAt} should be 'server-only', 'client-only', or 'server-and-client'`
    );
  }

  let env: ConfigEnv | undefined;

  if (configValue == "server-only")
    env = {
      server: true,
      client: false,
    };
  if (configValue == "client-only")
    env = {
      client: true,
      server: false,
    };
  if (configValue == "server-and-client")
    env = {
      client: true,
      server: true,
    };

  return {
    meta: {
      onBeforeRender: {
        env: env || { server: true, client: true },
      },
    },
  };
};

export default {
  onRenderHtml: "import:./vike-hooks/onRenderHtml:onRenderHtml",
  onRenderClient: "import:./vike-hooks/onRenderClient:onRenderClient",
  onHydrationEnd: "import:./vike-hooks/onHydrationEnd:onHydrationEnd",
  onPageTransitionStart: "import:./vike-hooks/onPageTransition:onPageTransitionStart",
  onPageTransitionEnd: "import:./vike-hooks/onPageTransition:onPageTransitionEnd",

  prefetchStaticAssets: "viewport",

  passToClient: ["title", "routeParams"],

  clientRouting: true,
  hydrationCanBeAborted: true,
  meta: {
    Head: {
      env: { server: true },
    },
    Layout: {
      env: { server: true, client: true },
    },
    Wrapper: {
      env: { server: true, client: true },
    },
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    favicon: {
      env: { server: true },
    },
    lang: {
      env: { server: true },
    },
    ssr: {
      env: { config: true },
      effect: toggleSsrRelatedConfig,
    },
    stream: {
      env: { server: true },
    },
    vuePlugins: {
      env: { server: true, client: true },
    },
    beforeRenderMode: {
      env: { config: true },
      effect: beforeRenderModeEffect,
    },
  },
} satisfies Config;

type VuePluginWithOptions = {
  plugin: Plugin;
  options?: any;
};

declare global {
  namespace VikePackages {
    interface ConfigVikeVue {
      /** Vue component rendered and appended into &lt;head>&lt;/head> */
      Head?: Component;

      Layout?: Component;

      Wrapper?: Component;

      /** &lt;title>${title}&lt;/title> */
      title?: string | ((pageContext: PageContext) => string);

      /** &lt;meta name="description" content="${description}" /> */
      description?: string;

      /** &lt;link rel="icon" href="${favicon}" /> */
      favicon?: string;

      /** &lt;html lang="${lang}">
       *
       *  @default 'en'
       *
       */
      lang?: string;

      /**
       * If true, render mode is SSR or pre-rendering (aka SSG). In other words, the
       * page's HTML will be rendered at build-time or request-time.
       * If false, render mode is SPA. In other words, the page will only be
       * rendered in the browser.
       *
       * See https://vike.dev/render-modes
       *
       * @default true
       *
       */
      ssr?: boolean;
      /**
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       *
       * @default false
       *
       */
      stream?: boolean;

      /**
       * List of Vue plugins (and their respective options) to be installed with
       * `app.vue(plugin, options)`.
       *
       * See https://vuejs.org/guide/reusability/plugins.html
       *
       * @default []
       *
       */
      vuePlugins?: VuePluginWithOptions[];

      /** The page's root Vue component */
      Page?: Component;
    }
  }
}

// This is a workaround for
// * https://github.com/vuejs/core/issues/8303
// * https://github.com/esbuild-kit/tsx/issues/113
const globalName = (target: Object, value: string) =>
  Object.defineProperty(target, "name", {
    value,
    configurable: true,
  });
declare global {
  var __name: typeof globalName;
}
globalThis.__name = globalName;
