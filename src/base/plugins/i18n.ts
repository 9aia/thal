import '~/i18n'
import { getDefaultLocale, type Locale } from '@psitta/core'
import { createPsitta } from '@psitta/vue'

type PsittaStore = { locale: Locale };

export const store = reactive<PsittaStore>({} as PsittaStore)

export default defineNuxtPlugin((nuxtApp) => {
  store.locale = getDefaultLocale()

  const psitta = createPsitta({
    locale: toRefs(store).locale,
  })
  nuxtApp.vueApp.use(psitta)
})
