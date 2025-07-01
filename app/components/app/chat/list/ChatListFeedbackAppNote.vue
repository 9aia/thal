<script setup lang="ts">
import { t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'
</script>

<template>
  <AppNote
    hide-close
  >
    <div class="px-4 flex justify-between items-center gap-3 w-full">
      <div class="flex-1">
        <h2 class="text-xs text-black">
          {{ t("Notice a bug or want to suggest something?") }}
        </h2>
      </div>

      <Link
        class="btn btn-xs btn-neutral"
        span-class="group-hover:no-underline"
        href="https://forms.gle/ANMv7qnwTHva1k7L8"
        :localize="false"
      >
        {{ t("Send feedback") }}
      </Link>
    </div>
  </AppNote>
</template>
