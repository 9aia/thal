<script setup lang="ts">
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
</script>

<template>
  <div class="w-full mx-auto max-w-[1700px] h-full">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" v-model="isChatListDrawerOpen" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh bg-white overflow-auto items-justify justify-center">
        <!-- #region Right Drawer -->
        <div class="drawer drawer-end">
          <input id="my-drawer-4" v-model="rightDrawer" type="checkbox" class="drawer-toggle">

          <div class="drawer-content flex flex-col h-dvh bg-white overflow-hidden relative">
            <Transition name="fade-up">
              <slot />
            </Transition>
          </div>

          <div class="drawer-side z-[100]">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay" />

            <div class="flex flex-col h-dvh items-end justify-center w-full sm:w-96">
              <ContactViewDrawer v-if="rightDrawer" />
            </div>
          </div>
        </div>
        <!-- #endregion -->
      </div>

      <div class="drawer-side z-50">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between w-96 overflow-hidden relative">
          <Transition
            :name="sidebar.navigationDirection.value === 'forward' ? 'slide-right' : 'slide-left'"
          >
            <component :is="View" />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.slide-right-leave-from, .slide-left-leave-from, .slide-left-enter-to, .slide-right-enter-to {
  transform: translateX(0);
}
.slide-right-leave-active, .slide-left-enter-active, .slide-right-enter-active, .slide-left-leave-active {
  @apply transition-transform duration-200 ease-linear;
}
.slide-right-leave-to, .slide-left-enter-from {
  transform: translateX(-100%);
}
.slide-left-leave-to, .slide-right-enter-from {
  transform: translateX(100%);
}

.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.2s ease-in-out;
}
</style>
