<script setup lang="ts">
import "./style.css"
import Toast from "~~/layers/ui/components/feedback/Toast.vue"

const { state: localeModalState } = useLocaleModal()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toast />

  <LocaleModal v-model="localeModalState" />
</template>
