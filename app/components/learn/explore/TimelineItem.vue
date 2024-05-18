<script setup lang="ts">
import { tv } from "tailwind-variants"
import { t } from "@psitta/vue"
import { ref } from "vue"
import type { Node } from "../../../types"

defineProps<{ is: Node, i: number, items: Node[] }>()

const icons: Record<Required<Node>["type"], string> = {
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
</script>

<template>
  <hr v-if="i !== 0" :class="{ 'bg-primary': is.active }">
  <div
    class="timeline-box bg-white border-slate-300 cursor-pointer flex flex-col gap-1"
    :class="{
      'timeline-start': is.position === 'start' || !is.position,
      'timeline-end': is.position === 'end',
    }"
    @click="isModalOpen = true"
  >
    <div class="items-center flex gap-2">
      <Icon :class="iconStyle({ type: is.type || 'none' })">
        {{ icons[is.type || 'none'] }}
      </Icon>
      <div class="flex flex-col">
        <span v-if="is.optional" class="text-xs">
          {{ t("Optional") }}
        </span>
        <span>
          {{ is.name }}
        </span>
      </div>
    </div>
    <progress
      v-if="(is.maxLevel || 0) > 0"
      class="progress h-1 w-full"
      :class="{
        'progress-primary': is.level === is.maxLevel,
        'progress-success': (is.level || 0) < (is.maxLevel || 1),
      }"
      :value="100 / (is.maxLevel || 1) * (is.level || 0)"
      max="100"
    />

    <Modal v-if="is.type === 'concept'" v-model="isModalOpen" confirm-text="Continue">
      <h1 class="text-2xl mx-auto mb-2">
        {{ t(is.name) }}
      </h1>
      <p v-if="is.description">
        {{ t(is.description) }}
      </p>

      <h2 class="mt-4 mb-2 uppercase font-bold text-xs">
        Example
      </h2>

      <div class="border border-gray-500 rounded-lg p-4">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, possimus.</p>
      </div>
    </Modal>
  </div>
  <div
    class="timeline-middle flex justify-center items-center rounded-full w-5 h-5"
    :class="{
      'bg-primary': is.active,
      'bg-base-300 text-base-300': !is.active,
    }"
  >
    <Icon class="!text-base">
      check
    </Icon>
  </div>
  <hr
    v-if="i < items.length - 1"
    :class="{ 'bg-primary': items[i + 1]?.active }"
  >
</template>
