<script setup lang="ts">
import './style.css'

const { state: localeModalState } = useLocaleModal()
const { state: whatsNewModalState } = useWhatsNewModal()

useInternetConnectionIndicator()
</script>

<template>
  <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right, #5eead4 0%, #14b8a6 100%)"
    error-color="repeating-linear-gradient(to right, #f87171 0%, #ef4444 100%)"
  />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toast />

  <WhatsNewModal v-model="whatsNewModalState" />
  <LocaleModal v-model="localeModalState" />
</template>
