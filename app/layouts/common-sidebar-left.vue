<script setup lang="ts">
import AppLayout from './app.vue'
import { LEFT_SIDEBAR_COMPONENTS, LEFT_SIDEBAR_ROOT_STATE } from '~/constants/sidebar'

const route = useRoute()
route.meta.ignoreAutoRedirect = true
</script>

<template>
  <AppLayout>
    <Sidebar
      :root-state="LEFT_SIDEBAR_ROOT_STATE"
      :component-keys="Object.keys(LEFT_SIDEBAR_COMPONENTS)"
    >
      <CommonLeftSidebar>
        <slot />
      </CommonLeftSidebar>
    </Sidebar>
  </AppLayout>
</template>
