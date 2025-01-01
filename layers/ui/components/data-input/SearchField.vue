<script setup lang="ts">
import { type RuleExpression, useField } from 'vee-validate'

const props = defineProps<{
  path: string
  rules?: MaybeRef<RuleExpression<string>>
  placeholder?: string
}>()

const { value } = useField(props.path, props.rules)
</script>

<template>
  <TextField
    :placeholder="placeholder"
    path="search"
    icon-position="right"
  >
    <template #icon>
      <Icon
        v-if="!value"
        name="search"
      />

      <Icon
        v-else
        name="close"
        role="button"
        @click="value = ''"
      />
    </template>
  </TextField>
</template>
