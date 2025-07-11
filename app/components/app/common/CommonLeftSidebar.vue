<script setup lang="ts">
import { LEFT_SIDEBAR_COMPONENTS, LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import CommonSidebarRight from '~/layouts/common-sidebar-right.vue'

const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)
</script>

<template>
  <Drawer
    v-model="sidebar.open.value"
    class="lg:drawer-open"
    drawer-id="sidebar-drawer"
  >
    <template #content>
      <CommonSidebarRight>
        <slot />
      </CommonSidebarRight>
    </template>

    <template #side>
      <SidebarSide :components="LEFT_SIDEBAR_COMPONENTS">
        <template #loading>
          <CommonSidebarLoading />
        </template>

        <!-- TODO: add not found handling -->
      </SidebarSide>
    </template>
  </Drawer>
</template>
