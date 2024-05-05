<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import useSlotContent from "~/src/base/composables/useSlotContent"
import type { SafeProps } from "~/src/base/utils/types.d"

type Props = SafeProps<HTMLAttributes> & {
  name?: string
}

const props = defineProps<Props>()

const name = useSlotContent(() => props.name)

const nameWithoutMdi = computed(() => name.value?.replace("mdi-", ""))
</script>

<template>
  <span role="img" class="material-symbols-outlined">
    {{ nameWithoutMdi }}
  </span>
</template>
