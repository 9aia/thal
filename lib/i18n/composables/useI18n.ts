import { computed } from 'vue'
import { usePageContext } from '#lib/vike/composables/usePageContext'

function useI18n() {
  const pageContext = usePageContext()
  return computed(() => pageContext.i18n || {})
}

export default useI18n
