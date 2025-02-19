function useAutoRedirect(options?: {
  query?: Record<string, string | string[]>
}) {
  const url = useRedirectUrl()

  onMounted(() => {
    const route = useRoute()
    let path = route.path

    if (options?.query) {
      const query = Object.entries(options.query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
      path += `?${query}`
    }

    url.value = path
  })

  onUnmounted(() => {
    url.value = '/app'
  })
}

export default useAutoRedirect
