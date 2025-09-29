<script setup lang="ts">
import { useField } from 'vee-validate'
import type { InputHTMLAttributes } from 'vue'
import type { SafeProps } from '#shared/types'

type Props = SafeProps<InputHTMLAttributes> & {
  path: string
  disabled?: boolean
  inputClass?: string
  label?: string
}

const props = defineProps<Props>()

const { value, handleBlur } = useField(props.path)
</script>

<template>
  <fieldset class="fieldset">
    <label class="label text-black">
      <input
        v-model="value"
        type="checkbox"
        class="checkbox"
        :disabled="disabled"
        :class="inputClass"
        @blur="handleBlur"
      >
      {{ label }}
    </label>
  </fieldset>
</template>
