<script setup lang="ts">
import { useSlotContent } from "#design/composables/useSlotContent";
import { RuleExpression, useField } from "vee-validate";
import { MaybeRef, type InputHTMLAttributes } from "vue";
import { SafeProps } from "#framework/utils/types";

type Props = SafeProps<InputHTMLAttributes> & {
  label?: string;
  placeholder?: string;
  error?: string;
  path: string;
  rules?: MaybeRef<RuleExpression<string>>;
  mandatory?: boolean;
  feedback?: string | boolean;
};

const props = defineProps<Props>();
const label = useSlotContent(() => props.label);

const { value, errorMessage, handleBlur } = useField(props.path, props.rules);
</script>

<template>
  <label class="form-control w-full">
    <div v-if="label" class="label">
      <span class="label-text">
        {{ label }}
      </span>
      <span
        v-if="mandatory"
        class="absolute bottom-1/2 translate-y-1/2 right-[-0.4em] text-red-500"
        >*</span
      >
    </div>

    <textarea
      class="textarea textarea-sm h-40 leading-[1.6em] textarea-bordered w-full resize-none"
      :placeholder="placeholder"
      v-model="value"
      @blur="handleBlur"
    />

    <div v-if="errorMessage && !feedback" class="label">
      <span class="label-text-alt text-error">
        {{ errorMessage }}
      </span>
    </div>

    <div v-if="feedback" class="label">
      <span class="label-text-alt">
        <slot name="feedback" :v-bind="{ feedback }">
          {{ feedback }}
        </slot>
      </span>
    </div>
  </label>
</template>
