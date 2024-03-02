import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import type { UserInsert } from '../schemas/user'
import { users } from '../schemas/user'
import type { HonoContext } from '#lib/hono/types'
import { notFound } from '#lib/hono/utils/httpStatus'
import { now } from '#lib/lang/utils/date'

export async function getUser(c: Context<HonoContext>, username: string) {
  const orm = c.get('orm')

  const user = (
    await orm.select().from(users).where(eq(users.username, username))
  ).at(0)

  if (!user)
    throw notFound(`"User not found: ${username}`)

  return user
}

export async function createProfile(
  c: Context<HonoContext>,
  insert: UserInsert,
) {
  const orm = c.get('orm')

  const [user] = await orm
    .insert(users)
    .values({
      ...insert,
      signupDate: now().toString(),
    })
    .returning()

  return user
}
