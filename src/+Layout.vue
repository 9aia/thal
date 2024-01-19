<script setup lang="ts">
import Footer from "#design/components/layout/Footer.vue";
import Header from "#design/components/layout/Header.vue";
</script>

<template>
  <Header />

  <main
    class="flex flex-col mt-[64px]"
    style="min-height: calc(100vh - 64px - 56px)"
  >
    <slot />
  </main>

  <Footer />
</template>
