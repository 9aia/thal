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

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toast />

  <LocaleModal v-model="localeModalState" />
  <PastDuePlanModal v-model="isPastDueModalOpen" />
  <AccountReactivatedModal />
</template>
