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
  >
    <template #icon>
      <Icon
        v-if="!value"
        name="material-symbols:search"
      />

      <Icon
        v-else
        name="material-symbols:close"
        role="button"
        @click="value = ''"
      />
    </template>
  </TextField>
</template>
