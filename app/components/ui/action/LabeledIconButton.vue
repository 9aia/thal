<script setup lang="ts">
defineProps<{
  icon: string
  label: string
}>()
</script>

<template>
  <label
    class="group text-xs text-primary cursor-pointer flex flex-col items-center justify-center gap-0.5"
  >
    <Button
      class="text-primary btn btn-lg btn-neutral btn-ghost btn-circle"
      :icon="icon"
    />

    {{ label }}
  </label>
</template>
