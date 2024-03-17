import { and, eq, sql } from 'drizzle-orm';
import { H3Event, H3EventContext } from 'h3';
import { UserInsert, oAuthAccounts, users } from '~/src/base/server/db/schema';
import { now } from '~/src/base/utils/date';
import { GetUserData, OAuthAccountInsert } from '../../types';
import { generateId } from 'lucia';
import { unauthorized } from '~/src/base/utils/nuxt';

export async function createUser(
  orm: H3EventContext['orm'],
  userInsert: UserInsert,
  oauthAccountInsert: OAuthAccountInsert
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
      ...oauthAccountInsert,
      userId,
    }),
  ])

  return { id: userId }
}

export async function getUser(
  orm: H3EventContext['orm'],
  data: GetUserData
) {
  const user = await orm
    .select()
    .from(oAuthAccounts)
    .where(
      and(
        eq(oAuthAccounts.providerId, data.providerId),
        eq(oAuthAccounts.providerUserId, sql.placeholder('id'))
      )
    )
    .prepare()
    .get({ id: data.providerUserId })

  return user
}

export async function invalidateSession(
  event: H3Event,
) {
  const lucia = event.context.lucia

  if (!event.context.session) {
    throw unauthorized()
  }

  await lucia.invalidateSession(event.context.session.id)
  
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createBlankSessionCookie().serialize()
  )
}
