<script setup lang="ts">
const user = useUser()

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="px-4">
    <h1 class="text-primary font-bold text-4xl">
      Explore
    </h1>

    {{user?.name}}

    <p>//TODO</p>
  </div>
</template>
