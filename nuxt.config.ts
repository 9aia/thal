import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import ignoreTailwindSourceMapBroken from './app/plugins/vite/ignoreTailwindSourceMapBroken'
// import './psitta.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    'nitro-cloudflare-dev',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/mdc',
    'reka-ui/nuxt',
  ],

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
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
      ignoreTailwindSourceMapBroken(),
    ],
    server: {
      allowedHosts: ['dev.thal.9aia.com'],
    },
  },

  app: {
    layoutTransition: { name: 'fade' },
    head: {
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'Thal' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=yes,user-scalable=0' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },

  content: {
    watch: {
      ws: {
        // hostname: 'dev.thal.9aia.com',
      },
    },
    // TODO: fix this
    // locales: getConfig().locales,
    // defaultLocale: getConfig().defaultLocale,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  devServer: {
    host: '',
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

  icon: {
    serverBundle: {
      collections: ['material-symbols'],
    },
    componentName: 'NuxtIcon',
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

  nitro: {
    preset: 'cloudflare-module',

    cloudflare: {
      deployConfig: false,
      nodeCompat: true,
    },
  },
})
