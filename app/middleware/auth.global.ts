import type { User } from "lucia"

export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()

  if (!user.value) {
    const data = await useRequestFetch()("/api/user") as User | null

    if (data)
      user.value = data
  }
})
