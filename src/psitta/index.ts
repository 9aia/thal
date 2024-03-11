import { createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'

export default defineNuxtModule((options, nuxtApp) => {
  console.log('aasdsd')
  const resolver = createResolver(import.meta.url)

  /* extendPages((pages) => {
    pages.unshift({
      name: 'prismic-preview',
      path: '/pt',
      file: resolver.resolve('index.vue')
    })

  }) */
})
