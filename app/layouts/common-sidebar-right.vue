<script setup lang="ts">
import { rightDrawer } from '~/store'
</script>

<template>
  <div class="drawer drawer-end">
    <input id="right-drawer" v-model="rightDrawer" type="checkbox" class="drawer-toggle">

    <div class="drawer-content flex flex-col h-dvh bg-white overflow-hidden relative">
      <slot />
    </div>

    <div class="drawer-side z-[100]">
      <label for="right-drawer" aria-label="close sidebar" class="drawer-overlay" />

      <div class="flex flex-col h-dvh items-end justify-center w-full sm:w-96">
        <ContactViewDrawer v-if="rightDrawer" />
      </div>
    </div>
  </div>
</template>
