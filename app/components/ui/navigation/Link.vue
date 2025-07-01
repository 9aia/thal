<script setup lang="ts">
import { tv } from 'tailwind-variants'

interface Props {
  class?: string
  spanClass?: string
  activeClass?: string
  href?: string
  localize?: boolean | undefined
  locale?: string
  iconClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  localize: undefined,
})

const isExternal = computed(() => {
  if (props.href === undefined)
    return false

  const regex = /^(?:http|https|mailto):\/\//i
  return regex.test(props.href)
})

const baseStyles = tv({
  slots: {
    base: 'flex items-center gap-1 group',
    span: 'group-hover:underline',
    icon: 'text-base rotate-90',
  },
})

const styles = baseStyles()
</script>

<template>
  <A
    :to="href"
    :active-class="activeClass"
    :locale="locale"
    :localize="localize"
    :class="styles.base({ class: props.class })"
    :target="isExternal ? '_blank' : undefined"
  >
    <span :class="styles.span({ class: spanClass })">
      <slot />
    </span>
    <Icon v-if="isExternal" name="material-symbols:north-west-rounded" :class="styles.icon({ class: iconClass })" />
  </A>
</template>
