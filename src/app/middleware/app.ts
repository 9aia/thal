export default defineNuxtRouteMiddleware((event) => {
	const user = useUser()
	const cookie = useCookie('redirect_url', { path: '/' })
	cookie.value = event.path

	if (!user.value) {
		return navigateTo('/sign-in')
	}

  if (!user.value.plan) {
		return navigateTo('/pricing')
	}
})
