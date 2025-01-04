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
      title: 'Thal - Digital run to fluency',
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
