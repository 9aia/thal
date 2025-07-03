<script setup lang="ts">
import type { LocationQuery } from 'vue-router'
import type { SidebarView } from '~/constants/sidebar'

const props = defineProps<{
  rootState: SidebarState
  componentKeys: string[]
}>()

const route = useRoute()
const updateAutoRedirect = useUpdateAutoRedirect()

const open = ref(true)
const navigationDirection = ref<'forward' | 'backward'>('forward')
const animate = ref(true)

// TODO: init history using router.query
const history = ref<SidebarFullPath[]>([sidebarStateToFullPath(props.rootState)])
const state = ref<SidebarState>(props.rootState)

const view = computed(() => state.value.view)
const param = computed(() => state.value.param)

const isSidebarAnimationEnabled = ref(true)

const RESOLVED_SIDEBAR_ANIMATION_NAME = 'fade-in-out-fast'

const sidebarAnimationName = computed(() => {
  if (!isSidebarAnimationEnabled.value) {
    return RESOLVED_SIDEBAR_ANIMATION_NAME
  }

  return navigationDirection.value === 'forward' ? 'slide-right' : 'slide-left'
})
const animationEnabled = computed(() => {
  if (!animate.value)
    return false

  return (isSidebarAnimationEnabled.value || sidebarAnimationName.value === RESOLVED_SIDEBAR_ANIMATION_NAME)
})

function handleSidebarAnimationResolve() {
  isSidebarAnimationEnabled.value = true
  animate.value = true
}

function disableAnimation() {
  isSidebarAnimationEnabled.value = false
}

provide<SidebarStore>(sidebarInjectionKey, {
  open,
  history,
  navigationDirection,
  animate,
  disableAnimation,
  handleSidebarAnimationResolve,
  animationEnabled,
  sidebarAnimationName,
  state,
  view,
  param,
})

function getQueryViewAndParam(newQuery: LocationQuery) {
  const queryKeys = Object.keys(newQuery) as SidebarView[]

  let view: SidebarView = props.rootState.view
  let param = props.rootState.param

  for (const key of queryKeys) {
    if (props.componentKeys.includes(key)) {
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

function init() {
  // Set the state based on the query when it's loaded for the first time, eg. when the user access the build-character view directly via the URL
  watch(() => route.query, (newQuery) => {
    updateState(newQuery)

    if (!view.value)
      return

    // We assume that the initial route is ONLY the root state

    if (view.value !== props.rootState.view || param.value !== props.rootState.param) {
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

onMounted(() => {
  // init()
})

init()

// TODO: Prevent the view when the path changes
// const router = useRouter()
// Prevent the view when the path changes
// router.beforeEach((to, from) => {
//   const SIDEBAR_KEYS = Object.keys(SIDEBAR_COMPONENTS)

//   console.log('to', to.fullPath, 'from', from.fullPath)

//   for (const key of SIDEBAR_KEYS) {
//     if (from.query[key] !== undefined && to.query[key] === undefined) {
//       // to.query[key] = from.query[key]
//     }
//   }
// })
</script>

<template>
  <slot />
</template>
