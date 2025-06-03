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
})
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    hide-confirm
    no-padding
    content-class="pb-6"
  >
    <h1 class="px-6 pt-6 mb-2 mt-4 text-sm text-black">
      {{ t("What's New") }}
    </h1>

    <div class="px-6 h-[250px] lg:h-[350px] overflow-y-auto mt-4 mb-4">
      <ContentList path="whats-new" :where="{ _path: { $regex: `^/whats-new/${locale}/.*$` } }">
        <template #default="{ list }">
          <div
            v-for="article, i in list.reverse()"
            :key="article._path"
            class="flex flex-col"
          >
            <h2 class="text-xl text-gray-900">
              {{ article.title }}
            </h2>

            <Badge
              size="md"
              class="mb-4 mt-2"
            >
              {{ ARTICLE_TYPES.find((type) => type.id === article.type)?.name }}
            </Badge>

            <ContentRendererMarkdown :value="article" class="prose prose-slate prose-sm" />

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
    </div>
  </Modal>
</template>
