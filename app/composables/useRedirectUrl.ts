function useRedirectUrl() {
  const url = useCookie('redirect_url', { path: '/' })
  return url
}

export default useRedirectUrl
