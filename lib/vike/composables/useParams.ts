import { computed } from 'vue'
import { usePageContext } from './usePageContext'

export function useParams() {
  const c = usePageContext()
  return computed(() => c.routeParams)
}
