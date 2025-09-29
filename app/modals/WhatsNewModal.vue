<script setup lang="ts">
import { t, useLocale } from '@psitta/vue'
import * as semver from 'semver'
import { ARTICLE_TYPES } from '~/constants/content'

const modelValue = defineModel<boolean>()

const locale = useLocale()
const whatsNew = useWhatsNew()

watch(modelValue, async (value) => {
  if (value) {
    whatsNew.seeContent()
  }
}, { immediate: true })

function isEarlyAccess(article: any) {
  return semver.ltr(article.version, '1.0.0')
}

// TODO: fix nuxt content usage
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    hide-confirm
    :title="t('What\'s New')"
  >
    <ContentList
      path="whats-new"
      :where="{ _path: { $regex: `^/whats-new/${locale}/.*$` } }"
    >
      <template #default="{ list }">
        <div
          v-for="article, i in list.reverse()"
          :key="article._path"
          class="flex flex-col px-8"
        >
          <h2 class="text-xl text-black">
            {{ article.title }}
          </h2>

          <div class="flex gap-2 mt-1 mb-2 flex-wrap">
            <Badge
              v-if="article.type"
              size="sm"
              :color="ARTICLE_TYPES.find((a) => a.id === article.type)?.color"
              :icon="ARTICLE_TYPES.find((a) => a.id === article.type)?.icon"
            >
              {{ ARTICLE_TYPES.find((a) => a.id === article.type)?.name }}
            </Badge>

            <Badge
              v-if="article.version"
              size="sm"
              icon="material-symbols:code-rounded"
              color="neutral"
            >
              v{{ article.version }}
            </Badge>

            <Badge
              v-if="article.version && isEarlyAccess(article)"
              size="sm"
              icon="material-symbols:rocket-outline-rounded"
              color="warning"
            >
              {{ t('Early Access') }}
            </Badge>
          </div>

          <ContentRendererMarkdown :value="article" class="prose prose-sm" />

          <div v-if="i !== list.length - 1" class="b-1 w-full border border-gray-400/50 my-6" />
        </div>
      </template>

      <template #not-found>
        <div class="flex flex-col items-center justify-center h-full">
          <p class="text-gray-800 text-center text-lg font-semibold mb-4">
            {{ t('No articles found') }}
          </p>
        </div>
      </template>
    </ContentList>
  </Modal>
</template>
