import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import {
  userUpdateSchema,
  usernameSchema,
  users,
} from '../schemas/user'
import { notFound } from '#lib/hono/utils/httpStatus'
import type { HonoContext } from '#lib/hono/types'
import auth from '~/auth/middlewares/auth'

export default new Hono<HonoContext>()
  .get('/logged', auth(), async (c) => {
    const session = c.get('session')

    return c.json(session.user)
  })
  .get(
    '/:username',
    zValidator('param', z.object({ username: z.string() })),
    async (c) => {
      const { username } = c.req.valid('param')

      const orm = c.get('orm')
      const user = (
        await orm.select().from(users).where(eq(users.username, username))
      ).at(0)

      if (!user)
        throw notFound('User not found')

      return c.json(user)
    },
  )
  .patch(
    '/:username',
    zValidator('param', z.object({ username: z.string() })),
    zValidator('json', userUpdateSchema),
    async (c) => {
      const { username } = c.req.valid('param')
      const data = c.req.valid('json')

      const orm = c.get('orm')

      const user = await orm
        .update(users)
        .set(data)
        .where(eq(users.username, username))
        .returning()

      return c.json(user)
    },
  )
  .get(
    '/validateUsername/:username',
    zValidator('param', z.object({ username: z.string() })),
    async (c) => {
      const orm = c.get('orm')
      const { username } = c.req.valid('param')

      if (!usernameSchema.safeParse(username).success)
        return c.json({ valid: false })

      const usernameTaken
        = (
          await orm
            .select()
            .from(users)
            .where(eq(users.username, username))
        ).at(0) !== undefined

      return c.json({
        valid: !usernameTaken,
      })
    },
  )
