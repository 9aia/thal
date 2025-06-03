<script setup lang="ts">
import { tv } from 'tailwind-variants'

const props = defineProps<{
  class?: string
  headerClass?: string
  titleClass?: string
  title?: string
  bodyClass?: string
}>()

const section = tv({
  slots: {
    base: '',
    header: 'text-brown-500',
    headerTitle: 'text-sm',
    body: 'pt-4',
  },
})
const { base, header, headerTitle, body } = section()
</script>

<template>
  <section :class="base({ class: props.class })">
    <slot name="header">
      <div v-if="title" :class="header({ class: headerClass })">
        <h2 :class="headerTitle({ class: titleClass })">
          {{ title }}
        </h2>
      </div>
    </slot>

    <div :class="body({ class: bodyClass })">
      <slot />
    </div>
  </section>
</template>
