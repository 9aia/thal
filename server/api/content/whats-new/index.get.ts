import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'
import { localeSchema } from '~~/server/db/schema'
import { getValidated } from '~~/server/utils/h3'

export default defineEventHandler(async (event) => {
  const { locale } = await getValidated(event, 'query', z.object({
    locale: localeSchema,
  }))

  const content = await queryCollection(event, 'content')
    .where('id', 'LIKE', `content/whats-new/${locale}%`)
    .all()

  return {
    content,
  }
})
