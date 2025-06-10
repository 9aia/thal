<script setup lang="ts">
import { t } from '@psitta/vue'
</script>

<template>
  <ul>
    <li class="flex gap-2 items-center">
      <Icon class="text-success" name="material-symbols:check-rounded" />

      <span class="text-sm text-gray-800">{{ t('Signed in with Google') }}</span>
    </li>

    <li class="flex gap-2 items-center">
      <Icon class="text-success" name="material-symbols:check-rounded" />

      <span class="text-sm text-gray-800">{{ t('Connected with Stripe') }}</span>
    </li>
  </ul>
</template>
