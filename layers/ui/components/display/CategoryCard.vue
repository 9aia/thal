<script setup lang="ts">
defineProps<{
  name: string
  description: string
  icon: string
  color: string
}>()
</script>

<template>
  <div role="button" class="flex flex-col items-center space-y-2">
    <Btn
      size="lg"
      shape="circle"
      :class="color"
    >
      <Icon :name="icon" />
    </Btn>

    <div class="text-center text-xs text-slate-900">
      {{ name }}
    </div>
  </div>
</template>
