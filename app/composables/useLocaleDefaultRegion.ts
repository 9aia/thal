import { useLocale } from '@psitta/vue'

// TODO: remove this after Psitta API is updated
export default function useLocaleDefaultRegion() {
  const locale = useLocale()

  return computed(() => {
    const localeDefaultRegion: Record<string, string> = {
      pt: 'pt-BR',
      en: 'en-US',
    }

    return localeDefaultRegion[locale.value] || localeDefaultRegion.en
  })
}
