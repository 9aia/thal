export default defineNuxtRouteMiddleware((event) => {
	const user = useUser()

	if (!user.value) {
		return navigateTo('/sign-in')
	}
});