<script setup lang="ts">
definePageMeta({
  layout: 'site',
  layoutTransition: false,
})

useAutoRedirect()

const route = useRoute()

// const locale = useLocale()
const locale = 'pt'
</script>

<template>
  <div class="site-container">
    <ContentDoc
      class="prose prose-slate max-w-full"
      tag="article"
      path="policy"
      :where="{ _path: { $regex: `^/policy/${locale}/${route.params.document}.*$` } }"
    >
      <template #not-found>
        <CommonErrorFallback centered />
      </template>
    </ContentDoc>
  </div>
</template>
