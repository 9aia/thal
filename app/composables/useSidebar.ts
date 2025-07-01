import { SIDEBAR_COMPONENTS, SIDEBAR_DEFAULT_VIEW, type SidebarView } from '~/constants/sidebar'
import { stringifyQuery } from '~/utils/vue'

const history = ref<SidebarView[]>([SIDEBAR_DEFAULT_VIEW])
const navigationDirection = ref<'forward' | 'backward'>('forward')

watch(history, (newHistory) => {
  console.log('history', newHistory)
}, { deep: true, immediate: true })

// TODO: on route init with query, push it to sidebar history

function useSidebar() {
  const router = useRouter()
  const route = useRoute()
  const redirectUrl = useCookie('redirect_url', { path: '/' })

  const view = computed(() => {
    const queryKeys = Object.keys(route.query) as (keyof typeof SIDEBAR_COMPONENTS)[]

    let view: keyof typeof SIDEBAR_COMPONENTS = SIDEBAR_DEFAULT_VIEW

    for (const key of queryKeys) {
      if (SIDEBAR_COMPONENTS[key]) {
        view = key
      }
    }

    return view
  })

  const updateUrl = (view: keyof typeof SIDEBAR_COMPONENTS) => {
    const ACTIVE = view === SIDEBAR_DEFAULT_VIEW ? undefined : null

    router.replace({
      query: {
        [view]: ACTIVE,
      },
      hash: route.hash,
    })
  }

  // watch(route, () => {
  //   history.value.push(view.value)
  // }, { immediate: true, once: true })

  const refreshViewQuery = () => {
    const route = useRoute()
    console.log('refreshViewQuery', route.query)

    if (view.value !== history.value[history.value.length - 1])
      history.value.push(view.value)

    updateUrl(view.value)
  }

  const updateAutoRedirect = (view: keyof typeof SIDEBAR_COMPONENTS) => {
    const queryString = stringifyQuery({
      [view]: view === SIDEBAR_DEFAULT_VIEW ? undefined : null,
    })

    const newUrl = queryString.length > 0 ? `${redirectUrl.value}?${queryString}` : redirectUrl.value

    redirectUrl.value = newUrl
    // TODO: fix cookie update (look like there's something overwriting it after the first update)
  }

  const push = (newView: keyof typeof SIDEBAR_COMPONENTS) => {
    if (newView === view.value)
      return

    navigationDirection.value = 'forward'
    history.value.push(newView)
    updateUrl(newView)
    updateAutoRedirect(newView)
  }

  const back = () => {
    if (history.value.length <= 1)
      return

    navigationDirection.value = 'backward'
    history.value.pop()

    const prevView = history.value[history.value.length - 1]
    console.log('prevView', prevView, history.value, history.value.length)
    updateUrl(prevView)
    updateAutoRedirect(prevView)
  }

  const clear = () => {
    navigationDirection.value = 'forward'
    history.value = [SIDEBAR_DEFAULT_VIEW]
    updateUrl(SIDEBAR_DEFAULT_VIEW)
    updateAutoRedirect(SIDEBAR_DEFAULT_VIEW)
  }

  return {
    refreshViewQuery,
    view,
    push,
    back,
    navigationDirection,
    clear,
    history: readonly(history),
  }
}

export default useSidebar
