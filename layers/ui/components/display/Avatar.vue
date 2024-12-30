<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  placeholder?: string
  class?: string
  name?: string
  url?: string
  alt?: string
  type?: string
}>()

const placeholder = computed(() => {
  return props.placeholder || props.name?.[0].toUpperCase() || "U"
})

const isBtn = computed(() => {
  return props.type === "button" || props.type === "summary"
})
</script>

<template>
  <component
    :is="type === 'button' || !type ? 'div' : type"
    class="avatar"
    :class="{ placeholder, 'btn btn-ghost btn-circle': isBtn }"
    :tabindex="isBtn ? 0 : undefined"
    :role="isBtn ? 'button' : undefined"
  >
    <template v-if="url">
      <div :class="props.class" class="bg-neutral text-neutral-content rounded-full">
        <img :src="url" :alt="props.alt">
      </div>
    </template>

    <template v-else>
      <div class="bg-neutral text-neutral-content rounded-full" :class="props.class">
        <span>{{ placeholder }}</span>
      </div>
    </template>
  </component>
</template>
