import { SIDEBAR_COMPONENTS, SIDEBAR_DEFAULT_VIEW, type SidebarView } from '~/constants/sidebar'
import { stringifyQuery } from '~/utils/vue'

const history = ref<SidebarView[]>([])
const navigationDirection = ref<'forward' | 'backward'>('forward')

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

  const activate = (view: keyof typeof SIDEBAR_COMPONENTS) => {
    const active = view === SIDEBAR_DEFAULT_VIEW ? undefined : null

    router.replace({
      query: {
        [view]: active,
      },
      hash: route.hash,
    })
  }

  const refreshViewQuery = () => {
    activate(view.value)
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
    activate(newView)
    updateAutoRedirect(newView)
  }

  const back = () => {
    navigationDirection.value = 'backward'

    if (history.value.length === 0)
      history.value = [SIDEBAR_DEFAULT_VIEW]
    else
      history.value.pop()

    const lastView = history.value[history.value.length - 1]
    activate(lastView || SIDEBAR_DEFAULT_VIEW)
    updateAutoRedirect(lastView)
  }

  const clear = () => {
    navigationDirection.value = 'backward'
    history.value = [SIDEBAR_DEFAULT_VIEW]
    activate(SIDEBAR_DEFAULT_VIEW)
    updateAutoRedirect(SIDEBAR_DEFAULT_VIEW)
  }

  return {
    refreshViewQuery,
    view,
    push,
    back,
    navigationDirection: readonly(navigationDirection),
    clear,
    history: readonly(history),
  }
}

export default useSidebar
