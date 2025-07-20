import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function usePricingQuery() {
  const headers = useRequestHeaders(['cookie'])

  return useQuery({
    queryFn: () => $fetch('/api/payment/stripe/pricing-data', {
      headers,
    }),
    queryKey: queryKeys.pricingData,
    staleTime: 0,
  })
}

export default usePricingQuery
