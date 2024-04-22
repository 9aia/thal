<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';
import type { SafeVariantProps } from '~/src/base/utils/types';

const styles = tv({
  base: 'loading loading-spinner',
  variants: {
    size: {
      xs: 'loading-xs',
      sm: 'loading-sm',
      md: 'loading-md',
      lg: 'loading-lg'
    }
  }
})

defineProps<SafeVariantProps<VariantProps<typeof styles>>>()
</script>

<template>
  <span :class="styles({ size })"></span>
</template>