<script setup lang="ts">
definePageMeta({
  layout: 'sidebar',
  middleware: 'premium',
})

useAutoRedirect()
</script>

<template>
  <DiscoverBody />
</template>
