<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { useAttrs } from 'vue'
import { localizeUrl } from '@psitta/core';
import { useLocale } from '@psitta/vue';

interface Props {
  activeClass?: string
  href?: string
  localize?: boolean | undefined
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  localize: undefined,
})
const attrs = useAttrs()
const route = useRoute()

const isActive = computed(() => route.fullPath === props.href)
const locale = useLocale();

const normalHref = computed(() => {
  return props.localize ?? true
    ? localizeUrl(props.href, props.locale || locale.value)
    : props.href
})

const styles = computed(() =>
  tv({
    base: (attrs.class as string) || '',
    variants: {
      type: {
        active: props.activeClass || 'is-active',
        inactive: '',
      },
    },
  }),
)
</script>

<template>
  <NuxtLink
    :class="styles({ type: isActive ? 'active' : 'inactive' })"
    :to="normalHref"
  >
    <slot />
  </NuxtLink>
</template>
