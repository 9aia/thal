// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/google-fonts', {
      families: {
        'Noto+Sans': true,
      }
    }],
    'nitro-cloudflare-dev',
  ],
  app: {
    head: {
      title: 'Maratongue - Digital run to fluency',
      meta: [
        { name: 'description', content: 'Welcome to an AI-powered English learning app, providing personalized learning experiences.' },
        { name: 'keywords', content: 'English learning, AI-powered, personalized learning, language learning' },
        { name: 'author', content: 'Luis Float' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' },
      ],
    },
  },
  extends: [
    './src/base',
    './src/press',
    './src/policy',
    './src/app',
    './src/auth',
    './src/payment',
  ],
})
