<script setup lang="ts">
import AppLayout from './app.vue'
import { LEFT_SIDEBAR_COMPONENTS, LEFT_SIDEBAR_ROOT_STATE } from '~/constants/sidebar'

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
