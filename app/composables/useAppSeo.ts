function useAppSeo() {
  const route = useRoute()

  const seoMetaCookie = useCookie('seoMeta')

  watch(route, () => {
    seoMetaCookie.value = null
  })

  onMounted(() => {
    seoMetaCookie.value = null
  })
}

export default useAppSeo
