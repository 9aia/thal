<script setup lang="ts">
import AppLayout from "~/layouts/app.vue"

definePageMeta({
  layout: false,
  middleware: "premium",
})
</script>

<template>
  <AppLayout>
    <template #side>
      <NewChat />
    </template>
    <template #content>
      <HomeWelcome />
    </template>
  </AppLayout>
</template>
