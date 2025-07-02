import { SIDEBAR_COMPONENTS, SIDEBAR_ROOT_STATE, type SidebarView } from '~/constants/sidebar'

export interface SidebarState {
  view: SidebarView
  param?: string
}

export interface SidebarNavigateOptions {
  param?: string
  autoRedirect?: boolean
}

export type SidebarPathWithParam = `${SidebarView}=${string}`
export type SidebarFullPath = SidebarView | SidebarPathWithParam

const history = ref<SidebarFullPath[]>([sidebarStateToFullPath(SIDEBAR_ROOT_STATE)])
const navigationDirection = ref<'forward' | 'backward'>('forward')

function useSidebar() {
  const router = useRouter()
  const route = useRoute()

  const state = computed(() => {
    const queryKeys = Object.keys(route.query) as SidebarView[]

    let view: SidebarView = SIDEBAR_ROOT_STATE.view
    let param = SIDEBAR_ROOT_STATE.param

    for (const key of queryKeys) {
      if (SIDEBAR_COMPONENTS[key]) {
        view = key
        param = route.query[key] as string | undefined
        break
      }
    }

    return {
      view,
      param,
    }
  })
  const view = computed(() => state.value.view)
  const param = computed(() => state.value.param)

  // TODO: test this
  const updateAutoRedirect = (state: SidebarState) => {
    // const ACTIVE = state.view === SIDEBAR_ROOT_STATE.view ? undefined : null
    const redirectUrl = useCookie('redirect_url', { path: '/' })

    // const queryParams = new URLSearchParams()

    // Object.entries(route.query).forEach(([key, value]) => {
    //   if (value === undefined)
    //     return

    //   if (value === null)
    //     queryParams.set(key, 'a')

    //   queryParams.set(key, value as string)
    // })

    // if (state.param) {
    //   queryParams.set(state.view, state.param)
    // }
    // else {
    //   queryParams.set(state.view, '')
    // }
    let queryString = state.param ? `${state.view}=${state.param}` : state.view

    if (state.view === SIDEBAR_ROOT_STATE.view && !state.param)
      queryString = ''

    const newUrl = queryString.length > 0 ? `${route.path}?${queryString}` : route.path

    redirectUrl.value = newUrl
    console.log('newUrl', newUrl)
    // TODO: fix cookie update (look like there's something overwriting it after the first update)
  }

  const replaceRouterQuery = (state: SidebarState) => {
    const ACTIVE = state.view === SIDEBAR_ROOT_STATE.view ? undefined : null

    router.replace({
      query: {
        [state.view]: state.param || ACTIVE,
      },
      hash: route.hash,
    })
  }

  const initHistoryBasedOnInitialRoute = () => {
    // We assume that the initial route is ONLY the root state

    watch(() => route.query, () => {
      if (!view.value)
        return

      if (view.value !== SIDEBAR_ROOT_STATE.view || param.value !== SIDEBAR_ROOT_STATE.param) {
        const state: SidebarState = {
          view: view.value,
          param: param.value,
        }
        history.value.push(sidebarStateToFullPath(state))
        updateAutoRedirect(state)
      }
    }, { immediate: true, once: true })
  }

  const push = (newView: SidebarView, options?: SidebarNavigateOptions) => {
    if (newView === view.value)
      return

    navigationDirection.value = 'forward'

    const newState: SidebarState = {
      view: newView,
      param: options?.param,
    }

    history.value.push(sidebarStateToFullPath(newState))
    replaceRouterQuery(newState)

    if (options?.autoRedirect ?? true)
      updateAutoRedirect(newState)
  }

  const back = (options?: SidebarNavigateOptions) => {
    if (history.value.length <= 1)
      return

    navigationDirection.value = 'backward'
    history.value.pop()

    const lastFullPath = history.value[history.value.length - 1]
    const lastState = sidebarFullPathToState(lastFullPath)

    if (options?.param)
      lastState.param = options.param

    replaceRouterQuery(lastState)

    if (options?.autoRedirect ?? true)
      updateAutoRedirect(lastState)

    console.log('back', lastState)
  }

  const clear = (options?: SidebarNavigateOptions) => {
    navigationDirection.value = 'forward'

    const rootState: SidebarState = {
      view: SIDEBAR_ROOT_STATE.view,
      param: options?.param || SIDEBAR_ROOT_STATE.param,
    }

    history.value = [sidebarStateToFullPath(rootState)]

    replaceRouterQuery(rootState)

    if (options?.autoRedirect ?? true)
      updateAutoRedirect(rootState)
  }

  return {
    initHistoryBasedOnInitialRoute,
    view,
    param,
    push,
    back,
    navigationDirection,
    clear,
    history: readonly(history),
  }
}

export function sidebarStateToFullPath(state: SidebarState) {
  if (state.param)
    return `${state.view}=${state.param}` satisfies SidebarPathWithParam

  return state.view satisfies SidebarView
}

export function sidebarFullPathToState(fullPath: SidebarFullPath) {
  const [view, param] = fullPath.split('=') as [SidebarView, string | undefined]
  return { view, param } satisfies SidebarState
}

export default useSidebar

// TODO: remove this
watch(history, (newHistory) => {
  console.log('history', newHistory)
}, { deep: true, immediate: true })
