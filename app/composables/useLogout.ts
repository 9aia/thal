import { useI18n } from '@psitta/vue'

function useLogout() {
  const toast = useToast()
  const { t } = useI18n()
  const user = useUser()

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })
      user.value = null

      navigateTo('/sign-in')
    }
    catch (e) {
      const _ = e
      toast.error(t('An error occurred while logging out.'))
    }
  }

  return logout
}

export default useLogout
