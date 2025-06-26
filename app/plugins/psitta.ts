import { type Locale, getConfig } from '@psitta/core'
import { createPsitta } from '@psitta/vue'
import '~~/psitta.config'

interface PsittaStore { locale: Locale }

export const store = reactive<PsittaStore>({} as PsittaStore)

export default defineNuxtPlugin((nuxtApp) => {
  store.locale = getConfig().defaultLocale
  const locale = toRefs(store).locale

  const route = useRoute()
  watch(route, (to) => {
    locale.value = to.params.locale as string
  }, { immediate: true })

  const psitta = createPsitta({
    locale,
  })
  nuxtApp.vueApp.use(psitta)

  useHead({
    htmlAttrs: {
      lang: locale,
    },
  })
})
