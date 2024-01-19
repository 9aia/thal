<script setup lang="ts">
import Footer from "#design/components/layout/Footer.vue";
import Header from "#design/components/layout/Header.vue";
</script>

<template>
  <Header>
    <template #navbar-end>
      <a class="btn btn-primary text-neutral-content" href="/auth">
        Experimente Maratongue
      </a>
    </template>
  </Header>

  <main class="min-h-screen">
    <slot />
  </main>

  <Footer />
</template>
