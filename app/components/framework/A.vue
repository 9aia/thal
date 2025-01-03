<script setup lang="ts">
import { localizeUrl } from '@psitta/core'
import { useLocale } from '@psitta/vue'

interface Props {
  activeClass?: string
  href?: string
  localize?: boolean | undefined
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  localize: undefined,
})

const locale = useLocale()

const normalHref = computed(() => {
  return props.localize ?? true
    ? localizeUrl(props.href, props.locale || locale.value)
    : props.href
})
</script>

<template>
  <NuxtLink
    :active-class="activeClass || 'is-active'"
    :to="normalHref"
  >
    <slot />
  </NuxtLink>
</template>
