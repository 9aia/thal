<script setup lang="ts">
defineProps<{
  drawerId: string
}>()

const open = defineModel<boolean>()
</script>

<template>
  <div class="drawer">
    <input
      :id="drawerId"
      v-model="open"
      type="checkbox"
      class="drawer-toggle"
    >

    <div class="drawer-content flex flex-col h-dvh bg-white overflow-auto items-justify justify-center">
      <slot name="content" />
    </div>

    <div class="drawer-side z-50">
      <label
        :for="drawerId"
        aria-label="close sidebar"
        class="drawer-overlay"
      />

      <div class="flex flex-col h-dvh justify-between w-96 overflow-hidden relative bg-white">
        <slot name="side" />
      </div>
    </div>
  </div>
</template>
