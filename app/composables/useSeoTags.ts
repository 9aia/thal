interface SeoParams {
  title?: string
  description?: string
}

export function useSeoTags({ title, description }: SeoParams) {
  const seoMetaCookie = useCookie('thal_seo_meta')

  seoMetaCookie.value = JSON.stringify({
    title,
    description,
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterDescription: description,
  })
}
