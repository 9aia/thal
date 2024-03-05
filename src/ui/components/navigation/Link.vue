<script setup lang="ts">
import { usePageContext } from '~/lib/vike/composables/usePageContext'

const c = usePageContext()
</script>

<template>
  <a :class="{ 'is-active': c.urlPathname === $attrs.href }">
    <slot />
  </a>
</template>

<style scoped>
a {
  padding: 3px 10px;
}
a.is-active {
  background-color: #eee;
}
</style>
