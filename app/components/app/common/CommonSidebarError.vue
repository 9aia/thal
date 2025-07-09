<script setup lang="ts">
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'

const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)
sidebar.navigationDirection.value = 'backward'
</script>

<template>
  <div class="bg-white flex flex-col h-dvh w-full absolute">
    <Navbar
      @click="navigateTo('/app')"
    />

    <CommonErrorFallback />
  </div>
</template>
