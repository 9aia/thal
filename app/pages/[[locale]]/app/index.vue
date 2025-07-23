<script setup lang="ts">
definePageMeta({
  layout: 'common-sidebar-left',
  middleware: 'auth',
  pageTransitionType: 'fade-up',
})
</script>

<template>
  <Home />
</template>
