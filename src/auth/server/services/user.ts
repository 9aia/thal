import { and, eq, sql } from 'drizzle-orm';
import { H3EventContext } from 'h3';
import { UserInsert, oAuthAccounts, users } from '~/src/base/server/db/schema';
import { now } from '~/src/base/utils/date';
import { GetUserData, OAuthAccountInsert } from '../../types';
import { generateId } from 'lucia';

export async function createUser(
  orm: H3EventContext['orm'],
  userInsert: UserInsert,
  oauthAccountInsert: OAuthAccountInsert
) {
  const userId = generateId(15)

  await orm.batch([
    orm.insert(users).values({
      id: userId,
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
