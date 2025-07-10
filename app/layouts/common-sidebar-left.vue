<script setup lang="ts">
import AppLayout from './app.vue'

const route = useRoute()
route.meta.ignoreAutoRedirect = true
</script>

<template>
  <AppLayout>
    <CommonLeftSidebar>
      <slot />
    </CommonLeftSidebar>
  </AppLayout>
</template>
