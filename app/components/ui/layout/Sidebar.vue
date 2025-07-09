<script setup lang="ts">
import type { SidebarFullPath, SidebarState, SidebarStore } from '~/types'

const props = defineProps<{
  provideKey: string
  rootState: SidebarState
  componentKeys: string[]
}>()

const useSidebar = createUseSidebar(props.rootState, props.componentKeys)

provide(props.provideKey, useSidebar)
</script>

<template>
  <slot />
</template>
