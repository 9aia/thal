<script setup lang="ts">
import Icon from "#design/components/display/Icon.vue";
import { A } from "#framework/i18n";
</script>

<template>
  <header class="absolute top-0 w-full z-10">
    <nav class="px-8 navbar z-100 bg-base-100 text-primary-content border-b border-b-teal-500">
      <div class="navbar-start">
        <A
          href="/"
          class="text-teal-600 hover:bg-transparent btn-ghost text-xl flex gap-1 items-center justify-center"
        >
          <Icon name="directions_run" />
          <span class="font-bold">Maratongue</span>
        </A>
      </div>
      <div class="navbar-end">
        <slot name="navbar-end" />
      </div>
    </nav>
  </header>
</template>