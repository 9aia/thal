<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import A from '#lib/vike/components/A.vue'
</script>

<template>
  <header class="absolute top-0 w-full z-10">
    <div class="text-center bg-teal-500 text-white py-2 px-4">
      Maratongue is in active development. <A class="link" target="_blank" href="https://forms.gle/ANMv7qnwTHva1k7L8">Report a issue</A>
    </div>

    <nav class="sticky top-0 px-4 navbar z-100 bg-neutral text-primary-content">
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
