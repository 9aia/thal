<script setup lang="ts">
definePageMeta({
  layout: 'sidebar',
  middleware: 'premium',
})

useAutoRedirect()

onMounted(() => {
  console.log('DiscoverScene mounted')
})
</script>

<template>
  <DiscoverBody />
</template>
