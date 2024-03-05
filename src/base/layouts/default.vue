<script setup lang="ts">
import Footer from '~/src/ui/components/layout/Footer.vue'
import Header from '~/src/ui/components/layout/Header.vue'
</script>

<template>
  <div>
    <Header />

    <main
      class="bg-white flex flex-col"
      style="min-height: calc(100vh)"
    >
      <slot />
    </main>

    <Footer />
  </div>
</template>
