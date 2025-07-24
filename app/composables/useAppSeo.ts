function useAppSeo() {
  const route = useRoute()

  const seoMetaCookie = useCookie('thal_seo_meta')

  watch(route, () => {
    seoMetaCookie.value = null
  })

  onMounted(() => {
    seoMetaCookie.value = null
  })
}

export default useAppSeo
