<script setup lang="ts">
import AboutMe from "./AboutMe.vue";
import Interests from "./Interests.vue";
import Summary from "./Summary.vue";
import Header from "./Header.vue";
</script>

<template>
  <div
    class="flex flex-col sm:flex-row"
    style="min-height: calc(100vh - 64px - 56px)"
  >
    <aside
      class="w-full md:w-1/2 lg:w-1/3 pt-4 pb-12 px-8 md:p-8 shadow-lg md:shadow-none"
    >
      <Header />
      <Summary />
    </aside>

    <main class="w-full md:w-1/2 lg:w-2/3 p-8 space-y-6 divide-y divide-gray-400">
      <AboutMe />
      <Interests />
    </main>
  </div>
</template>
