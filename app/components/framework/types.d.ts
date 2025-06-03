import type { MaybePromise } from 'vee-validate'

export interface Resource<T = any> {
  data: MaybeRef<T>
  isLoading: MaybeRef<boolean>
  isError: MaybeRef<boolean>
  refetch?: () => MaybePromise<any>
}
