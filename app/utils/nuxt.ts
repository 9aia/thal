import type { RouteLocationNormalized } from 'vue-router'

export function saveRouteAndNavigateTo(from: RouteLocationNormalized, redirectUrl: string | null) {
  const url = useRedirectUrl()
  url.value = from.fullPath

  return navigateTo(redirectUrl)
}
