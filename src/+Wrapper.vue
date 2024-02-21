<script setup lang="ts">
import Toast from '#lib/daisy/components/feedback/Toast.vue'
import '#lib/daisy/styles/style.css'
import Translate from '#lib/i18n/components/Translate.vue'
import './i18n'
</script>

<template>
  <Toast />
  <slot />

  <Translate />
</template>
