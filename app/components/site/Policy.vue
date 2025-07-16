<script setup lang="ts">
defineProps<{
  document: string
}>()

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
      :where="{ _path: { $regex: `^/policy/${locale}/${document}.*$` } }"
    >
      <template #not-found>
        <CommonErrorFallback centered />
      </template>
    </ContentDoc>
  </div>
</template>
