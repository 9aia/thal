import { type Locale, getConfig } from '@psitta/core'
import { createPsitta } from '@psitta/vue'
import '~~/i18n'

interface PsittaStore { locale: Locale }

export const store = reactive<PsittaStore>({} as PsittaStore)

export default defineNuxtPlugin((nuxtApp) => {
  store.locale = getConfig().defaultLocale

  const locale = toRefs(store).locale

  const psitta = createPsitta({
    locale,
  })
  nuxtApp.vueApp.use(psitta)

  useHead({
    htmlAttrs: {
      lang: locale,
    },
  })

  const route = useRoute()

  watch(route, (to) => {
    const metaLocale = to.meta.locale

    if (metaLocale) {
      locale.value = metaLocale as string
    }
  }, { immediate: true })
})
