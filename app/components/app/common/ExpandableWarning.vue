<script lang="ts" setup>
import { tv } from 'tailwind-variants'

interface Props {
  initialText: string
  expandedText?: string
  readMoreText?: string
  readLessText?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  expandedText: '',
  readMoreText: 'Read more',
  readLessText: 'Read less',
})

const isExpanded = ref(false)

const button = tv({
  base: 'text-xs text-gray-500 text-center cursor-pointer focus:outline-none pt-2 pb-3 group px-4',
})

const span = tv({
  base: 'ml-1 text-brown-500 group-hover:underline group-focus:outline-2 group-focus:outline-offset-2 rounded-full group-focus:outline-blue-500',
})
</script>

<template>
  <button
    :class="button({ class: props.class })"
    @click="isExpanded = !isExpanded"
  >
    <Transition name="fade" mode="out-in">
      <div v-if="isExpanded">
        {{ initialText }} {{ expandedText }}

        <span :class="span()">
          {{ readLessText }}
        </span>
      </div>

      <div v-else>
        {{ initialText }}

        <span :class="span()">
          {{ readMoreText }}
        </span>
      </div>
    </Transition>
  </button>
</template>
