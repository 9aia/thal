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
    <template #content>
      <DiscoverBody />
    </template>
  </AppLayout>
</template>
