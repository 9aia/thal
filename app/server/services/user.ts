import { and, eq, sql } from "drizzle-orm"
import type { H3Event, H3EventContext } from "h3"
import { generateId } from "lucia"
import type { OAuthProviderParams } from "../types"
import type { UserInsert } from "~~/db/schema"
import { oAuthAccounts, users } from "~~/db/schema"
import { now } from "~/utils/date"
import { unauthorized } from "~/utils/nuxt"

export async function createUser(
  orm: H3EventContext["orm"],
  userInsert: UserInsert,
  providerParams: OAuthProviderParams,
) {
  const userId = generateId(15)

  await orm.batch([
    orm.insert(users).values({
      id: userId,
      free_trial_used: 0,
      createdAt: now().toString(),
      ...userInsert,
    }),
    orm.insert(oAuthAccounts).values({
      ...providerParams,
      userId,
    }),
  ])

  return { id: userId }
}

export async function getUser(
  orm: H3EventContext["orm"],
  providerParams: OAuthProviderParams,
) {
  const user = await orm
    .select()
    .from(oAuthAccounts)
    .where(
      and(
        eq(oAuthAccounts.providerId, providerParams.providerId),
        eq(oAuthAccounts.providerUserId, sql.placeholder("id")),
      ),
    )
    .prepare()
    .get({ id: providerParams.providerUserId })

  return user
}

export async function invalidateSession(
  event: H3Event,
) {
  const lucia = event.context.lucia

  if (!event.context.session)
    throw unauthorized()

  await lucia.invalidateSession(event.context.session.id)

  appendHeader(
    event,
    "Set-Cookie",
    lucia.createBlankSessionCookie().serialize(),
  )
}
