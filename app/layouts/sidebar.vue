<script setup lang="ts">
import AppLayout from './app.vue'
import { SIDEBAR_COMPONENTS } from '~/constants/sidebar'
import { isChatListDrawerOpen, isPastDueModalAlreadyShown, isPastDueModalOpen, rightDrawer } from '~/store'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()
const sidebar = useSidebar()

const View = computed(() => {
  return SIDEBAR_COMPONENTS[sidebar.view.value]
})

onMounted(() => {
  const isPastDue = user.value?.subscriptionStatus === SubscriptionStatus.past_due

  if (isPastDue && !isPastDueModalAlreadyShown.value) {
    isPastDueModalOpen.value = true
  }

  isPastDueModalAlreadyShown.value = isPastDue
})

onUnmounted(() => {
  sidebar.clear()
})
</script>

<template>
  <AppLayout>
    <div class="drawer lg:drawer-open">
      <input id="chats-drawer" v-model="isChatListDrawerOpen" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh bg-white overflow-auto items-justify justify-center">
        <!-- #region Right Drawer -->
        <div class="drawer drawer-end">
          <input id="right-drawer" v-model="rightDrawer" type="checkbox" class="drawer-toggle">

          <div class="drawer-content flex flex-col h-dvh bg-white overflow-hidden relative">
            <Transition name="fade-up">
              <slot />
            </Transition>
          </div>

          <div class="drawer-side z-[100]">
            <label for="right-drawer" aria-label="close sidebar" class="drawer-overlay" />

            <div class="flex flex-col h-dvh items-end justify-center w-full sm:w-96">
              <ContactViewDrawer v-if="rightDrawer" />
            </div>
          </div>
        </div>
        <!-- #endregion -->
      </div>

      <div class="drawer-side z-50">
        <label for="chats-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between w-96 overflow-hidden relative">
          <Transition
            :name="sidebar.navigationDirection.value === 'forward' ? 'slide-right' : 'slide-left'"
          >
            <Suspense>
              <component :is="View" />

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
