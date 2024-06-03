<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core"

const props = defineProps<{
  i: number
  alternative: string
  selected?: boolean
}>()
const select = defineModel<number>()

const isTouchable = useMediaQuery("(pointer: coarse) and (hover: none)")
const btnEl = ref<HTMLButtonElement>()

watch(select, () => {
  if (select.value === props.i)
    btnEl.value?.focus()
})
</script>

<template>
  <button
    ref="btnEl"
    class="relative w-full flex justify-center items-center gap-2 rounded-lg text-center p-2 transition-all duration-300 border border-slate-300"
    :class="selected ? 'bg-slate-700 text-white' : 'bg-white text-slate-800'"
    @click="select = i"
  >
    <Kbd
      v-if="!isTouchable"
      class="absolute left-4 bottom-1/2 translate-y-1/2 kbd-sm bg-transparent transition-all duration-300 text-slate-600 border-slate-300"
      :class="selected ? 'bg-slate-700 text-white' : 'bg-white text-slate-800'"
    >
      {{ i + 1 }}
    </Kbd>

    <span class="font-bold">{{ alternative }}</span>
  </button>
</template>
