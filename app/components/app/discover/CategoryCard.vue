<script setup lang="ts">
defineProps<{
  name: string
  description: string
  icon: string
  color: string
  isSelected: boolean
}>()
</script>

<template>
  <div role="button" class="flex flex-col items-center gap-2 group">
    <Button
      :class="color"
      class="btn btn-lg btn-neutral btn-circle"
    >
      <Icon :name="icon" />
    </Button>

    <div class="text-center text-xs" :class="isSelected ? 'text-gray-800 font-bold' : 'text-gray-900'">
      {{ name }}
    </div>
  </div>
</template>
