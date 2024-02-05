<script setup lang="ts">
import { useRipple } from "#design/composables/useRipple";
import { SafeProps, SafeVariantProps } from "#framework/utils/types";
import { VariantProps, tv } from "tailwind-variants";
import { useAttrs, type ButtonHTMLAttributes } from "vue";

const styles = tv({
  base: "btn btn-sm",
});

type Props = SafeProps<ButtonHTMLAttributes> &
  SafeVariantProps<VariantProps<typeof styles>> & {
    loading?: boolean;
    success?: boolean;
  };

defineProps<Props>();

const rippleElRef = useRipple();
const attrs = useAttrs();
</script>

<template>
  <button
    :class="styles({ class: attrs.class as string })"
    ref="rippleElRef"
    :disabled="loading"
  >
    <slot />
    <span v-if="loading" class="loading loading-spinner"></span>
    <span v-else-if="success" class="material-symbols-outlined">
      check
    </span>
  </button>
</template>
