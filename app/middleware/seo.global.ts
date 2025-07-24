export default defineNuxtRouteMiddleware(async () => {
  const { t } = useI18nExperimental()

  const seoMetaCookie = useCookie('thal_seo_meta')

  const seoMeta = seoMetaCookie.value as { title?: string, description?: string } | undefined

  const redirectedFromTitle = seoMeta?.title as string | undefined
  const redirectedFromDescription = seoMeta?.description as string | undefined

  const title = t('Thal - Learn English like you’re texting a friend—not studying for a test.')
  const description = t('Improve your English through conversations with personalized AI characters and real-time UI assistance!')

  useSeoMeta({
    title: redirectedFromTitle || title,
    description: redirectedFromDescription || description,
    ogTitle: redirectedFromTitle || title,
    ogDescription: redirectedFromDescription || description,
    twitterTitle: redirectedFromTitle || title,
    twitterDescription: redirectedFromDescription || description,
    author: t('Gaia Team'),
  })
})
