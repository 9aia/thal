<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { HTMLAttributes } from 'vue'
import type { SafeProps } from '~~/shared/types'

type Props = SafeProps<HTMLAttributes> & {
  name?: string
}

const props = defineProps<Props>()
const attrs = useAttrs()
const name = useSlotContent(() => props.name)

const nameNormalized = computed(() => {
  if (!name.value?.includes(':')) {
    return `material-symbols:${name.value.trim()}`
  }

  return name.value?.trim()
})

const icon = tv({
  base: 'text-2xl shrink-0',
})
</script>

<template>
  <NuxtIcon
    role="img"
    :name="nameNormalized"
    :class="icon({ class: attrs.class as string || '' })"
  />
</template>
