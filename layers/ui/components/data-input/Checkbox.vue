<script setup lang="ts">
import { useField } from "vee-validate"
import type { InputHTMLAttributes } from "vue"
import type { SafeProps } from "../../types"

type Props = SafeProps<InputHTMLAttributes> & {
  path: string
  disabled?: boolean
}

const props = defineProps<Props>()

const { value, handleBlur } = useField(props.path)
</script>

<template>
  <div class="form-control">
    <label class="label" :class="{ 'cursor-pointer': !disabled }">
      <span class="label-text flex gap-1 items-center">
        <slot />
      </span>

      <input
        v-model="value"
        class="checkbox checkbox-neutral"
        type="checkbox"
        :disabled="disabled"
        @blur="handleBlur"
      >
    </label>
  </div>
</template>
