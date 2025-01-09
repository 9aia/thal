<script setup lang="ts">
interface Props {
  activeClass?: string
  href?: string
  localize?: boolean | undefined
  locale?: string
  disableColor?: boolean
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
</script>

<template>
  <A
    :to="href"
    :active-class="activeClass"
    :locale="locale"
    :localize="localize"
    class="flex items-center gap-1  group"
    :target="isExternal ? '_blank' : undefined"
    :class="{ 'text-cyan-500': !disableColor }"
  >
    <span class="group-hover:underline">
      <slot />
    </span>
    <Icon v-if="isExternal">
      north_east
    </Icon>
  </A>
</template>
