import { type Locale, getConfig } from '@psitta/core'
import { createPsitta } from '@psitta/vue'
import '~~/psitta.config'

interface PsittaStore { locale: Locale }

export const store = reactive<PsittaStore>({} as PsittaStore)

export default defineNuxtPlugin((nuxtApp) => {
  const config = getConfig()
  store.locale = config.defaultLocale
  const locale = toRefs(store).locale

  const cookieLocale = useCookie('locale')

  watch(cookieLocale, () => {
    locale.value = cookieLocale.value || config.defaultLocale
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
