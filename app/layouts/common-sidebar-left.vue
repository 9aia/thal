<script setup lang="ts">
import AppLayout from './app.vue'
</script>

<template>
  <AppLayout>
    <CommonLeftSidebar>
      <slot />
    </CommonLeftSidebar>
  </AppLayout>
</template>
