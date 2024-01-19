<script setup lang="ts">
import Icon from "#design/components/display/Icon.vue";
</script>

<template>
  <footer
    class="sticky top-[100vh] footer footer-center p-4 bg-base-300 text-base-content"
  >
    <aside>
      <p class="flex items-center justify-center gap-1">
        {{ new Date().getFullYear() }} - Desenvolvido pela
        <a href="/sobre" class="text-neutral-content font-bold flex items-center gap-1">
          <Icon name="directions_run" label="amor" class="text-primary" />
          <span>Equipe</span>
          <span>Maratongue</span>
        </a>
      </p>
    </aside>
  </footer>
</template>