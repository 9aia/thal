<script setup lang="ts">
import type { SidebarFullPath, SidebarState, SidebarStore } from '~/types'

const props = defineProps<{
  rootState: SidebarState
  componentKeys: string[]
}>()

const route = useRoute()
const open = ref(getOpenFromQuery(route.query, props.componentKeys))
const navigationDirection = ref<'forward' | 'backward'>('forward')
const animate = ref(true)

const history = ref<SidebarFullPath[]>(getSidebarHistoryFromQuery(route.query, props.rootState, props.componentKeys))
const state = computed(() => {
  const lastHistoryItem = history.value[history.value.length - 1]
  return sidebarFullPathToState(lastHistoryItem)
})

// Prevent the view when the path changes
// router.beforeEach((to, from) => {
//   const LEFT_SIDEBAR_COMPONENT_KEYS = Object.keys(LEFT_SIDEBAR_COMPONENTS)

//   console.log('to', to.fullPath, 'from', from.fullPath)

//   for (const key of LEFT_SIDEBAR_COMPONENT_KEYS) {
//     if (from.query[key] !== undefined && to.query[key] === undefined) {
//       to.query[key] = from.query[key]
//       break
//     }
//   }
// })

provide<SidebarStore>(sidebarInjectionKey, {
  open,
  ROOT_STATE: props.rootState,
  COMPONENT_KEYS: props.componentKeys,
  history,
  navigationDirection,
  state,
  view: computed(() => state.value.view),
  param: computed(() => state.value.param),
  animate,
})
</script>

<template>
  <slot />
</template>
