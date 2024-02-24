<script setup lang="ts">
import { usePageContext } from '#lib/vike/composables/usePageContext'
import type { SafeProps } from '#lib/vue/utils/types'
import { tv } from 'tailwind-variants'
import { type AnchorHTMLAttributes, computed, useAttrs } from 'vue'
import { localizeHref } from '#lib/i18n/utils'

type Props = SafeProps<AnchorHTMLAttributes> & {
  activeClass?: string
  href?: string
  localizeHref?: boolean | undefined
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  localizeHref: undefined,
})
const attrs = useAttrs()
const c = usePageContext()

const isActive = computed(() => c.urlWithoutLocale === props.href)

const normalHref = computed(() => {
  return props.localizeHref ?? true
    ? localizeHref(props.href as string, props.locale || c.locale)
    : (props.href as string)
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
  <a
    :class="styles({ type: isActive ? 'active' : 'inactive' })"
    :href="normalHref"
  >
    <slot />
  </a>
</template>
