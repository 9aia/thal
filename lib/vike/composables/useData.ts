import { computed } from 'vue'
import type { PageContext } from 'vike/types'
import type { InferData } from '../types'
import { usePageContext } from './usePageContext'

type DataFunction = (pageContext: PageContext) => any

export function useData<T extends DataFunction>() {
  type DataType = InferData<T>

  const pageContext = usePageContext()
  return computed<DataType>(
    () => (pageContext.data as DataType),
  )
}
