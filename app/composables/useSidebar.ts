import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { SIDEBAR_ROOT_STATE, type SidebarView } from '~/constants/sidebar'

export const sidebarInjectionKey = Symbol('sidebar')

export interface SidebarStore {
  open: Ref<boolean>
  history: Ref<SidebarFullPath[]>
  navigationDirection: Ref<'forward' | 'backward'>
  animate: Ref<boolean>
  state: Ref<SidebarState>
  view: ComputedRef<SidebarView>
  param: ComputedRef<string | undefined>

  disableAnimation: () => void
  handleSidebarAnimationResolve: () => void
  animationEnabled: ComputedRef<boolean>
  sidebarAnimationName: ComputedRef<string>
}

export interface SidebarState {
  view: SidebarView
  param?: string
}

export interface SidebarNavigateOptions {
  param?: string
  autoRedirect?: boolean
  open?: boolean
}

export type SidebarPathWithParam = `${SidebarView}=${string}`
export type SidebarFullPath = SidebarView | SidebarPathWithParam

export function useUpdateAutoRedirect() {
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

  return updateAutoRedirect
}

function useSidebar() {
  const router = useRouter()
  const route = useRoute()
  const updateAutoRedirect = useUpdateAutoRedirect()
  const sidebar = inject<SidebarStore>(sidebarInjectionKey)
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = computed(() => breakpoints.smaller('lg').value)

  if (!sidebar)
    throw new Error('useSidebar must be used inside a Sidebar component')

  const { open, history, navigationDirection, animate, view, param, disableAnimation, handleSidebarAnimationResolve, animationEnabled, sidebarAnimationName } = sidebar

  const replaceRouterQuery = (state: SidebarState) => {
    const ACTIVE = state.view === SIDEBAR_ROOT_STATE.view ? undefined : null

    // TODO: keep the original query params, just change the current view and param
    router.replace({
      query: {
        [state.view]: state.param || ACTIVE,
      },
      hash: route.hash,
    })
  }

  const activate = (newState: SidebarState, options?: SidebarNavigateOptions) => {
    replaceRouterQuery(newState)

    if (options?.autoRedirect ?? true)
      updateAutoRedirect(newState)

    if (isMobile.value && !sidebar.open.value) {
      sidebar.animate.value = false
    }
    if (!isMobile.value) {
      sidebar.animate.value = true
    }

    if (options?.open ?? true)
      sidebar.open.value = true
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
    activate(newState, options)
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

    activate(lastState, options)
  }

  const clear = (options?: SidebarNavigateOptions) => {
    navigationDirection.value = 'forward'

    const rootState: SidebarState = {
      view: SIDEBAR_ROOT_STATE.view,
      param: options?.param || SIDEBAR_ROOT_STATE.param,
    }

    history.value = [sidebarStateToFullPath(rootState)]

    activate(rootState, options)
  }

  const toggle = () => {
    open.value = !open.value
  }

  return {
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
    disableAnimation,
    handleSidebarAnimationResolve,
    animationEnabled,
    sidebarAnimationName,
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
