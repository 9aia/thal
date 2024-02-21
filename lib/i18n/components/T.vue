<script
  setup
  lang="ts"
  generic="T extends string & keyof I18n.MessageSchema, V extends ExtractVariables<T>"
>
import type { VNode } from 'vue'
import { createTextVNode, h, useSlots } from 'vue'
import collect from '../collect'
import useI18n from '../composables/useI18n'
import { format } from '../format'
import type { ExtractVariables } from '../types'
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
type Context = V & { form?: string }
type Slots = Record<keyof Vars, (c: Context) => string>

const slots = useSlots()
const i18n = useI18n()

function TextLocalized() {
  if (import.meta.env.DEV)
    collect(props.text, props.values)

  const options = getConfig()

  const locale = i18n.value.locale
  const values = props.values || {}
  const text = getMessage(props.text, locale, options)
  const formatOptions = getFormatOptions(locale, options)

  const children = format<VNode[]>(
    text,
    values,
    ({ prev, part, key, form, dynamic }) => {
      let nodes: VNode[]
      const slot = key && slots[key]

      if (!dynamic || !slot) {
        nodes = [createTextVNode(part)]
      }
      else {
        const c = { ...values, form }
        nodes = slot(c)
      }

      return [...prev, ...nodes]
    },
    [],
    formatOptions,
  )

  const root = h(props.tag, children)
  return root
}
</script>

<template>
  <TextLocalized />
</template>
