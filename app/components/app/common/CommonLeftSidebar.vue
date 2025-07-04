<script setup lang="ts">
import { LEFT_SIDEBAR_COMPONENTS } from '~/constants/sidebar'
import CommonSidebarRight from '~/layouts/common-sidebar-right.vue'

const sidebar = useSidebar()
</script>

<template>
  <Drawer
    v-model="sidebar.open.value"
    class="lg:drawer-open"
    drawer-id="sidebar-drawer"
  >
    <template #content>
      <CommonSidebarRight>
        <div name="fade-up">
          <slot />
        </div>
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
