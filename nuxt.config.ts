import process from 'node:process'
import { getConfig } from '@psitta/core'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import ignoreTailwindSourceMapBroken from './app/plugins/vite/ignoreTailwindSourceMapBroken'
import './psitta.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  srcDir: './app',
  devtools: { enabled: true },
  modules: ['nitro-cloudflare-dev', '@nuxt/eslint', '@nuxtjs/mdc', '@nuxt/image', '@nuxt/fonts', '@nuxt/content', '@nuxt/icon', 'reka-ui/nuxt'],
  css: ['~/assets/css/main.css'],

  icon: {
    serverBundle: {
      collections: ['material-symbols'],
    },
    componentName: 'NuxtIcon',
  },

  content: {
    watch: {
      ws: {
        // hostname: 'dev.thal.9aia.com',
      },
    },
    locales: getConfig().locales,
    defaultLocale: getConfig().defaultLocale,
  },

  nitro: {
    preset: 'cloudflare-module',

    cloudflare: {
      deployConfig: false,
      nodeCompat: true,
    },
  },

  mdc: {
    components: {
      prose: false,
    },
    remarkPlugins: {
      emoji: {
        src: 'remark-emoji',
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  app: {
    layoutTransition: { name: 'fade' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=yes,user-scalable=0' },
      ],
    },
  },

  devServer: {
    host: '',
  },

  runtimeConfig: {
    GCP_CLOUD_TTS_API_KEY: process.env.GCP_CLOUD_TTS_API_KEY,
    GCP_GOOGLE_CLIENT_SECRET: process.env.GCP_GOOGLE_CLIENT_SECRET,
    GCP_GEMINI_API_KEY: process.env.GCP_GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET,
    public: {
      GCP_GOOGLE_CLIENT_ID: process.env.GCP_GOOGLE_CLIENT_ID,
      RUNTIME_ENV: process.env.RUNTIME_ENV,
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/modals',
      pathPrefix: false,
    },
    {
      path: '~/drawers',
      pathPrefix: false,
    },
  ],

  vite: {
    plugins: [
      tailwindcss(),
      ignoreTailwindSourceMapBroken(),
    ],
    server: {
      allowedHosts: ['dev.thal.9aia.com'],
    },
  },
})
