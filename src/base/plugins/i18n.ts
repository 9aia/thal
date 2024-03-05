import '~/i18n'
import { getDefaultLocale, type Locale } from '~/lib/psitta/core'
import { createPsitta } from '~/lib/psitta/vue'

type PsittaStore = { locale: Locale };

export const store = reactive<PsittaStore>({} as PsittaStore)

export default defineNuxtPlugin((nuxtApp) => {
  store.locale = getDefaultLocale()

  const psitta = createPsitta({
    locale: toRefs(store).locale,
  })
  nuxtApp.vueApp.use(psitta)
})
