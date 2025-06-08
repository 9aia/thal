import { useDebounceFn } from '@vueuse/core'
import type { useForm } from 'vee-validate'

function useUsernameValidation(form: ReturnType<typeof useForm>, options?: {
  fieldName?: string
}) {
  const { fieldName = 'username' } = options ?? {}

  const toast = useToast()
  const { t } = useI18nExperimental()
  const user = useUser()

  const isUsernameInvalid = ref(false)

  const validateUsername = async (username: string) => {
    if (!username)
      return

    const currentUsername = user.value?.username

    let invalid = false

    try {
      const { valid } = await $fetch(`/api/character/validate-username/${username}`)

      invalid = !valid && currentUsername !== username
    }
    catch (e) {
      const _ = e

      toast.error(t(
        'An error occurred while validating username.',
      ))
      invalid = false
    }

    isUsernameInvalid.value = invalid

    form.setFieldError(
      fieldName,
      invalid ? t('Username is invalid.') : undefined,
    )
  }

  const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
  watch(() => form.values[fieldName], debouncedValidateUsername)

  return {
    isUsernameInvalid,
  }
}

export default useUsernameValidation
