<script setup lang="ts">
import type { RuleExpression } from 'vee-validate'
import { useField } from 'vee-validate'
import type { InputHTMLAttributes, MaybeRef } from 'vue'
import type { SafeProps } from '#shared/types'

type Props = SafeProps<InputHTMLAttributes> & {
  disabled?: boolean
  autocomplete?: string
  autocapitalize?: string
  label?: string
  placeholder?: string
  autofocus?: boolean
  error?: string
  path: string
  rules?: MaybeRef<RuleExpression<string>>
  mandatory?: boolean
  feedback?: string | boolean
  iconPosition?: 'none' | 'right' | 'left'
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconPosition: 'none',
  autofocus: false,
  inputClass: '',
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

    <div class="relative">
      <div
        v-if="iconPosition === 'left'"
        class="absolute left-4 bottom-1/2 translate-y-1/2"
      >
        <slot name="icon" />
      </div>

      <input
        v-model="value"
        class="input"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :autocapitalize="autocapitalize"
        :class="{
          'pr-12': iconPosition === 'right',
          'pl-12': iconPosition === 'left',
          [inputClass]: true,
        }"
        :autofocus="autofocus"
        @blur="handleBlur"
      >

      <div
        v-if="iconPosition === 'right'"
        class="flex absolute right-4 bottom-1/2 translate-y-1/2"
      >
        <slot name="icon" :error-message="errorMessage" />
      </div>
    </div>

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
