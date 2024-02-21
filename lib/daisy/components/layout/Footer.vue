<script setup lang="ts">
import Icon from "#lib/daisy/components/display/Icon.vue";
import { A, T } from "#lib/i18n";
</script>

<template>
  <footer
    class="sticky top-[100vh] footer footer-center p-4 bg-base-300 text-base-content"
  >
    <aside>
      <p class="flex items-center justify-center gap-1">
        <T
          text="{year} - Developed by {teamName}"
          :values="{ year: new Date().getFullYear(), teamName: 'Maratongue' }"
          class="flex items-center gap-1"
        >
          <template #teamName="slotProps">
            <A
              href="/about"
              class="text-neutral-content font-bold flex items-center gap-1"
            >
              <Icon name="directions_run" label="amor" class="text-primary" />
              {{ slotProps.teamName }}
            </A>
          </template>
        </T>
      </p>
    </aside>
  </footer>
</template>
