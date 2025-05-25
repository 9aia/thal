import { eq, sql } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import type { User } from '~~/db/schema'
import type { MessageStatus } from '~/types'
import { notFound } from '~/utils/nuxt'
import { chats, messages, usernames } from '~~/db/schema'

export async function getHistory(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.username, username),
    with: {
      chats: {
        where: eq(chats.userId, user.id!),
        with: {
          messages: {
            columns: {
              id: true,
            },
            with: {
              replyingMessage: {
                columns: {
                  id: true,
                },
                extras: {
                  from: sql<'user' | 'bot'>`CASE WHEN ${messages.isBot} THEN 'bot' ELSE 'user' END`.as('from'),
                  message: sql<string>`${messages.data}`.as('message'),
                },
              },
            },
            extras: {
              status: sql<MessageStatus>`CONCAT("seen")`.as('status'),
              from: sql<'user' | 'bot'>`CASE WHEN ${messages.isBot} THEN 'bot' ELSE 'user' END`.as('from'),
              message: sql<string>`${messages.data}`.as('message'),
              time: sql<number>`${messages.createdAt}`.as('time'),
            },
          },
        },
      },
    },
  })

  if (!result)
    throw notFound('Character Username not found')

  const chat = result.chats[0]

  return { history: chat?.id ? chat.messages : [], chatId: chat?.id ? chat.id : null }
}
