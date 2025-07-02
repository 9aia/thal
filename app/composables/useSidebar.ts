import type { LocationQuery } from 'vue-router'
import { SIDEBAR_COMPONENTS, SIDEBAR_ROOT_STATE, type SidebarView } from '~/constants/sidebar'

export interface SidebarState {
  view: SidebarView
  param?: string
}

export interface SidebarNavigateOptions {
  param?: string
  autoRedirect?: boolean
  animate?: boolean
}

export type SidebarPathWithParam = `${SidebarView}=${string}`
export type SidebarFullPath = SidebarView | SidebarPathWithParam

const open = ref(true)
const history = ref<SidebarFullPath[]>([sidebarStateToFullPath(SIDEBAR_ROOT_STATE)])
const navigationDirection = ref<'forward' | 'backward'>('forward')
const animate = ref(true)

const state = ref<SidebarState>(SIDEBAR_ROOT_STATE)
const view = computed(() => state.value.view)
const param = computed(() => state.value.param)

function getQueryViewAndParam(newQuery: LocationQuery) {
  const queryKeys = Object.keys(newQuery) as SidebarView[]

  let view: SidebarView = SIDEBAR_ROOT_STATE.view
  let param = SIDEBAR_ROOT_STATE.param

  for (const key of queryKeys) {
    if (SIDEBAR_COMPONENTS[key]) {
      view = key
      param = newQuery[key] as string | undefined
      break
    }
  }

  return { view, param }
}

function updateState(newQuery: LocationQuery) {
  const { view, param } = getQueryViewAndParam(newQuery)

  state.value = {
    view,
    param,
  }
}

function useSidebar() {
  const router = useRouter()
  const route = useRoute()

  const updateAutoRedirect = (state: SidebarState) => {
    const redirectUrl = useCookie('redirect_url', { path: '/' })

    // TODO: keep the original query params, just change the current view and param
    let queryString = state.param ? `${state.view}=${state.param}` : state.view

    if (state.view === SIDEBAR_ROOT_STATE.view && !state.param)
      queryString = ''

    const newUrl = queryString.length > 0 ? `${route.path}?${queryString}` : route.path

    redirectUrl.value = newUrl
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

  const init = () => {
    // Set the state based on the query when it's loaded for the first time, eg. when the user access the build-character view directly via the URL
    watch(() => route.query, (newQuery) => {
      updateState(newQuery)

      if (!view.value)
        return

      // We assume that the initial route is ONLY the root state

      if (view.value !== SIDEBAR_ROOT_STATE.view || param.value !== SIDEBAR_ROOT_STATE.param) {
        const state: SidebarState = {
          view: view.value,
          param: param.value,
        }

        navigationDirection.value = 'backward'
        history.value.push(sidebarStateToFullPath(state))
        updateAutoRedirect(state)
      }
    }, { immediate: true, once: true })

    // Update the sidebar state when the route query changes
    watch(() => route.query, (newQuery) => {
      updateState(newQuery)
    })
  }

  const push = (newView: SidebarView, options?: SidebarNavigateOptions) => {
    if (newView === view.value)
      return

    animate.value = options?.animate ?? true
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
    console.log('back', history.value)
    if (history.value.length <= 1)
      return

    console.log('back', history.value)

    animate.value = options?.animate ?? true
    navigationDirection.value = 'backward'
    history.value.pop()

    const lastFullPath = history.value[history.value.length - 1]
    const lastState = sidebarFullPathToState(lastFullPath)

    if (options?.param)
      lastState.param = options.param

    replaceRouterQuery(lastState)

    if (options?.autoRedirect ?? true)
      updateAutoRedirect(lastState)
  }

  const clear = (options?: SidebarNavigateOptions) => {
    animate.value = options?.animate ?? true
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

  const toggle = () => {
    open.value = !open.value
  }

  return {
    init,
    open,
    toggle,
    view,
    param,
    push,
    back,
    navigationDirection,
    clear,
    animate,
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

watch(history, (newHistory) => {
  console.log('history', newHistory)
}, { deep: true, immediate: true })

watch(view, (newView) => {
  console.log('view', newView)
})
