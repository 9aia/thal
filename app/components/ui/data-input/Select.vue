<script setup lang="ts">
import type { RuleExpression } from 'vee-validate'
import { useField } from 'vee-validate'
import type { MaybeRef, SelectHTMLAttributes } from 'vue'
import type { SafeProps } from '~/types'

type Props = SafeProps<SelectHTMLAttributes> & {
  label?: string
  placeholder?: string
  error?: string
  path: string
  rules?: MaybeRef<RuleExpression<string>>
  mandatory?: boolean
  feedback?: string | boolean
  iconPosition?: 'none' | 'right' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  iconPosition: 'none',
})
const label = useSlotContent(() => props.label)

const { value, errorMessage } = useField(props.path, props.rules)
</script>

<template>
  <label class="form-control w-full">
    <div v-if="label" class="label relative w-fit">
      <span class="label-text">
        {{ label }}
      </span>
      <span v-if="mandatory" class="absolute bottom-1/2 translate-y-1/2 right-[-0.4em] text-red-500">*</span>
    </div>

    <div class="relative">
      <div v-if="iconPosition === 'left'" class="absolute left-4 bottom-1/2 translate-y-1/2">
        <slot name="icon" />
      </div>

      <select
        v-model="value" class="select select-bordered select-ghost w-full" :placeholder="placeholder" :class="{
          'pr-12': iconPosition === 'right',
          'pl-12': iconPosition === 'left',
        }"
      >
        <slot />
      </select>

      <div v-if="iconPosition === 'right'" class="flex absolute right-4 bottom-1/2 translate-y-1/2">
        <slot name="icon" :error-message="errorMessage" />
      </div>
    </div>

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
  </label>
</template>
