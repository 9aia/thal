<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { isPastDueModalOpen, openContactView } from '~/store'
import { usernameSchema } from '~~/db/schema'

useInternetConnectionIndicator()
const spaReferrer = useSpaReferrer()
spaReferrer.install()

const { state: localeModalState } = useLocaleModal()
const route = useRoute()
const toast = useToast()
const sidebar = useSidebar()

// #region Navigation

const navigationDirection = useNavigationDirection()

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

// #region Sidebar

watch(route, () => {
  sidebar.refreshViewQuery()
})

// #endregion
</script>

<template>
  <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right, #00ffff 0%, #0000ff 100%)"
    error-color="repeating-linear-gradient(to right, #ff0000 0%, #ff6600 100%)"
  />

  <div class="relative">
    <NuxtLayout>
      <div class="overflow-hidden">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>

  <Toast />

  <LocaleModal v-model="localeModalState" />
  <PastDuePlanModal v-model="isPastDueModalOpen" />
  <AccountReactivatedModal />
</template>

<style>
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
  @apply transition-all duration-200 ease-in-out;
}

.fade-in-out-enter-active,
.fade-in-out-leave-active {
  @apply transition-opacity duration-900 ease-in-out;
}

.fade-in-out-enter-from,
.fade-in-out-leave-to {
  opacity: 0;
}
</style>
