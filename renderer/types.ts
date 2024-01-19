import type { defineComponent } from "vue";

type AnyFunction = (...args: any) => any;

export type InferData<T extends AnyFunction> = Awaited<ReturnType<T>>;

// See https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
export type Component = ReturnType<typeof defineComponent>;

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
    }
    interface Config {
      Wrapper?: Component;
      beforeRenderMode?: "client-only" | "server-only" | "server-and-client";
    }
  }
}
