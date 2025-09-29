import type { LocationQuery } from 'vue-router'
import type { SidebarFullPath, SidebarPathWithParam, SidebarState, SidebarView } from '#shared/types'

export function sidebarStateToFullPath<T extends SidebarView>(state: SidebarState<T>) {
  if (state.param)
    return `${state.view}=${state.param}` satisfies SidebarPathWithParam<T>

  return state.view
}

export function sidebarFullPathToState<T extends SidebarView>(fullPath: SidebarFullPath<T>) {
  const [view, param] = fullPath.split('=') as [T, string | undefined]
  return { view, param } satisfies SidebarState<T>
}

export function getOpenFromQuery(query: LocationQuery, componentKeys: string[]) {
  return componentKeys.some(key => query[key] !== undefined)
}

export function getSidebarStateFromQuery<T extends SidebarView>(
  newQuery: LocationQuery,
  rootState: SidebarState<T>,
  componentKeys: string[],
) {
  const queryKeys = Object.keys(newQuery) as string[]

  let view: T = rootState.view
  let param = rootState.param

  for (const key of queryKeys) {
    if (componentKeys.includes(key)) {
      view = key as T
      param = newQuery[key] as string | undefined
      break
    }
  }

  return { view, param }
}

export function getSidebarHistoryFromQuery<T extends string>(
  query: LocationQuery,
  rootState: SidebarState<T>,
  componentKeys: string[],
) {
  const { view, param } = getSidebarStateFromQuery(query, rootState, componentKeys)

  if (view !== rootState.view) {
    return [
      sidebarStateToFullPath(rootState),
      sidebarStateToFullPath({ view, param }),
    ]
  }

  if (param !== rootState.param) {
    return [
      sidebarStateToFullPath({ view: rootState.view, param }),
    ]
  }

  return [sidebarStateToFullPath(rootState)]
}
