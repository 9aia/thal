<script setup lang="ts">
import { drawers, isPastDueModalOpen, isRootDrawerOpen, openContactView } from '~/store'
import { usernameSchema } from '~~/db/schema'

useInternetConnectionIndicator()

const { state: localeModalState } = useLocaleModal()
const route = useRoute()
const toast = useToast()

const spaReferrer = useSpaReferrer()
spaReferrer.install()

type DrawersKey = keyof typeof drawers
type Drawers = DrawersKey[]

function openDrawersFromQuery() {
  const drawer = route.query.drawer as DrawersKey

  if (!drawer) {
    return
  }

  const mapping: Record<string, DrawersKey> = {
    create: 'characterBuilder',
    save: 'contactManager',
    add: 'newChat',
  }

  const mappedDrawer = mapping[drawer] || drawer

  const availableDrawers = Object.keys(drawers) as Drawers

  if (!availableDrawers.includes(mappedDrawer)) {
    return
  }

  isRootDrawerOpen.value = true
  drawers[mappedDrawer] = true
}

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
  openDrawersFromQuery()
  openContactViewByQuery()
})
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
