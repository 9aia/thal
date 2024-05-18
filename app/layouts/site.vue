<script setup lang="ts">
import DefaultLayout from "~/layouts/default.vue"
</script>

<template>
  <DefaultLayout>
    <div class="max-w-lg mx-auto py-12 px-4 bg-white">
      <slot />
    </div>
  </DefaultLayout>
</template>
