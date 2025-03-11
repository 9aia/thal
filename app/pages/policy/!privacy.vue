<script setup lang="ts">
import { useLocale } from '@psitta/vue'

const locale = useLocale()

definePageMeta({
  layout: 'site',
})

useAutoRedirect()
</script>

<template>
  <ContentDoc
    class="prose prose-slate max-w-full"
    tag="article"
    path="policy"
    :where="{ _path: { $regex: `^/policy/${locale}/privacy.*$` } }"
  />
</template>
