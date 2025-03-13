function removeHtmlTags(str: string) {
  return str.replace(/<[^>]*>/g, '')
}

export default function useIsTextEmpty(text: Ref<string>) {
  const isEmpty = ref(true)

  watch(text, () => {
    const plainText = removeHtmlTags(text.value)

    isEmpty.value = !plainText
  })

  return isEmpty
}
