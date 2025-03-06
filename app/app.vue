<script setup lang="ts">
import { drawers, isExpiredModalOpen, isRootDrawerOpen } from '~/store'
import './style.css'

const { state: localeModalState } = useLocaleModal()
const { state: whatsNewModalState } = useWhatsNewModal()

useInternetConnectionIndicator()

const route = useRoute()

isRootDrawerOpen.value = !!route.meta.showChatList
isExpiredModalOpen.value = route.query.past_due === 'true'

type DrawersKey = keyof typeof drawers

type Drawers = DrawersKey[]

onMounted(() => {
  const drawer = route.query.drawer as DrawersKey

  if (!drawer) {
    return
  }

  const mapping: Record<string, DrawersKey> = {
    create: 'personaBuilder',
    save: 'manageContact',
    add: 'newChat',
    list: 'myPersonas',
  }

  const mappedDrawer = mapping[drawer] || drawer

  const availableDrawers = Object.keys(drawers) as Drawers

  if (!availableDrawers.includes(mappedDrawer)) {
    return
  }

  drawers[mappedDrawer] = true
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

  <WhatsNewModal v-model="whatsNewModalState" />
  <LocaleModal v-model="localeModalState" />
  <ExpiredPlanModal v-model="isExpiredModalOpen" />
  <AccountReactivatedModal />
</template>
