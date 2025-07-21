import { useLocale } from '@psitta/vue'

function useWhatsNew() {
  const locale = useLocale()

  const countQuery = useAsyncData('whats-new', () => queryContent('whats-new', locale.value).count())

  const lastSavedContentCount = useCookie('lastSavedContentCount', {
    default: () => 0,
  })
  const hasUnreadContent = computed(() => {
    if (!countQuery.data.value)
      return false
    return countQuery.data.value > lastSavedContentCount.value
  })

  const seeContent = async () => {
    const contentAmount = await queryContent('whats-new', locale.value).count()
    if (hasUnreadContent.value) {
      lastSavedContentCount.value = contentAmount
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
