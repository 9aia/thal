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
    <Btn
      size="lg"
      shape="circle"
      :class="color"
      class="relative overflow-hidden border-none"
    >
      <div class="w-full h-1/2 bg-black/5 absolute top-0 -z-1" />
      <Icon :name="icon" />
    </Btn>

    <div class="text-center text-xs" :class="isSelected ? 'text-primary' : 'text-slate-900'">
      {{ name }}
    </div>
  </div>
</template>
