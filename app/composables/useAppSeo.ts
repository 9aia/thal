function useAppSeo() {
  const route = useRoute()
  const { t } = useI18nExperimental()

  const title = t('Thal - Talk to Learn. Learn to Talk.')
  const description = t('Improve your English through conversations with personalized AI characters and real-time UI assistance!')

  function updateSeoMeta() {
    useSeoMeta({
      // HTML tags
      title,
      description,
      // Facebook tags
      ogTitle: title,
      ogDescription: description,
      // Twitter tags
      twitterTitle: title,
      twitterDescription: description,

      author: t('Gaia Team'),
    })
  }

  updateSeoMeta()

  watch(route, (newRoute) => {
    // TODO: improve this
    if (!newRoute.path.includes('/app/chat/')) {
      updateSeoMeta()
    }
  })
}

export default useAppSeo
