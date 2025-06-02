<script setup lang="ts">
import { type RuleExpression, useField } from 'vee-validate'

const props = defineProps<{
  path: string
  rules?: MaybeRef<RuleExpression<string>>
  placeholder?: string
  autofocus?: boolean
}>()

const { value } = useField(props.path, props.rules)
</script>

<template>
  <TextField
    :placeholder="placeholder"
    path="search"
    icon-position="right"
    :autofocus="autofocus"
    input-class="input-lg text-base rounded-full pl-6"
  >
    <template #icon>
      <Icon
        v-if="!value"
        name="material-symbols:search-rounded"
        class="pointer-events-none cursor-auto"
      />

      <Icon
        v-else
        name="material-symbols:close-rounded"
        role="button"
        class="cursor-pointer"
        @click="value = ''"
      />
    </template>
  </TextField>
</template>
