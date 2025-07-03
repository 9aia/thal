<script setup lang="ts">
import { SIDEBAR_COMPONENTS } from '~/constants/sidebar'
import SidebarRight from '~/layouts/common-sidebar-right.vue'

const sidebar = useSidebar()
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="sidebar-drawer" v-model="sidebar.open.value" type="checkbox" class="drawer-toggle">

    <div class="drawer-content flex flex-col h-dvh bg-white overflow-auto items-justify justify-center">
      <SidebarRight>
        <Transition name="fade-up">
          <slot />
        </Transition>
      </SidebarRight>
    </div>

    <div class="drawer-side z-50">
      <label for="sidebar-drawer" aria-label="close sidebar" class="drawer-overlay" />

      <div class="flex flex-col h-dvh justify-between w-96 overflow-hidden relative bg-white">
        <Transition
          :css="sidebar.animationEnabled.value"
          :name="sidebar.sidebarAnimationName.value"
        >
          <!-- TODO: add view not found handling -->
          <Suspense
            timeout="0"
            @fallback="sidebar.disableAnimation()"
            @pending="sidebar.disableAnimation()"
            @resolve="sidebar.handleSidebarAnimationResolve()"
          >
            <component
              :is="SIDEBAR_COMPONENTS[sidebar.view.value]"
              v-if="sidebar.view.value"
            />

            <template #fallback>
              <SidebarLoadingComponent />
            </template>
          </Suspense>
        </Transition>
      </div>
    </div>
  </div>
</template>
