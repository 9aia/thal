import { eq } from "drizzle-orm"
import { users, deletedOAuthAccounts, oAuthAccounts } from "~/src/base/server/db/schema"
import { unauthorized } from "~/src/base/utils/nuxt"
import { invalidateSession } from "../services/user"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if(!user) {
    throw unauthorized()
  }

  const oAuthProvider = await orm.select().from(oAuthAccounts).where(eq(oAuthAccounts.userId, user.id))

  await orm.delete(users).where(eq(users.id, user.id))

  await orm.insert(deletedOAuthAccounts).values(oAuthProvider.map(provider => ({
    userId: user.id,
    providerUserId: provider.providerUserId,
    providerId: provider.providerId,
    createdAt: new Date().toISOString(),
  })))

  await invalidateSession(event)

  return sendRedirect(event, '/deleted-account')
})
