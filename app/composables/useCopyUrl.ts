function useCopyUsername() {
  const toast = useToast()
  const { t } = useI18nExperimental()

  return async () => {
    try {
      const currentUrl = window.location.href

      await navigator.clipboard.writeText(currentUrl)

      toast.success(t('Copied character link to clipboard'))
    }
    catch (_e) {
      const _ = _e
      toast.error(t('Failed to copy character link to clipboard'))
    }
  }
}

export default useCopyUsername
