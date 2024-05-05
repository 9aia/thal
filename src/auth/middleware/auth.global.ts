import type { User } from "lucia"
import useUser from "../composables/useUser"

export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()

  if (!user.value) {
    const data = await useRequestFetch()("/api/user") as User | null

    if (data)
      user.value = data
  }
})
