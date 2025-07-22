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
      tag="article"
      class="prose prose-slate max-w-full"
      path="policy"
      :where="{ _path: { $regex: `^/policy/${locale}/${route.params.document}.*$` } }"
    >
      <template #not-found>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <CommonRouteError
            :error="404"
          />
        </div>
      </template>
    </ContentDoc>
  </div>
</template>
