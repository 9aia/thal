<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  placeholder?: string
  name?: string
  url?: string
  alt?: string
  type?: 'button' | 'summary' | 'div'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  class?: string
  wrapperClass?: string
  imgClass?: string
  placeholderClass?: string
}>(), {
  type: 'div',
  size: 'md',
})

const placeholder = computed(() => {
  return props.placeholder || props.name?.[0].toUpperCase() || 'U'
})

const avatar = tv({
  slots: {
    base: 'avatar group focus:outline-hidden',
    wrapper: 'rounded-full group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-neutral',
    image: '',
    placeholder: '',
  },
  variants: {
    size: {
      xs: {
        wrapper: 'w-8 h-8',
        placeholder: 'text-xs',
      },
      sm: {
        wrapper: 'w-10 h-10',
        placeholder: 'text-sm',
      },
      md: {
        wrapper: 'w-12 h-12',
        placeholder: 'text-base',
      },
      lg: {
        wrapper: 'w-16 h-16',
        placeholder: 'text-lg',
      },
      xl: {
        wrapper: 'w-24 h-24',
        placeholder: 'text-xl',
      },
    },
    role: {
      static: {},
      interactive: {
        wrapper: 'btn btn-ghost btn-circle',
      },
    },
    mode: {
      image: {},
      placeholder: {
        base: 'avatar-placeholder',
      },
    },
  },
})

const role = computed(() => props.type === 'button' || props.type === 'summary' ? 'interactive' : 'static')
const mode = computed(() => props.url ? 'image' : 'placeholder')
const styles = computed(() => avatar({
  role: role.value,
  mode: mode.value,
  size: props.size,
}))
</script>

<template>
  <div
    :tabindex="role === 'interactive' ? 0 : undefined"
    :role="role === 'interactive' ? 'button' : undefined"
    :class="styles.base({ class: props.class })"
  >
    <div :class="styles.wrapper({ class: props.wrapperClass })">
      <template v-if="url">
        <img :class="styles.image({ class: props.imgClass })" :src="url" :alt="props.alt">
      </template>
      <template v-else>
        <span :class="styles.placeholder({ class: props.placeholderClass })">
          {{ placeholder }}
        </span>
      </template>
    </div>
  </div>
</template>
