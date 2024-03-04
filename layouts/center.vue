<script setup lang="ts">
import Footer from '~/lib/daisy/components/layout/Footer.vue'
import Header from '~/lib/daisy/components/layout/Header.vue'
</script>

<template>
  <div>
    <Header />

    <main
      class="bg-white flex flex-col"
      style="min-height: calc(100vh)"
    >
      <div class="max-w-lg mx-auto py-12 px-4 bg-white">
        <slot />
      </div>
    </main>

    <Footer />
  </div>
</template>
