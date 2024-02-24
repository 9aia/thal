import type { Locale } from '#lib/i18n'
import type { ComputedRef } from 'vue'
import { inject } from 'vue'

function useLocale() {
  const locale = inject<ComputedRef<Locale>>('__locale')

  if (!locale)
    throw new Error('Locale not provided.')

  return locale
}

export default useLocale
