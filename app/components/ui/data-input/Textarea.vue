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
    <legend v-if="label" class="fieldset-legend ml-4">
      {{ label }}
      <span
        v-if="mandatory"
        class="absolute bottom-1/2 translate-y-1/2 right-[-0.4em] text-red-500"
      >*</span>
    </legend>

    <textarea
      v-model="value"
      class="textarea"
      :class="textareaClass"
      :placeholder="placeholder"
      :disabled="disabled"
      @blur="handleBlur"
    />

    <div v-if="errorMessage && !feedback" class="label">
      <span class="label-text-alt text-error">
        {{ errorMessage }}
      </span>
    </div>

    <div v-if="feedback" class="label">
      <span class="label-text-alt">
        <slot name="feedback" :feedback="feedback">
          {{ feedback }}
        </slot>
      </span>
    </div>
  </fieldset>
</template>
