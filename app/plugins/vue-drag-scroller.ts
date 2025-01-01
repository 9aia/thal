import VueDragScroller from 'vue-drag-scroller'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDragScroller)
})
