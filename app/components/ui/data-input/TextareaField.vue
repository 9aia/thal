<script setup lang="ts">
import type { RuleExpression } from 'vee-validate'
import { useField } from 'vee-validate'
import type { MaybeRef, TextareaHTMLAttributes } from 'vue'
import type { SafeProps } from '~/types'

type Props = SafeProps<TextareaHTMLAttributes> & {
  disabled?: boolean
  label?: string
  placeholder?: string
  error?: string
  path: string
  rules?: MaybeRef<RuleExpression<string>>
  mandatory?: boolean
  feedback?: string | boolean
  textareaClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  textareaClass: '',
})
const label = useSlotContent(() => props.label)
const { value, errorMessage, handleBlur } = useField(props.path, props.rules)

const labelRef = ref<HTMLInputElement>()

function focus() {
  if (labelRef.value) {
    labelRef.value?.focus()
  }
}

defineExpose({
  focus,
})
</script>

<template>
  <fieldset ref="labelRef" class="fieldset">
    <Legend
      v-if="label"
      :label="label"
      :mandatory="mandatory"
    />

    <textarea
      v-model="value"
      class="textarea"
      :class="textareaClass"
      :placeholder="placeholder"
      :disabled="disabled"
      @blur="handleBlur"
    />

    <p v-if="errorMessage && !feedback" class="label text-error">
      {{ errorMessage }}
    </p>

    <p v-if="feedback" class="label">
      <slot name="feedback" :feedback="feedback">
        {{ feedback }}
      </slot>
    </p>
  </fieldset>
</template>
