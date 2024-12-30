<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { SafeProps } from "../../types"

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
