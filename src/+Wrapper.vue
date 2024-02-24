<script setup lang="ts">
import Toast from '#lib/daisy/components/feedback/Toast.vue'
import '#lib/daisy/styles/style.css'
import Translate from '#lib/i18n/components/Translate.vue'
import { usePageContext } from '#lib/vike/composables/usePageContext'
import { provide } from 'vue'
import './i18n'

const c = usePageContext()
provide('__locale', c.locale)
</script>

<template>
  <Toast />
  <slot />

  <Translate />
</template>
