<script setup lang="ts">
import { t } from '@psitta/vue'

const modelValue = defineModel<boolean>()

const articleTypes = [
  { id: 'release', name: 'Release', icon: 'star' },
  { id: 'announcement', name: 'Announcement', icon: 'megaphone' },
]
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    hide-confirm
    no-padding
    content-class="pb-6"
  >
    <h1 class="px-6 pt-6 mb-2 mt-4 font-bold text-2xl text-slate-900">
      {{ t("What's New") }}
    </h1>

    <div class="px-6 h-[250px] lg:h-[350px] overflow-y-auto mt-4 mb-4">
      <ContentList v-slot="{ list }" path="/whats-new">
        <div v-for="article, i in list.reverse()" :key="article._path" class="flex flex-col">
          <h2 class="text-xl text-slate-900">
            {{ article.title }}
          </h2>

          <Badge size="md" class="badge-primary badge-outline mb-4 mt-2">
            {{ articleTypes.find((type) => type.id === article.type)?.name }}
          </Badge>

          <ContentRendererMarkdown :value="article" class="prose prose-slate prose-sm" />

          <div v-if="i !== list.length - 1" class="b-1 w-full border border-slate-400/50 my-6" />
        </div>
      </ContentList>
    </div>
  </Modal>
</template>
