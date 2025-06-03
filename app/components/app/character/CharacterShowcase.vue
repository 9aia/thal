<script lang="ts" setup>
import { t } from '@psitta/vue'
import type { CharacterShowcase } from '~/types'

const props = defineProps<{
  data: CharacterShowcase
}>()

const showMore = ref(false)

const trunkedInstructions = computed(() => {
  if (!props.data) {
    return ''
  }

  if (props.data.instructions.length > 100) {
    return `${props.data.instructions.slice(0, 100)}...`
  }

  return props.data.instructions
})
</script>

<template>
  <div class="gap-2 flex flex-col items-end">
    <section class="w-full px-4 pb-2 flex flex-col justify-center">
      <Avatar
        :name="data.name"
        class="mt-2 mx-auto"
        size="lg"
        wrapper-class="bg-neutral text-neutral-content"
      />

      <h2 class="text-gray-900 text-center text-base mt-2">
        {{ data.name }}
      </h2>

      <Username :username="data.username" class="mx-auto text-xs" :show-copy="false" />
    </section>

    <section class="w-full flex flex-col gap-2 pb-4">
      <MenuItem
        :is="{
          id: 'description',
          name: data.description,
          icon: 'material-symbols:person-outline-rounded',
        }"
      />

      <MenuItem
        :is="{
          id: 'category',
          name: data.categoryName,
          icon: 'material-symbols:category-outline-rounded',
        }"
      />

      <MenuItem
        :is="{
          id: 'instructions',
          name: t('Instructions'),
          icon: 'material-symbols:integration-instructions-outline-rounded',
          meaning: 'normal',
        }"
      />

      <div class="flex flex-col gap-1">
        <MDC tag="article" class="prose prose-sm text-sm text-gray-500" :value="showMore ? data.instructions : trunkedInstructions" />

        <button class="w-fit text-blue-500 text-sm text-left cursor-pointer border-b-2 border-transparent focus:border-b-blue-500 focus:outline-hidden" @click="showMore = !showMore">
          {{ showMore ? t('Show less') : t('Show more') }}
        </button>
      </div>
    </section>

    <slot name="footer" />
  </div>
</template>
