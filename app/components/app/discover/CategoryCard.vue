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
  <div role="button" class="flex flex-col items-center space-y-2 group">
    <Button
      size="lg"
      shape="circle"
      :class="color"
      class="relative border-none"
    >
      <Icon :name="icon" />
    </Button>

    <div class="text-center text-xs" :class="isSelected ? 'text-gray-800 font-bold' : 'text-gray-900'">
      {{ name }}
    </div>
  </div>
</template>
