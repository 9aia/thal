function useClipboard(text: MaybeRef<string | undefined>) {
  const toast = useToast()
  const { t } = useI18nExperimental()

  return async () => {
    if (!navigator.clipboard)
      toast.error(t('Clipboard API is not available'))

    const _text = toValue(text)

    if (!_text) {
      toast.error(t('An error occurred while copying to clipboard'))
      return
    }

    try {
      await navigator.clipboard.writeText(_text)

      toast.success(t('Copied to clipboard'))
    }
    catch (_e) {
      const _ = _e
      toast.error(t('Failed to copy to clipboard'))
    }
  }
}

export default useClipboard
