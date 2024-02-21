<script setup lang="ts">
import Icon from "#lib/daisy/components/display/Icon.vue";
import { A } from "#lib/i18n";
</script>

<template>
  <header class="absolute top-0 w-full z-10">
    <nav class="px-4 navbar z-100 bg-neutral text-primary-content">
      <div class="navbar-start">
        <A href="/" class="text-xl flex gap-1 items-center justify-center">
          <Icon name="directions_run" />
          <span class="font-bold">Maratongue</span>

          <div
            class="badge badge-primary badge-outline uppercase"
          >
            Experimental
          </div>
        </A>
      </div>
      <div class="navbar-end">
        <slot name="navbar-end" />
      </div>
    </nav>
  </header>
</template>
