import type { User } from '~~/db/schema'
import { now } from '~/utils/date'

export function hasPlanExpired(user: User) {
  if (!user.plan || !user.plan_expires)
    return true

  const date = now()
  const expirationDate = new Date(user.plan_expires)

  return date > expirationDate
}
