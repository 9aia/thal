import { useLocale } from '@psitta/vue'
import { localeDefaultRegionMap } from '~~/psitta.config'

// TODO: remove this after Psitta API is updated
export default function useLocaleWithDefaultRegion() {
  const locale = useLocale()

  return computed(() => {
    return localeDefaultRegionMap[locale.value] || localeDefaultRegionMap.en
  })
}
