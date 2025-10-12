<script setup lang="ts">
import { t, useLocale } from '@psitta/vue'
import { useQuery } from '@tanstack/vue-query'
import * as semver from 'semver'
import { ARTICLE_TYPES } from '~/constants/content'

const modelValue = defineModel<boolean>()

const localeWithDefaultRegion = useLocaleWithDefaultRegion()
const whatsNew = useWhatsNew()

watch(modelValue, async (value) => {
  if (value) {
    whatsNew.seeContent()
  }
}, { immediate: true })

function isEarlyAccess(article: any) {
  return article.meta?.version ? semver.ltr(article.meta.version, '1.0.0') : false
}

const whatsNewQuery = useQuery({
  queryKey: ['whats-new', localeWithDefaultRegion],
  queryFn: async () => {
    return $fetch('/api/content/whats-new', {
      params: { locale: localeWithDefaultRegion.value },
    })
  },
  select: (data) => {
    return {
      ...data,
      content: data.content.reverse(),
    }
  },
})
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    hide-confirm
    :title="t('What\'s New')"
  >
    <CommonResource
      :for="whatsNewQuery"
      :empty-condition="whatsNewQuery.data?.value?.content.length === 0"
    >
      <template v-if="whatsNewQuery.data.value?.content" #default>
        <div
          v-for="(article, i) in whatsNewQuery.data.value.content"
          :key="article.id"
          class="flex flex-col px-8"
        >
          <h2 class="text-xl text-black">
            {{ article.title }}
          </h2>

          <div class="flex gap-2 mt-1 mb-2 flex-wrap">
            <Badge
              v-if="article.meta?.type"
              size="sm"
              :color="ARTICLE_TYPES.find((a) => a.id === article.meta?.type)?.color"
              :icon="ARTICLE_TYPES.find((a) => a.id === article.meta?.type)?.icon"
            >
              {{ ARTICLE_TYPES.find((a) => a.id === article.meta?.type)?.name }}
            </Badge>

            <Badge
              v-if="article.meta?.version"
              size="sm"
              icon="material-symbols:code-rounded"
              color="neutral"
            >
              v{{ article.meta?.version }}
            </Badge>

            <Badge
              v-if="article.meta?.version && isEarlyAccess(article)"
              size="sm"
              icon="material-symbols:rocket-outline-rounded"
              color="warning"
            >
              {{ t('Early Access') }}
            </Badge>
          </div>

          <ContentRenderer :value="article" class="prose prose-sm" />

          <div v-if="whatsNewQuery.data.value?.content && i !== whatsNewQuery.data.value.content.length - 1" class="b-1 w-full border border-gray-400/50 my-6" />
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center justify-center h-full">
          <p class="text-gray-800 text-center text-lg font-semibold mb-4">
            {{ t('No articles found') }}
          </p>
        </div>
      </template>
    </CommonResource>
  </Modal>
</template>
