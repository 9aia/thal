function useSpaReferrer() {
  const route = useRoute()
  const isFirstRoute = useState<boolean>('isFirstRoute', () => true)
  const isExternalEntry = computed(() => isFirstRoute.value)

  const install = () => {
    watch(route, () => {
      isFirstRoute.value = false
    })
  }

  return {
    install,
    isExternalEntry,
  }
}

export default useSpaReferrer
