import { and, eq, isNull, sql } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import { notFound } from '~~/server/utils/nuxt'
import type { User } from '~~/db/schema'
import { chats, correctedMessages, messages, usernames } from '~~/db/schema'

export async function getHistory(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.text, username),
    with: {
      chats: {
        where: eq(chats.userId, user.id!),
        with: {
          messages: {
            columns: {
              id: true,
              content: true,
              status: true,
            },
            where: isNull(messages.deletedAt),
            with: {
              correctedMessage: {
                columns: {
                  id: true,
                  content: true,
                  severity: true,
                  ignoredAt: true,
                  createdAt: true,
                },
                where: and(
                  isNull(correctedMessages.regeneratedAt),
                ),
                orderBy: (correctedMessage, { desc }) => [desc(correctedMessage.createdAt)],
                limit: 1,
              },
              inReplyTo: {
                columns: {
                  id: true,
                  content: true,
                  status: true,
                },
                extras: {
                  from: sql<'user' | 'bot'>`CASE WHEN ${messages.isBot} THEN 'bot' ELSE 'user' END`.as('from'),
                },
              },
            },
            extras: {
              from: sql<'user' | 'bot'>`CASE WHEN ${messages.isBot} THEN 'bot' ELSE 'user' END`.as('from'),
              time: sql<number>`${messages.createdAt}`.as('time'),
            },
          },
        },
      },
    },
  })

  if (!result)
    throw notFound('Username not found')

  const chat = result.chats[0]
  const history = chat?.id ? chat.messages : []

  return history
}
