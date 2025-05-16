import { and, eq, sql } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import type { OAuthProviderParams } from '../types'
import { now } from '~/utils/date'
import type { UserInsert } from '~~/db/schema'
import { oAuthAccounts, usernames, users } from '~~/db/schema'
import { generateId } from '~/utils/auth'

export async function createUser(
  orm: H3EventContext['orm'],
  userInsert: UserInsert,
  providerParams: OAuthProviderParams,
) {
  const userId = generateId(15)

  await orm.batch([
    orm.insert(users).values({
      id: userId,
      ...userInsert,
    }),
    orm.insert(oAuthAccounts).values({
      ...providerParams,
      userId,
    }),
    orm.insert(usernames).values({
      username: userInsert.username,
      userId,
    }),
  ])

  return { id: userId }
}

export async function getUser(
  orm: H3EventContext['orm'],
  providerParams: OAuthProviderParams,
) {
  const user = await orm
    .select()
    .from(oAuthAccounts)
    .where(
      and(
        eq(oAuthAccounts.providerId, providerParams.providerId),
        eq(oAuthAccounts.providerUserId, sql.placeholder('id')),
      ),
    )
    .prepare()
    .get({ id: providerParams.providerUserId })

  return user
}
