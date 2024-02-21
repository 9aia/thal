<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import useSlotContent from '#lib/vue/composables/useSlotContent'
import type { SafeProps } from '#lib/vue/utils/types'

type Props = SafeProps<HTMLAttributes> & {
  name?: string
}

const props = defineProps<Props>()

const name = useSlotContent(() => props.name)
</script>

<template>
  <span role="img" class="material-symbols-outlined">
    {{ name }}
  </span>
</template>
