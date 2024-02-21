import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import type { ProfileInsert } from '../schemas/profile'
import { profiles } from '../schemas/profile'
import type { HonoContext } from '#lib/hono/types'
import { notFound } from '#lib/hono/utils/httpStatus'
import { now } from '#lib/lang/utils/date'

export async function getProfile(c: Context<HonoContext>, username: string) {
  const orm = c.get('orm')

  const profile = (
    await orm.select().from(profiles).where(eq(profiles.username, username))
  ).at(0)

  if (!profile)
    throw notFound(`"Profile not found: ${username}`)

  return profile
}

export async function createProfile(
  c: Context<HonoContext>,
  insert: ProfileInsert,
) {
  const orm = c.get('orm')

  const profile = await orm
    .insert(profiles)
    .values({
      ...insert,
      signupDate: now().toString(),
    })
    .returning()

  return profile
}
