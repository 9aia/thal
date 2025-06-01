<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  placeholder?: string
  class?: string
  name?: string
  url?: string
  alt?: string
  type?: 'button' | 'summary' | 'div'
}>()

const placeholder = computed(() => {
  return props.placeholder || props.name?.[0].toUpperCase() || 'U'
})

const isButton = computed(() => {
  return props.type === 'button' || props.type === 'summary'
})
</script>

<template>
  <component
    :is="type === 'button' || !type ? 'div' : type"
    class="avatar"
    :class="{ placeholder, 'btn btn-ghost btn-circle': isButton }"
    :tabindex="isButton ? 0 : undefined"
    :role="isButton ? 'button' : undefined"
  >
    <template v-if="url">
      <div :class="props.class" class="bg-gray-50 text-gray-800 rounded-full">
        <img :src="url" :alt="props.alt">
      </div>
    </template>

    <template v-else>
      <div class="bg-gray-50 text-gray-800 rounded-full" :class="props.class">
        <span>{{ placeholder }}</span>
      </div>
    </template>
  </component>
</template>
