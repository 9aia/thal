<script setup lang="ts">
import DefaultLayout from "~/layouts/default.vue"
</script>

<template>
  <DefaultLayout class="bg-slate-300">
    <div class="max-w-lg mx-auto px-4 py-8">
      <slot />
    </div>
  </DefaultLayout>
</template>
