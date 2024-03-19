import { useI18n } from '@psitta/vue'
import { useToast } from '~/src/ui/composables/useToast'

function useLogout() {
  const toast = useToast()
  const { t } = useI18n()
  const user = useUser()

  const logout = async () => {
    try {
      await $fetch('/api/logout', {
        method: 'POST',
      })
      user.value = null
  
      navigateTo('/sign-in')
    } catch (error) {
      toast.error(t('An error occurred while logging out.'))
    }
  }

  return logout
}

export default useLogout
