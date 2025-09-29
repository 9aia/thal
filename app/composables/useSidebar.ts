import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { SidebarFullPath, SidebarNavigateOptions, SidebarState, SidebarView } from '~~/shared/types'

export const sidebarInjectionKey = Symbol('sidebar')

export function createUseSidebar(rootState: SidebarState, componentKeys: string[]) {
  const route = useRoute()
  const open = ref(getOpenFromQuery(route.query, componentKeys))
  const navigationDirection = ref<'forward' | 'backward'>('forward')
  const animate = ref(true)

  const history = ref<SidebarFullPath[]>(getSidebarHistoryFromQuery(route.query, rootState, componentKeys))
  const state = computed(() => {
    const lastHistoryItem = history.value[history.value.length - 1]
    return sidebarFullPathToState(lastHistoryItem)
  })

  const view = computed(() => state.value.view)
  const param = computed(() => state.value.param)

  function useSidebar() {
    const router = useRouter()
    const route = useRoute()
    const breakpoints = useBreakpoints(breakpointsTailwind)
    const isMobile = computed(() => breakpoints.smaller('lg').value)

    const updateAutoRedirect = (state?: SidebarState) => {
      state = state || getSidebarStateFromQuery(route.query, rootState, componentKeys)

      const redirectUrl = useCookie('redirect_url', { path: '/' })

      // TODO: keep the original query params, just change the current view and param
      let queryString = state.param ? `${state.view}=${state.param}` : state.view

      if (state.view === rootState.view && !state.param)
        queryString = ''

      const newUrl = queryString.length > 0 ? `${route.path}?${queryString}` : route.path

      redirectUrl.value = newUrl
    }

    const replaceRouterQuery = (state: SidebarState) => {
      const ACTIVE = state.view === rootState.view ? undefined : null

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

      const optionOpen = options?.open ?? true

      if (!optionOpen)
        return

      animate.value = !isMobile.value || (isMobile.value && open.value)
      open.value = true
    }

    const push = async (newView: SidebarView, options?: SidebarNavigateOptions) => {
      if (newView === state.value.view) {
        if (options?.open ?? true)
          open.value = true

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
          open.value = true

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

      const _rootState: SidebarState = {
        view: rootState.view,
        param: options?.param || rootState.param,
      }

      history.value = [sidebarStateToFullPath(_rootState)]

      activate(_rootState, options)
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

  return useSidebar
}

export function useSidebar(provideKey: string) {
  const use = inject<ReturnType<typeof createUseSidebar>>(provideKey)

  if (!use) {
    console.trace(`useSidebar must be used within a Sidebar with provideKey: ${provideKey}`)
    throw new Error(`useSidebar must be used within a Sidebar with provideKey: ${provideKey}`)
  }

  return use()
}
