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
    header: '',
    body: 'pt-4',
  },
})
const { base, header, body } = section()
</script>

<template>
  <section :class="base({ class: props.class })">
    <slot name="header">
      <div v-if="title" :class="header({ class: headerClass })">
        <SettingSectionTitle :class="titleClass">
          {{ title }}
        </SettingSectionTitle>
      </div>
    </slot>

    <div :class="body({ class: bodyClass })">
      <slot />
    </div>
  </section>
</template>
