<script setup lang="ts">
import { useVModels } from '@vueuse/core'
import VueTurnstile from 'vue-turnstile'
import PUBLIC_KEYS from '~~/public_keys'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { modelValue } = useVModels(props, emit)
</script>

<template>
  <VueTurnstile
    v-model="modelValue"
    :site-key="PUBLIC_KEYS.TURNSTILE_SITE_KEY"
  />
</template>
