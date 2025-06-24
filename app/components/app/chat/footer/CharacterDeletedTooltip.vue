<script setup lang="ts">
import { t } from '@psitta/vue'
</script>

<template>
  <div class="tooltip-content max-w-lg rounded-2xl">
    <div class="px-4 py-2 text-orange-500 text-sm bg-radial-[at_bottom] from-orange-50 to-gray-50">
      {{ t('You can\'t message this character — they have been deleted.') }}
    </div>
  </div>
</template>
