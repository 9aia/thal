<script setup lang="ts">
import { tv } from 'tailwind-variants'

const props = defineProps<{
  class?: string
}>()

const styles = tv({
  base: 'text-brown-500 text-sm',
})
</script>

<template>
  <h2 :class="styles({ class: props.class })">
    <slot />
  </h2>
</template>
