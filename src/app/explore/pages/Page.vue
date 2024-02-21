<script setup lang="ts">
import { markRaw, onMounted, ref } from 'vue'

const component = ref<any>()

onMounted(async () => {
  component.value = markRaw((await import('./App.vue')).default)
})
</script>

<template>
  <component :is="component" />
  <template v-if="!component">
    <div
      class="flex items-center justify-center"
      style="min-height: calc(100vh - 64px - 56px)"
    >
      <span class="loading loading-spinner loading-md" />
    </div>
  </template>
</template>
