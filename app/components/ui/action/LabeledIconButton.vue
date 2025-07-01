<script setup lang="ts">
defineProps<{
  icon: string
  label: string
}>()
</script>

<template>
  <label
    class="group text-xs text-primary cursor-pointer flex flex-col items-center justify-start gap-0.5 text-center"
  >
    <Button
      class="text-primary btn btn-lg btn-neutral btn-ghost btn-circle"
      :icon="icon"
    />

    {{ label }}
  </label>
</template>
