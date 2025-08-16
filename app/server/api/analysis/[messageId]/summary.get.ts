import { and, eq, isNull, not } from 'drizzle-orm'
import { z } from 'zod'
import { explainCorrectedMessage } from '~/server/services/assistance'
import { getValidated } from '~/utils/h3'
import { badRequest, forbidden, notFound, unauthorized } from '~/utils/nuxt'
import { numericString } from '~/utils/zod'
import { characterLocalizations, correctedMessages, localeSchema, messageAnalysisExplanationsLocalizations, messages } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { messageId } = await getValidated(event, 'params', z.object({
    messageId: numericString(z.number().int().positive()),
  }))
  const { locale } = await getValidated(event, 'query', z.object({
    locale: localeSchema,
  }))

  const user = event.context.user
  const orm = event.context.orm

  if (!user)
    throw unauthorized()

  const message = await orm.query.messages.findFirst({
    where: and(
      eq(messages.id, messageId),
      isNull(messages.deletedAt),
    ),
    with: {
      correctedMessage: {
        columns: {
          content: true,
        },
        where: and(
          isNull(correctedMessages.regeneratedAt),
        ),
      },
      messageAnalysisExplanations: {
        columns: {
          id: true,
          createdAt: true,
        },
        with: {
          localizations: {
            where: eq(messageAnalysisExplanationsLocalizations.locale, locale!),
          },
        },
        orderBy: (messageAnalysisExplanations, { desc }) => [desc(messageAnalysisExplanations.createdAt)],
        limit: 1,
      },
      chat: {
        columns: {
          id: true,
          userId: true,
        },
        with: {
          username: {
            columns: {
              text: true,
            },
            with: {
              character: {
                columns: {
                  discoverable: true,
                  deletedAt: true,
                },
                with: {
                  characterLocalizations: {
                    columns: {
                      name: true,
                      description: true,
                    },
                    where: and(
                      isNull(characterLocalizations.deletedAt),
                      eq(characterLocalizations.locale, 'en-US'),
                    ),
                  },
                },
              },
            },
          },
        },
      },
      inReplyTo: {
        columns: {
          id: true,
          content: true,
          isBot: true,
        },
      },
    },
    columns: {
      content: true,
      isBot: true,
    },
  })

  if (!message)
    throw notFound('Message not found')

  if (message.isBot)
    throw badRequest('Message is from a bot, not a user')

  if (message.chat.userId !== user.id)
    throw forbidden('You do not have permission to access this message')

  if (message?.messageAnalysisExplanations?.length) {
    const analysisSummary = message?.messageAnalysisExplanations?.[0]

    if (analysisSummary)
      return analysisSummary
  }

  const explanation = await explainCorrectedMessage(event, orm, user, locale!, {
    messageId,
    messageContent: message.content,
    correctedMessageContent: message.correctedMessage?.[0]?.content,
    username: message.chat.username,
    inReplyTo: message.inReplyTo,
  })

  return explanation
})
