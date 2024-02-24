<script
  setup
  lang="ts"
  generic="T extends Key & keyof I18n.MessageSchema, V extends InferPlaceholders<T>"
>
import { usePageContext } from '#lib/vike/composables/usePageContext'
import { computed, onMounted, useSlots } from 'vue'
import collect from '../../collect'
import formatToSegments from '../../core/format/formatToSegments'
import type { InferPlaceholders, Key } from '../../core/types.d'
import { getConfig, getFormatOptions } from '../../core/utils'
import { getMessage } from '../../utils'

const props = withDefaults(
  defineProps<{
    text: T
    values?: Partial<V>
    tag?: string
  }>(),
  { tag: 'span' },
)

defineSlots<Slots>()

type Placeholders = InferPlaceholders<typeof props.text>
type SlotProps = V & { form?: string }
type Slots = Record<keyof Placeholders, (slotProps: SlotProps) => any>

const c = usePageContext()
const slots = useSlots()

const values = props.values || {}
const options = getConfig()

const segments = computed(() => {
  const locale = c.locale
  const text = getMessage(props.text, locale, options)
  const formatOptions = getFormatOptions(locale, options)
  const segments = formatToSegments(text, values, formatOptions)

  return segments
})

onMounted(() => {
  if (import.meta.env.DEV)
    collect(props.text, props.values)
})
</script>

<template>
  <component :is="props.tag">
    <template v-for="(segment, i) in segments" :key="i">
      <template
        v-if="segment.type === 'text' || (segment.key && !slots[segment.key])"
      >
        {{ segment.part }}
      </template>
      <template v-else>
        <slot
          :name="(segment.key!)"
          v-bind="(segment.values as V)"
          :form="(segment.form)"
        />
      </template>
    </template>
  </component>
</template>
