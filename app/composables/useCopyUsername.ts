import { useI18n } from '@psitta/vue'

function useCopyUsername(username: MaybeRef<string | undefined>) {
  const toast = useToast()
  const { t } = useI18n()

  return async () => {
    try {
      const _username = unref(username)
      if (!_username)
        throw new Error('Username is not defined')

      await navigator.clipboard.writeText(_username)

      toast.success(t('Copied character username to clipboard'))
    }
    catch (_e) {
      const _ = _e
      toast.error(t('Failed to copy character username to clipboard'))
    }
  }
}

export default useCopyUsername
