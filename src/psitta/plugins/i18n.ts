import { getConfig, type Locale } from '@psitta/core';
import { createPsitta } from '@psitta/vue';
import '~/i18n';

type PsittaStore = { locale: Locale };

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
      lang: locale
    }
  })
})
