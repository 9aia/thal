<script setup lang="ts">
import { t, useLocale } from '@psitta/vue'
import { ARTICLE_TYPES } from '~/constants/content'

const modelValue = defineModel<boolean>()

const locale = useLocale()
const whatsNew = useWhatsNew()

watch(modelValue, async (value) => {
  if (value) {
    whatsNew.seeContent()
  }
}, { immediate: true })
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

          <Badge
            size="md"
            class="mb-4 mt-2"
          >
            {{ ARTICLE_TYPES.find((type) => type.id === article.type)?.name }}
          </Badge>

          <ContentRendererMarkdown :value="article" class="prose" />

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
