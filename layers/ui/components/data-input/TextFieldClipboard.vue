<script setup lang="ts">
import { ref } from "vue"
import Icon from "../display/Icon.vue"

const props = defineProps<{
  text: string
  label?: string
  tip?: string
  copyMessage?: string
}>()

const copyMessage = ref("")

function copy() {
  navigator.clipboard.writeText(props.text)

  copyMessage.value = props.copyMessage || ""

  setTimeout(() => (copyMessage.value = ""), 2000)
}
</script>

<template>
  <label class="form-control w-full max-w-xs cursor-pointer" @click="copy">
    <div v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <div class="flex gap-2 items-center justify-center">
      <input
        type="text"
        readonly
        :value="text"
        class="input input-bordered input-ghost w-full max-w-xs"
      >
      <div class="input flex items-center justify-center">
        <Icon class="" @click="copy"> content_copy </Icon>
      </div>
    </div>
    <div class="label">
      <span v-if="tip" class="label-text-alt">{{ tip }}</span>
      <span class="label-text-alt text-success">{{ copyMessage }}</span>
    </div>
  </label>
</template>
