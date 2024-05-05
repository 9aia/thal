function useRedirectUrl() {
  return useCookie("redirect_url", { path: "/ " })
}

export default useRedirectUrl
