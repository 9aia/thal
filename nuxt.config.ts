import process from 'node:process'
import { getConfig } from '@psitta/core'
import './i18n'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: './app',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nitro-cloudflare-dev', '@nuxt/eslint', '@nuxtjs/mdc', '@nuxt/image', '@nuxt/fonts', '@nuxt/content'],

  content: {
    watch: {
      ws: {
        // hostname: '9aia-dev.com',
      },
    },
    locales: getConfig().locales,
    defaultLocale: getConfig().defaultLocale,
  },

  nitro: {
    preset: 'cloudflare-module',
  },

  mdc: {
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
    head: {
      title: 'Thal - Talk to Learn. Learn to Talk.',
      meta: [
        { name: 'description', content: 'Welcome to an AI-powered English learning app, providing personalized learning experiences.' },
        { name: 'keywords', content: 'English learning, AI-powered, personalized learning, language learning' },
        { name: 'author', content: 'Luis Emidio' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' },
      ],
    },
  },

  devServer: {
    host: '',
  },

  runtimeConfig: {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET,
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
  ],

  compatibilityDate: '2024-12-25',
})
