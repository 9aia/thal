import type { LocationQueryRaw } from 'vue-router'
import { stringifyQuery } from '~/utils/vue'

function useAutoRedirect(options?: {
  query?: LocationQueryRaw
}) {
  const url = useRedirectUrl()

  onMounted(() => {
    const route = useRoute()

    // TODO: fix this (can't use sidebar here)
    // if (sidebar.view.value && sidebar.navigationDirection.value === 'forward')
    //   return

    let path = route.path

    if (options?.query) {
      const query = stringifyQuery(options.query)
      path += `?${query}`
    }

    url.value = path
  })

  onUnmounted(() => {
    url.value = '/app'
  })
}

export default useAutoRedirect
