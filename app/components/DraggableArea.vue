<script setup lang="ts">
const isDragging = ref(false)

const bindData = computed(() => {
  return {
    class: isDragging.value ? 'pointer-events-none select-none' : '',
  }
})
</script>

<template>
  <div
    v-dragscroll
    @dragscrollstart="isDragging = true"
    @dragscrollend="isDragging = false"
  >
    <slot :bind-data="bindData" :is-dragging="isDragging" />
  </div>
</template>
