import client from '#lib/hono/client'
import { useToast } from '#lib/daisy/composables/useToast'
import { reload } from 'vike/client/router'
import { useI18n } from '#lib/i18n'
import { usePageContext } from '#lib/vike/composables/usePageContext'
import { computed } from 'vue'

function useAuth() {
  const toast = useToast()
  const { t } = useI18n()

  const c = usePageContext()

  async function logout() {
    try {
      const data = await client.auth.logout.$post()

      if (data.ok)
        reload()
      else
        throw new Error('An error occurred while logging out.')
    }
    catch {
      toast.error(t('An error occurred while logging out.'))
    }
  }

  return {
    logout,
    user: computed(() => c.user!),
  }
}

export default useAuth
