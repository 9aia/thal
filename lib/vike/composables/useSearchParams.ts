import { computed } from 'vue'
import { usePageContext } from './usePageContext'

export function useSearchParams() {
  const pageContext = usePageContext()
  return computed(() => pageContext.urlParsed.search)
}
