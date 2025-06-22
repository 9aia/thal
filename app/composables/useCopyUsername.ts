function useCopyUsername(username: MaybeRef<string | undefined>) {
  const toast = useToast()
  const { t } = useI18nExperimental()

  return async () => {
    try {
      const _username = toValue(username)

      if (!_username)
        throw new Error('Username is not defined')

      await navigator.clipboard.writeText(_username)

      toast.success(t('Copied username to clipboard'))
    }
    catch (_e) {
      const _ = _e
      toast.error(t('Failed to copy username to clipboard'))
    }
  }
}

export default useCopyUsername
