function useWhatsNew() {
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()

  const fetcher = () => {
    return $fetch('/api/content/whats-new/count', {
      params: {
        locale: localeWithDefaultRegion.value,
      },
    })
  }

  const countQuery = useAsyncData('whats-new', () => fetcher())

  const lastSavedContentCount = useCookie('thal_whats_new_count', {
    default: () => 0,
  })
  const hasUnreadContent = computed(() => {
    if (!countQuery.data.value)
      return false
    return countQuery.data.value.count > lastSavedContentCount.value
  })

  const seeContent = async () => {
    const contentAmount = await fetcher()

    if (hasUnreadContent.value) {
      lastSavedContentCount.value = contentAmount.count
    }
  }

  return {
    countQuery,
    lastSavedContentCount,
    hasUnreadContent,
    seeContent,
  }
}

export default useWhatsNew
