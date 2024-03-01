<script setup lang="ts">
import ParentLayout from '../../+Layout.vue'
</script>

<template>
  <ParentLayout class="bg-white">
    <div class="max-w-lg mx-auto py-12 px-4 bg-white">
      <slot />
    </div>
  </ParentLayout>
</template>
