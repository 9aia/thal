<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  title: 'Pricing',
})
</script>

<template>
  <div class="w-full relative p-8">
    <h1 class="text-3xl text-black text-center mb-4 mx-auto">
      {{ t('Pricing') }}
    </h1>

    <Pricing />
  </div>
</template>
