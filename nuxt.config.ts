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
      remarkSpanWords: {
        src: '~~/remark-span-words.ts',
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
        { name: 'description', content: 'Improve your English through conversations with personalized AI characters and real-time UI assistance!' },
        { name: 'keywords', content: 'English learning, AI tutor, Language practice, Conversation practice, Real-time assistance, Personalized learning, AI chatbot, Interactive English, Speaking practice, Fluency improvement' },
        { name: 'author', content: 'Gaia Team' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=yes,user-scalable=0' },
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
    GCP_CLOUD_TTS_API_KEY: process.env.GCP_CLOUD_TTS_API_KEY,
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
    {
      path: '~/drawers',
      pathPrefix: false,
    },
  ],

  vite: {
    server: {
      allowedHosts: ['9aia-dev.com'],
    },
  },

  compatibilityDate: '2024-12-25',
})
