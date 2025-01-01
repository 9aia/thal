<script setup lang="ts">
import './style.css'
import Toast from '~~/layers/ui/components/feedback/Toast.vue'

const { state: localeModalState } = useLocaleModal()
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

  <LocaleModal v-model="localeModalState" />
</template>
