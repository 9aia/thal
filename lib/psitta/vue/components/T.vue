<script
  setup
  lang="ts"
  generic="T extends Register, K extends keyof T['messages'], V extends InferValues<K | E>, E extends T['messages'][K][keyof T['messages'][K]]"
>
import type { FormatContext, InferValues, Register, Values } from '../../core'
import { collect, formatToSegments, getConfig, getFormatOptions, localizeKey } from '../../core'
import { computed, onMounted, useSlots } from 'vue'
import useLocale from '../composables/useLocale'

const props = withDefaults(
  defineProps<{
    text: K
    values?: V
    tag?: string
  }>(),
  { tag: 'span' },
)

type SlotProps = typeof props.values & { decline: FormatContext<any>['decline'] }
type Slots = { [key in keyof V]: (slotProps: SlotProps) => any }
defineSlots<Slots>()

const slots = useSlots()

const values = props.values || {}
const options = getConfig()
const locale = useLocale()

const segments = computed(() => {
  const localeValue = locale.value
  const text = localizeKey(props.text as any, localeValue, options)
  const formatOptions = getFormatOptions(localeValue, options)
  const segments = formatToSegments(text, values, formatOptions)

  return segments
})

onMounted(() => {
  if (import.meta.env.DEV)
    collect(props.text as any, props.values as Values)
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
