<script setup lang="ts">
import Icon from "#design/components/display/Icon.vue";
</script>

<template>
  <header class="absolute top-0 w-full z-10">
    <nav class="navbar z-100 bg-base-100 text-primary-content">
      <div class="navbar-start">
        <a
          href="/"
          class="btn box-shadow-hover btn-ghost text-xl flex gap-2 items-center justify-center"
        >
          <Icon name="directions_run" />
          Maratongue
        </a>
      </div>
      <div class="navbar-end">
        <slot name="navbar-end" />
      </div>
    </nav>
  </header>
</template>