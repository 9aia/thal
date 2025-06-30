<script setup lang="ts">
import { t } from '@psitta/vue'
import AppLayout from '~/layouts/app.vue'
import { isPastDueModalAlreadyShown, isPastDueModalOpen } from '~/store'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()
const navigationDirection = useNavigationDirection()

onMounted(() => {
  const isPastDue = user.value?.subscriptionStatus === SubscriptionStatus.past_due

  if (isPastDue && !isPastDueModalAlreadyShown.value) {
    isPastDueModalOpen.value = true
  }

  isPastDueModalAlreadyShown.value = isPastDue
})
</script>

<template>
  <AppLayout>
    <div class="flex w-full">
      <div class="flex flex-col h-dvh justify-between w-full sm:w-96 relative overflow-hidden">
        <Transition
          :name="navigationDirection === 'forward' ? 'slide-right' : 'slide-left'"
          @after-leave="navigationDirection = 'forward'"
        >
          <slot />
        </Transition>
      </div>

      <div class="hidden sm:flex flex-col sm:flex-1 h-dvh bg-white overflow-auto items-justify justify-center">
        <SettingsContent
          class="px-4 mb-6 w-full"
          :title="t('Settings')"
          icon="material-symbols:settings-rounded"
          icon-class="text-gray-100"
        />
      </div>
    </div>
  </AppLayout>
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
