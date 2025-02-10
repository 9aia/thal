<script setup lang="ts">
import { isRootDrawerOpen } from '~/store'
import './style.css'

const { state: localeModalState } = useLocaleModal()
const { state: whatsNewModalState } = useWhatsNewModal()

useInternetConnectionIndicator()

const route = useRoute()

isRootDrawerOpen.value = !!route.meta.showChatList
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
  <AccountReactivatedModal />
</template>
