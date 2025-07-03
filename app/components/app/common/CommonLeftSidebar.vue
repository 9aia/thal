<script setup lang="ts">
import { SIDEBAR_COMPONENTS, SIDEBAR_ROOT_STATE } from '~/constants/sidebar'
</script>

<template>
  <Sidebar
    :root-state="SIDEBAR_ROOT_STATE"
    :component-keys="Object.keys(SIDEBAR_COMPONENTS)"
  >
    <CommonLeftSidebarContent>
      <slot />
    </CommonLeftSidebarContent>
  </Sidebar>
</template>
