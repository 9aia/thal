<script setup lang="ts">
const sidebar = useSidebar()
sidebar.navigationDirection.value = 'backward'
</script>

<template>
  <div class="bg-white flex flex-col h-dvh w-full absolute">
    <Navbar opener="main" @click="navigateTo('/app')" />

    <CommonErrorFallback />
  </div>
</template>
