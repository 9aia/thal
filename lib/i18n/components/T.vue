<script
  setup
  lang="ts"
  generic="T extends string & keyof I18n.MessageSchema, V extends ExtractVariables<T>"
>
import { usePageContext } from '#lib/vike/composables/usePageContext'
import { computed, onMounted, useSlots } from 'vue'
import collect from '../collect'
import { format } from '../format'
import type { ExtractVariables, Segment } from '../types'
import { getConfig, getFormatOptions, getMessage } from '../utils'

const props = withDefaults(
  defineProps<{
    text: T
    values?: Partial<V>
    tag?: string
  }>(),
  { tag: 'span' },
)

defineSlots<Slots>()

type Vars = ExtractVariables<typeof props.text>
type SlotProps = V & { form?: string }
type Slots = Record<keyof Vars, (slotProps: SlotProps) => any>

const slots = useSlots()
const c = usePageContext()

onMounted(() => {
  if (import.meta.env.DEV)
    collect(props.text, props.values)
})

const values = props.values || {}

const segments = computed(() => {
  const options = getConfig()

  const locale = c.i18n.locale
  const text = getMessage(props.text, locale, options)
  const formatOptions = getFormatOptions(locale, options)

  const segments = format<Segment<Vars, V>[]>(
    text,
    values,
    ({ prev, part, key, form, dynamic }) => {
      const slot = key && slots[key]
      const segment: Segment<Vars, V> = {
        type: !dynamic || !slot ? 'text' : 'placeholder',
        part,
        key: key as keyof Vars,
        form,
        values,
      }

      return [...prev, segment]
    },
    [],
    formatOptions,
  )

  return segments
})
</script>

<template>
  <component :is="props.tag">
    <template v-for="(segment, i) in segments" :key="i">
      <template v-if="segment.type === 'text'">
        {{ segment.part }}
      </template>
      <template v-else>
        <slot
          :name="(segment.key as keyof Vars)"
          v-bind="(segment.values as V)"
          :form="(segment.form)"
        />
      </template>
    </template>
  </component>
</template>
