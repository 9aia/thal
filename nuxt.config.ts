import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import ignoreTailwindSourceMapBroken from './app/plugins/vite/ignoreTailwindSourceMapBroken'

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
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
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
  css: ['~/assets/css/tailwind.css'],

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
        { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=yes,user-scalable=0' },
      ],
    },
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
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
    // TODO: check this
    // remarkPlugins: {
    //   emoji: {
    //     src: 'remark-emoji',
    //   },
    // },
  },

  icon: {
    serverBundle: {
      collections: ['material-symbols'],
    },
    componentName: 'NuxtIcon',
  },

  shadcn: {
    prefix: 'U',
    componentDir: '~/components/ui',
  },

  colorMode: {
    classSuffix: '',
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
