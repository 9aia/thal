import { useLocale } from '@psitta/vue'
import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useWhatsNew() {
  const locale = useLocale()

  const countQuery = useQuery({
    queryKey: queryKeys.contentCount(locale.value, 'whats-new'),
    queryFn: () => queryContent('whats-new', locale.value).count(),
    enabled: import.meta.client,
  })

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
