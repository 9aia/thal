<script setup lang="ts">
useHead({
  title: "Checkout canceled",
})

definePageMeta({
  middleware: "auth",
  path: "/checkout/cancel",
})
</script>

<template>
  <section class="max-w-[1000px] mx-auto mt-6">
    <p>Picked the wrong subscription? Shop around then come back to pay!</p>
  </section>
</template>
