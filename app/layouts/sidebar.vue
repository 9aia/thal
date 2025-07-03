<script setup lang="ts">
import AppLayout from './app.vue'
import SidebarRight from './sidebar-right.vue'
import { SIDEBAR_COMPONENTS } from '~/constants/sidebar'
import { isPastDueModalAlreadyShown, isPastDueModalOpen } from '~/store'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()
const sidebar = useSidebar()

const View = computed(() => {
  if (!sidebar.view.value)
    return null

  return SIDEBAR_COMPONENTS[sidebar.view.value]
})

const isSidebarAnimationEnabled = ref(true)

const RESOLVED_SIDEBAR_ANIMATION_NAME = 'fade-in-out-fast'

const sidebarAnimationName = computed(() => {
  if (!isSidebarAnimationEnabled.value) {
    return RESOLVED_SIDEBAR_ANIMATION_NAME
  }

  return sidebar.navigationDirection.value === 'forward' ? 'slide-right' : 'slide-left'
})
const animationEnabled = computed(() => {
  if (!sidebar.animate.value)
    return false

  return (isSidebarAnimationEnabled.value || sidebarAnimationName.value === RESOLVED_SIDEBAR_ANIMATION_NAME)
})

function handleSidebarAnimationResolve() {
  isSidebarAnimationEnabled.value = true
  sidebar.animate.value = true
}

onMounted(() => {
  const isPastDue = user.value?.subscriptionStatus === SubscriptionStatus.past_due

  if (isPastDue && !isPastDueModalAlreadyShown.value) {
    isPastDueModalOpen.value = true
  }

  isPastDueModalAlreadyShown.value = isPastDue
})

// TODO: Prevent the view when the path changes
const router = useRouter()
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
  <AppLayout>
    <div class="drawer lg:drawer-open">
      <input id="sidebar-drawer" v-model="sidebar.open.value" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh bg-white overflow-auto items-justify justify-center">
        <SidebarRight>
          <Transition name="fade-up">
            <slot />
          </Transition>
        </SidebarRight>
      </div>

      <div class="drawer-side z-50">
        <label for="sidebar-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between w-96 overflow-hidden relative bg-white">
          <Transition
            :css="animationEnabled"
            :name="sidebarAnimationName"
          >
            <!-- TODO: add view not found handling -->
            <Suspense
              timeout="0"
              @fallback="isSidebarAnimationEnabled = false"
              @pending="isSidebarAnimationEnabled = false"
              @resolve="handleSidebarAnimationResolve"
            >
              <component :is="View" v-if="View" />

              <template #fallback>
                <SidebarLoadingComponent />
              </template>
            </Suspense>
          </Transition>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
