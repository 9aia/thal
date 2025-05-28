import { refDebounced } from '@vueuse/core'
import type { useForm } from 'vee-validate'
import { searchParams } from '~/store'

function useSearchParamField(
  form: ReturnType<typeof useForm>,
  options: {
    name?: string
    debounceMs?: number
  } = {},
) {
  const name = options.name ?? 'search'

  const initialValue = (Array.isArray(searchParams[name]) ? searchParams[name][0] : searchParams[name]) || ''

  // set initial value
  form.setValues({ [name]: initialValue })

  const debouncedValue = refDebounced(toRef(() => form.values[name] || initialValue), options.debounceMs ?? 500)

  // update url when search changes
  watch(() => form.values[name], (newValue) => {
    if (newValue)
      searchParams[name] = newValue
    else
      delete searchParams[name]
  })

  return debouncedValue
}

export default useSearchParamField
