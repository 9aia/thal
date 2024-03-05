import type { FormContext, GenericObject } from 'vee-validate'
import { computed } from 'vue'

function useHasFormErrors<T extends GenericObject = GenericObject> (
  form: FormContext<T>,
) {
  const hasErrors = computed(() => Object.keys(form.errorBag.value).length > 0)

  return hasErrors
}

export default useHasFormErrors
