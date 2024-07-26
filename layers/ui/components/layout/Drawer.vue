<script setup lang="ts">
defineProps<{
  inputId: string
}>()
</script>

<template>
  <div class="drawer">
    <input :id="inputId" type="checkbox" class="drawer-toggle">

    <div class="drawer-content flex flex-col h-dvh">
      <slot name="content" />
    </div>

    <div class="drawer-side">
      <label :for="inputId" aria-label="close sidebar" class="drawer-overlay" />

      <div class="flex flex-col h-dvh justify-between w-full">
        <slot name="side" />
      </div>
    </div>
  </div>
</template>
