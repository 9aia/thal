<script setup lang="ts">
import AppLayout from '~/layouts/app.vue'

definePageMeta({
  layout: false,
  middleware: 'premium',
  showChatList: true,
})

useAutoRedirect()
</script>

<template>
  <AppLayout>
    <template #side>
      <NewChat />
    </template>
    <template #content>
      <Welcome />
    </template>
  </AppLayout>
</template>
