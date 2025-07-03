<script setup lang="ts">
definePageMeta({
  layout: 'common-sidebar-left',
  middleware: 'premium',
})

useAutoRedirect()
</script>

<template>
  <DiscoverBody />
</template>
