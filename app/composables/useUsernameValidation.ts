import { useDebounceFn } from '@vueuse/core'
import type { useForm } from 'vee-validate'
import { usernameSchema, usernameSchemaChecks } from '~~/db/schema'

function useUsernameValidation(form: ReturnType<typeof useForm>, options?: {
  fieldName?: string
}) {
  const { fieldName = 'username' } = options ?? {}

  const { t } = useI18nExperimental()
  const user = useUser()

  const isUsernameInvalid = ref(false)

  const invalidSyntaxErrorMessage = t(
    'Username can only contain letters, numbers, and underscores. Min {min} character, max {max} characters.',
    usernameSchemaChecks,
  )

  const usernameRules = yupify(usernameSchema, invalidSyntaxErrorMessage)

  const validateUsername = async (username: string) => {
    if (!username)
      return

    const currentUsername = user.value?.username

    let invalidSyntax = false
    let taken = false
    const isMine = currentUsername === username

    try {
      const result = await $fetch(`/api/username/validate/${username}`)

      invalidSyntax = result.invalidSyntax
      taken = result.taken
    }
    catch (e) {
      const _ = e

      form.setFieldError(
        fieldName,
        t('An error occurred while validating username.'),
      )

      isUsernameInvalid.value = true
      return
    }

    if (invalidSyntax) {
      form.setFieldError(
        fieldName,
        invalidSyntaxErrorMessage,
      )
      isUsernameInvalid.value = true
      return
    }

    if (isMine) {
      isUsernameInvalid.value = false
      return
    }

    if (taken) {
      form.setFieldError(
        fieldName,
        t('Username is already taken.'),
      )
      isUsernameInvalid.value = true
    }
  }

  const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
  watch(() => form.values[fieldName], debouncedValidateUsername)

  return {
    isUsernameInvalid,
    usernameRules,
  }
}

export default useUsernameValidation
