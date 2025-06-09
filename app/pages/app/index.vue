<script setup lang="ts">
import AppLayout from '~/layouts/app.vue'

definePageMeta({
  layout: false,
  middleware: 'premium',
})

useAutoRedirect()
</script>

<template>
  <AppLayout>
    <template #side>
      <NewChatDrawer />
    </template>
    <template #content>
      <Home />
    </template>
  </AppLayout>
</template>
