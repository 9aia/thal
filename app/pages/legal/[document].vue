<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
  layout: 'site',
  layoutTransition: false,
})

useAutoRedirect()

const route = useRoute()

const localeWithDefaultRegion = useLocaleWithDefaultRegion()

async function fetchLegalContent() {
  return $fetch(`/api/content/legal/${route.params.document}`, {
    query: {
      locale: localeWithDefaultRegion.value,
    },
  })
}

const contentQuery = useQuery({
  queryKey: ['content', 'legal', localeWithDefaultRegion.value, route.params.document],
  queryFn: fetchLegalContent,
})
await contentQuery.suspense()
</script>

<template>
  <div class="site-container">
    <article v-if="contentQuery.data.value" class="prose prose-slate max-w-full">
      <ContentRenderer :value="contentQuery.data.value" />
    </article>
    <div v-else class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
      <CommonRouteError
        :error="404"
      />
    </div>
  </div>
</template>
