<script
  setup
  lang="ts"
  generic="T extends Key & keyof I18n.MessageSchema, V extends InferValues<T | EveryTranslationOf<T>>"
>
import formatToSegments from '~/lib/i18n/core/format/formatToSegments'
import { getFormatOptions } from '~/lib/i18n/core/localization/format'
import localizeKey from '~/lib/i18n/core/localization/localizeKey'
import collect from '~/lib/i18n/core/translation/collect'
import type { FormatContext, InferValues, Key, Values } from '~/lib/i18n/core/types.d'
import { getConfig } from '~/lib/i18n/core/utils'
import { computed, onMounted, useSlots } from 'vue'
import useLocale from '../composables/useLocale'

export type ValueOf<T> = T[keyof T]

export type EveryTranslationOf<D extends string & keyof I18n.MessageSchema> = Extract<
  ValueOf<I18n.MessageSchema[D]>,
  string
>

const props = withDefaults(
  defineProps<{
    text: T
    values?: Partial<V>
    tag?: string
  }>(),
  { tag: 'span' },
)

defineSlots<Slots>()

type Placeholders = InferValues<typeof props.text>
type SlotProps = V & { decline: FormatContext<any>['decline'] }
type Slots = Record<keyof Placeholders, (slotProps: SlotProps) => any>

const slots = useSlots()

const values = props.values || {}
const options = getConfig()
const localeRef = useLocale()

const segments = computed(() => {
  const locale = localeRef.value
  const text = localizeKey(props.text, locale, options)
  const formatOptions = getFormatOptions(locale, options)
  const segments = formatToSegments(text, values, formatOptions)

  return segments
})

onMounted(() => {
  if (import.meta.env.DEV)
    collect(props.text, props.values as Values)
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
          :decline="(segment.decline)"
        />
      </template>
    </template>
  </component>
</template>
