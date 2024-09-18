// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "./app",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", ["@nuxtjs/google-fonts", {
    families: {
      "Noto+Sans": true,
    },
  }], "nitro-cloudflare-dev", "@nuxt/eslint", "@nuxtjs/mdc", "@nuxt/image"],
  mdc: {
    remarkPlugins: {
      emoji: {
        src: "remark-emoji",
      },
    },
  },
  app: {
    head: {
      title: "Thal - Digital run to fluency",
      meta: [
        { name: "description", content: "Welcome to an AI-powered English learning app, providing personalized learning experiences." },
        { name: "keywords", content: "English learning, AI-powered, personalized learning, language learning" },
        { name: "author", content: "Luis Emidio" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" },
      ],
    },
  },
  devServer: {
    host: "",
  },
  extends: [
    "./layers/ui",
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
})
