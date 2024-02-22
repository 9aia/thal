import { computed } from 'vue'
import type { PageContext } from 'vike/types'
import type { InferData } from '../types'
import { usePageContext } from './usePageContext'

type DataFunction = (c: PageContext) => any

export function useData<T extends DataFunction>() {
  type DataType = InferData<T>

  const c = usePageContext()
  return computed<DataType>(
    () => (c.data as DataType),
  )
}
