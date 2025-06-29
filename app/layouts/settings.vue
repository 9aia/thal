<script setup lang="ts">
import { t } from '@psitta/vue'
import { useEventListener } from '@vueuse/core'
import { isPastDueModalAlreadyShown, isPastDueModalOpen, isRootDrawerOpen, rightDrawer } from '~/store'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()

onMounted(() => {
  const isPastDue = user.value?.subscriptionStatus === SubscriptionStatus.past_due

  if (isPastDue && !isPastDueModalAlreadyShown.value) {
    isPastDueModalOpen.value = true
  }

  isPastDueModalAlreadyShown.value = isPastDue
})

const navigationDirection = ref<'forward' | 'back'>('forward')

useEventListener(window, 'popstate', () => {
  navigationDirection.value = 'back'
})
</script>

<template>
  <div class="w-full mx-auto max-w-[1700px] h-full">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" v-model="isRootDrawerOpen" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh">
        <div class="drawer drawer-end">
          <input id="my-drawer-4" v-model="rightDrawer" type="checkbox" class="drawer-toggle">

          <div class="drawer-content flex flex-col h-dvh bg-white overflow-auto items-justify justify-center">
            <SettingsContent
              class="px-4 mb-6"
              :title="t('Settings')"
              icon="material-symbols:settings-rounded"
              icon-class="text-gray-100"
            />
          </div>
          <div class="drawer-side z-[100]">
            <slot name="drawer-right" />
          </div>
        </div>
      </div>

      <div class="drawer-side z-50">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between w-96">
          <Transition
            :name="navigationDirection === 'forward' ? 'slide-right' : 'slide-left'"
            @after-leave="navigationDirection = 'forward'"
          >
            <slot />
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
</style>
