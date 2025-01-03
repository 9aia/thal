import { useI18n } from '@psitta/vue'

function useCopyUsername() {
  const toast = useToast()
  const { t } = useI18n()

  return async () => {
    try {
      const currentUrl = window.location.href

      await navigator.clipboard.writeText(currentUrl)

      toast.success(t('Link copied to clipboard'))
    }
    catch (_e) {
      const _ = _e
      toast.error(t('Failed to copy link to clipboard'))
    }
  }
}

export default useCopyUsername
