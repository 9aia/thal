import type { I18nGlobal } from '#lib/i18n'
import type { ThemeContext } from '#lib/theme/types'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type { Session } from 'lucia'
import type { Component } from 'vue'
import type { Auth as _Auth, initAuth } from '~/auth/utils/initAuth'

declare global {
  namespace Vike {
    interface PageContext {
      // Note: Page will typically be undefined in onRenderHtml() when setting the `ssr` config flag
      // to `false` (SPA mode).
      Page?: Component

      /** &lt;title>${title}&lt;/title> - has precedence over the config */
      title?: string
      config: Config

      routeParams: Record<string, string>
      i18n: I18nGlobal
      acceptLanguage: string

      cookies: string

      abortReason?: string | { notAdmin: true }
    }
    interface Config {
      Wrapper?: Component
      theme?: ThemeContext
      beforeRenderMode?: 'client-only' | 'server-only' | 'server-and-client'
    }
  }
  namespace Lucia {
    type Auth = _Auth
    type DatabaseUserAttributes = {
      profile_id: number
    }
    // eslint-disable-next-line
    type DatabaseSessionAttributes = {}
  }
  namespace Hono {
    type Bindings = {
      ENVIRONMENT: 'DEV' | 'PROD'
      DB: D1Database
      GOOGLE_CLIENT_SECRET: string
      TURNSTILE_SECRET_KEY: string
      STRIPE_SECRET_KEY: string
      STRIPE_ENDPOINT_SECRET: string
      GEMINI_API_KEY: string
    }
    type Variables = {
      orm: DrizzleD1Database
      auth: ReturnType<typeof initAuth>
      session: Session
      isPlanExpired: boolean
    }
  }
}
