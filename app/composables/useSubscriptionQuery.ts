import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useSubscriptionQuery() {
  const headers = useRequestHeaders(['cookie'])

  return useQuery({
    queryFn: () => $fetch('/api/payment/stripe/subscription-data', {
      headers,
    }),
    queryKey: queryKeys.subscriptionData,
    staleTime: 0,
  })
}

export default useSubscriptionQuery
