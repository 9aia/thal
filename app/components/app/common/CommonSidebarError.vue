<script setup lang="ts">
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'

const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)
sidebar.navigationDirection.value = 'backward'
</script>

<template>
  <div class="bg-white flex flex-col h-dvh w-full absolute">
    <Navbar
      @back="navigateTo('/app')"
    />

    <div class="flex-1 overflow-y-auto bg-white pt-4 px-6">
      <CommonErrorFallback />
    </div>
  </div>
</template>
