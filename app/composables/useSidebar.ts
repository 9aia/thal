import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { LEFT_SIDEBAR_COMPONENTS } from '~/constants/sidebar'
import type { SidebarNavigateOptions, SidebarState, SidebarStore, SidebarView } from '~/types'

export const sidebarInjectionKey = Symbol('sidebar')

function useSidebar() {
  const sidebar = inject<SidebarStore>(sidebarInjectionKey)
  if (!sidebar)
    throw new Error('useSidebar must be used inside a Sidebar component')

  const router = useRouter()
  const route = useRoute()
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = computed(() => breakpoints.smaller('lg').value)

  const { open, history, navigationDirection, animate, view, param, state, ROOT_STATE, COMPONENT_KEYS } = sidebar

  const updateAutoRedirect = (state?: SidebarState) => {
    state = state || getSidebarStateFromQuery(route.query, ROOT_STATE, COMPONENT_KEYS)

    const redirectUrl = useCookie('redirect_url', { path: '/' })

    // TODO: keep the original query params, just change the current view and param
    let queryString = state.param ? `${state.view}=${state.param}` : state.view

    if (state.view === ROOT_STATE.view && !state.param)
      queryString = ''

    const newUrl = queryString.length > 0 ? `${route.path}?${queryString}` : route.path

    redirectUrl.value = newUrl
  }

  const replaceRouterQuery = (state: SidebarState) => {
    const ACTIVE = state.view === ROOT_STATE.view ? undefined : null

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

    const open = options?.open ?? true

    if (!open)
      return

    sidebar.animate.value = !isMobile.value || (isMobile.value && sidebar.open.value)
    sidebar.open.value = true
  }

  const push = async (newView: SidebarView, options?: SidebarNavigateOptions) => {
    if (newView === view.value) {
      if (options?.open ?? true)
        sidebar.open.value = true

      return
    }

    navigationDirection.value = 'forward'
    await nextTick()

    const newState: SidebarState = {
      view: newView,
      param: options?.param,
    }
    history.value.push(sidebarStateToFullPath(newState))
    activate(newState, options)
  }

  const back = async (options?: SidebarNavigateOptions) => {
    if (history.value.length <= 1) {
      if (options?.open ?? true)
        sidebar.open.value = true

      return
    }

    navigationDirection.value = 'backward'
    await nextTick()
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
      view: ROOT_STATE.view,
      param: options?.param || ROOT_STATE.param,
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
    history: readonly(history),
    view,
    param,
    state,
    push,
    back,
    clear,
    navigationDirection,
    animate,
    updateAutoRedirect,
  }
}

export default useSidebar
