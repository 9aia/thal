<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { type RuleExpression, useField } from 'vee-validate'

const props = defineProps<{
  path: string
  rules?: MaybeRef<RuleExpression<string>>
  placeholder?: string
  autofocus?: boolean
  inputClass?: string
}>()

const { value } = useField(props.path, props.rules)

const styles = tv({
  base: 'input-lg text-base rounded-full pl-6',
})
</script>

<template>
  <TextField
    :placeholder="placeholder"
    path="search"
    icon-position="right"
    :autofocus="autofocus"
    :input-class="styles({ class: inputClass })"
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
