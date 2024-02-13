<script setup lang="ts">
import ParentLayout from "../../+Layout.vue";
</script>

<template>
  <ParentLayout>
    <div class="max-w-lg mx-auto py-12 px-4">
      <slot />
    </div>
  </ParentLayout>
</template>
