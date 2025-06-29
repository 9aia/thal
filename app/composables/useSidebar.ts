import { SIDEBAR_COMPONENTS, SIDEBAR_DEFAULT_VIEW, type SidebarView } from '~/constants/sidebar'

const history = ref<SidebarView[]>([])
const navigationDirection = ref<'forward' | 'backward'>('forward')

function useSidebar() {
  const router = useRouter()
  const route = useRoute()

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

    router.push({
      query: {
        [view]: active,
      },
    })
  }

  const refreshViewQuery = () => {
    activate(view.value)
  }

  const push = (view: keyof typeof SIDEBAR_COMPONENTS) => {
    navigationDirection.value = 'forward'
    history.value.push(view)
    activate(view)
  }

  const back = () => {
    navigationDirection.value = 'backward'

    if (history.value.length === 0)
      history.value = [SIDEBAR_DEFAULT_VIEW]
    else
      history.value.pop()

    const lastView = history.value[history.value.length - 1]
    activate(lastView || SIDEBAR_DEFAULT_VIEW)
  }

  const clear = () => {
    navigationDirection.value = 'backward'
    history.value = [SIDEBAR_DEFAULT_VIEW]
    activate(SIDEBAR_DEFAULT_VIEW)
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
