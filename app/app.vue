<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { hydrateOnIdle } from 'vue'
import { isPastDueModalOpen, isWhatsNewModalOpen, openContactView } from '~/store'
import { usernameSchema } from '~~/db/schema'

useInternetConnectionIndicator()

const { state: localeModalState } = useLocaleModal()
const route = useRoute()
const toast = useToast()

// #region Navigation

const navigationDirection = useNavigationDirection()

watch(route, () => {
  navigationDirection.value = 'forward'
}, { immediate: true })

useEventListener(window, 'popstate', () => {
  navigationDirection.value = 'back'
})

// #endregion

// #region Drawers

function openContactViewByQuery() {
  const usernameQueryValue = route.query['contact-info']

  if (!usernameQueryValue) {
    return
  }

  const usernameValidation = usernameSchema.safeParse(usernameQueryValue)

  if (!usernameValidation.success) {
    toast.error('Failed to open contact view by username query. Invalid username. Usage: /?contact-info=username')
    return
  }

  const username = usernameValidation.data
  openContactView(username)
}

onMounted(() => {
  openContactViewByQuery()
})

// #endregion

const WhatsNewModal = defineAsyncComponent({
  loader: () => import('~/modals/WhatsNewModal.vue'),
  hydrate: hydrateOnIdle(),
})

const LocaleModal = defineAsyncComponent({
  loader: () => import('~/modals/LocaleModal.vue'),
  hydrate: hydrateOnIdle(),
})

const PastDuePlanModal = defineAsyncComponent({
  loader: () => import('~/modals/PastDuePlanModal.vue'),
  hydrate: hydrateOnIdle(),
})

const AccountReactivatedModal = defineAsyncComponent({
  loader: () => import('~/modals/AccountReactivatedModal.vue'),
  hydrate: hydrateOnIdle(),
})

const CommonToast = defineAsyncComponent({
  loader: () => import('~/components/app/common/CommonToast.vue'),
  hydrate: hydrateOnIdle(),
})

const pageAnimation = computed(() => {
  if (route.meta.pageTransitionType === 'fade-in-out') {
    return 'fade-in-out'
  }

  if (route.meta.pageTransitionType === 'slide') {
    return navigationDirection.value === 'forward' ? 'slide-tl' : 'slide-tr'
  }

  return undefined
})
</script>

<template>
  <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right, #00ffff 0%, #0000ff 100%)"
    error-color="repeating-linear-gradient(to right, #ff0000 0%, #ff6600 100%)"
  />

  <div class="relative">
    <NuxtLayout>
      <div class="overflow-hidden">
        <NuxtPage :transition="{ name: pageAnimation }" />
      </div>
    </NuxtLayout>
  </div>

  <CommonToast />

  <LocaleModal v-model="localeModalState" />
  <PastDuePlanModal v-model="isPastDueModalOpen" />
  <WhatsNewModal v-model="isWhatsNewModalOpen" />
  <AccountReactivatedModal />
</template>

<style>
@reference '~/assets/css/main.css';

.slide-tr-leave-active, .slide-tl-enter-active, .slide-tr-enter-active, .slide-tl-leave-active {
  @apply transition-transform duration-200 ease-linear;
}

.slide-tl-enter-from { transform: translateX(100%); }
.slide-tl-enter-to { transform: translateX(0%); }
.slide-tl-leave-from { transform: translateX(0%); }
.slide-tl-leave-to { transform: translateX(-100%); }

.slide-tr-enter-from { transform: translateX(-100%); }
.slide-tr-enter-to { transform: translateX(0%); }
.slide-tr-leave-from { transform: translateX(0%); }
.slide-tr-leave-to { transform: translateX(100%); }

.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-enter-active, .fade-up-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.fade-in-out-enter-active,
.fade-in-out-leave-active {
  @apply transition-opacity duration-500 ease-in-out;
}

.fade-in-out-enter-from,
.fade-in-out-leave-to {
  opacity: 0;
}

.fade-in-out-fast-enter-active,
.fade-in-out-fast-leave-active {
  @apply transition-opacity duration-300 ease-in-out;
}

.fade-in-out-fast-enter-from,
.fade-in-out-fast-leave-to {
  opacity: 0;
}
</style>
