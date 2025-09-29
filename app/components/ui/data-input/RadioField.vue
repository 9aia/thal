<script setup lang="ts">
import { useField } from 'vee-validate'
import type { InputHTMLAttributes } from 'vue'
import type { SafeProps } from '~~/shared/types'

type Props = SafeProps<InputHTMLAttributes> & {
  path: string
  value: string
  disabled?: boolean
  inputClass?: string
  label?: string
}

const props = defineProps<Props>()

const { value, handleBlur } = useField(props.path, {}, {
  type: 'radio',
})
</script>

<template>
  <fieldset class="fieldset">
    <label class="label text-black">
      <input
        v-model="value"
        :name="path"
        :value="props.value"
        type="radio"
        class="radio"
        :class="inputClass"
        :disabled="disabled"
        @blur="handleBlur"
      >
      {{ label }}
    </label>
  </fieldset>
</template>
