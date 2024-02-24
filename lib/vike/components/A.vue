<script setup lang="ts">
import localizeUrl from '#lib/i18n/core/localization/localizeUrl'
import { usePageContext } from '#lib/vike/composables/usePageContext'
import type { SafeProps } from '#lib/vue/utils/types'
import { tv } from 'tailwind-variants'
import { type AnchorHTMLAttributes, computed, useAttrs } from 'vue'

type Props = SafeProps<AnchorHTMLAttributes> & {
  activeClass?: string
  href?: string
  localize?: boolean | undefined
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  localize: undefined,
})
const attrs = useAttrs()
const c = usePageContext()

const isActive = computed(() => c.urlWithoutLocale === props.href)

const normalHref = computed(() => {
  return props.localize ?? true
    ? localizeUrl(props.href, props.locale || c.locale)
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
  <a
    :class="styles({ type: isActive ? 'active' : 'inactive' })"
    :href="normalHref"
  >
    <slot />
  </a>
</template>
