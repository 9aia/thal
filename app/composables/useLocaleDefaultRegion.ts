import { useLocale } from '@psitta/vue'

export default function useLocaleDefaultRegion() {
  return computed(() => {
    if (!window) {
      return 'en-US'
    }

    const locale = useLocale()

    const localeDefaultRegion: Record<string, string> = {
      pt: 'pt-BR',
      en: 'en-US',
    }

    return localeDefaultRegion[locale.value] || localeDefaultRegion.en
  })
}
