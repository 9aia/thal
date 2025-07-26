<script setup lang="ts">
interface Props {
  activeClass?: string
  href?: string
  // Localize is not used anymore, but kept for compatibility.
  localize?: boolean | undefined
  locale?: string
}

withDefaults(defineProps<Props>(), {
  localize: undefined,
})
</script>

<template>
  <NuxtLink
    :active-class="activeClass || 'is-active'"
    :to="href"
  >
    <slot />
  </NuxtLink>
</template>
