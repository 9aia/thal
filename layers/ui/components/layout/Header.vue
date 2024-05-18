<script setup lang="ts">
import Icon from "../display/Icon.vue"
</script>

<template>
  <header class="sticky top-0 w-full z-[1000] bg-slate-800 text-primary">
    <nav class="px-4 navbar max-w-[800px] mx-auto">
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
