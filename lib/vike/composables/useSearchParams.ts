import { computed } from 'vue'
import { usePageContext } from './usePageContext'

export function useSearchParams() {
  const c = usePageContext()
  return computed(() => c.urlParsed.search)
}
