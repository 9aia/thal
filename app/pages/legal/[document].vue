<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
  layout: 'site',
  layoutTransition: false,
})

useAutoRedirect()

const route = useRoute()
// const locale = useLocale()
const locale = ref('pt')

async function fetchLegalContent() {
  // Build collection name based on current locale
  const content = await queryCollection('content')
    .path(`/legal/${locale.value}/${route.params.document}`)
    .first()
  return content
}

const contentQuery = useQuery({
  queryKey: ['content', 'legal', locale.value, route.params.document],
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
