<script setup lang="ts">
import { VariantProps, tv } from "tailwind-variants";
import { computed, useAttrs, type ButtonHTMLAttributes } from "vue";
import { useRipple } from "#design/composables/useRipple";
import { SafeProps, SafeVariantProps } from "#framework/utils/types";

const styles = tv({
  base: "btn btn-sm",
});

type Props = SafeProps<ButtonHTMLAttributes> &
  SafeVariantProps<VariantProps<typeof styles>> & {
    loading?: boolean;
  };

defineProps<Props>();

const rippleElRef = useRipple();
const attrs = useAttrs();
</script>

<template>
  <button
    :class="styles({ class: attrs.class as string })"
    ref="rippleElRef"
  >
    <slot />
    <span v-if="loading" class="loading loading-spinner"></span>
  </button>
</template>
