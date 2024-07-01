<script setup lang="ts">
import { tv } from "tailwind-variants"
import { t } from "@psitta/vue"
import { ref } from "vue"
import type { Level, Unit } from "../../../types"

const props = defineProps<{
  level: Level
  align: "start" | "end"
}>()

const emit = defineEmits<{
  (e: "click"): void
}>()

const icons: Record<Required<Level>["type"], string> = {
  concept: "cognition",
  exercise: "exercise",
  question: "question_mark",
  info: "info",
  vocab: "apparel",
  none: "",
}

const iconStyle = tv({
  variants: {
    type: {
      concept: "text-yellow-700",
      exercise: "text-green-700",
      question: "text-red-700",
      info: "text-blue-700",
      vocab: "text-purple-700",
      none: "",
    },
  },
})

const isModalOpen = ref(false)
const setState = (state: boolean) => isModalOpen.value = state

function onClick() {
  if (props.level.type === "concept")
    isModalOpen.value = true
  else
    emit("click")
}
</script>

<template>
  <div
    class="timeline-box bg-white border-slate-300 cursor-pointer flex flex-col gap-1"
    :class="{
      'timeline-start': align === 'start',
      'timeline-end': align === 'end',
    }"
    @click="onClick"
  >
    <div class="items-center flex gap-2">
      <Icon :class="iconStyle({ type: level.type || 'none' })">
        {{ icons[level.type || 'none'] }}
      </Icon>
      <div class="flex flex-col">
        <span v-if="level.optional" class="text-xs">
          {{ t("Optional") }}
        </span>
        <span>
          {{ level.name }}
        </span>
      </div>
    </div>
    <progress
      v-if="(level.maxLessonAmount || 0) > 0"
      class="progress h-1 w-full"
      :class="{
        'progress-primary': level.lessonAmount === level.maxLessonAmount,
        'progress-success': (level.lessonAmount || 0) < (level.maxLessonAmount || 1),
      }"
      :value="100 / (level.maxLessonAmount || 1) * (level.lessonAmount || 0)"
      max="100"
    />

    <slot :set-state="setState" :modal-state="isModalOpen" />
  </div>
  <div
    class="timeline-middle flex justify-center items-center rounded-full w-5 h-5"
    :class="level.active ? 'bg-primary' : 'bg-base-300 text-base-300'"
  >
    <Icon v-if="level.completed" class="!text-base">
      check
    </Icon>
  </div>
</template>
