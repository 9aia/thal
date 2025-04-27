<script lang="ts" setup>
import { t } from '@psitta/vue'
import type { CharacterDraftApiData } from '~/types'

const props = defineProps<{
  draft: CharacterDraftApiData
}>()

const showMore = ref(false)

const trunkedInstructions = computed(() => {
  if (!props.draft) {
    return ''
  }

  return props.draft.instructions.split('\n').slice(0, 3).join('\n')
})
</script>

<template>
  <div class="space-y-2 flex flex-col items-end">
    <section class="w-full px-4 pb-2 flex flex-col justify-center">
      <Avatar :name="draft.name" class="mx-auto w-16 h-16 text-base bg-gray-300 text-gray-800 mt-2" />

      <h2 class="text-gray-900 text-center text-base mt-2">
        {{ draft.name }}
      </h2>

      <Username :username="draft.username" class="mx-auto text-xs" />
    </section>

    <section class="w-full flex flex-col gap-2 pb-4">
      <MenuItem
        :is="{
          id: 'description',
          name: draft.description,
          icon: 'material-symbols:person-outline',
        }"
      />

      <MenuItem
        :is="{
          id: 'category',
          name: draft.categoryName,
          icon: 'material-symbols:category-outline',
        }"
      />

      <div class="h-px bg-gray-100 my-1" />

      <MenuItem
        :is="{
          id: 'instructions',
          name: t('Instructions'),
          icon: 'material-symbols:integration-instructions-outline',
        }"
      />

      <div class="flex flex-col gap-1">
        <MDC tag="article" class="prose prose-sm" :value="showMore ? draft.instructions : trunkedInstructions" />

        <div role="button" class="text-blue-500 hover:underline text-sm text-left" @click="showMore = !showMore">
          {{ showMore ? t('Show less') : t('Show more') }}
        </div>
      </div>
    </section>
  </div>
</template>
