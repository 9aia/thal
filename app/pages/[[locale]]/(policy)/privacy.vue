<script setup lang="ts">
import { useLocale } from '@psitta/vue'

definePageMeta({
  layout: 'site',
  layoutTransition: false,
})

useAutoRedirect()

// const locale = useLocale()
const locale = 'pt'
</script>

<template>
  <div>
    <ContentDoc
      class="prose prose-slate max-w-full"
      tag="article"
      path="policy"
      :where="{ _path: { $regex: `^/policy/${locale}/privacy.*$` } }"
    />
  </div>
</template>
