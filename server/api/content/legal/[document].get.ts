import { z } from 'zod'
// import { localeSchema } from '~~/server/db/schema'
import { queryCollection } from '@nuxt/content/server'
import { getValidated } from '~~/server/utils/h3'

export default defineEventHandler(async (event) => {
  // const { locale } = await getValidated(event, 'query', z.object({
  //   locale: localeSchema,
  // }))
  const locale = 'pt-BR'

  const { document } = await getValidated(event, 'params', z.object({
    document: z.string(),
  }))

  const content = await queryCollection(event, 'content')
    .where('id', '=', `content/legal/${locale}/${document}.md`)
    .first()

  return content
})
