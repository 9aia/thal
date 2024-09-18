<script lang="ts" setup>
import { useMagicKeys } from "@vueuse/core"

const emit = defineEmits<{
  (e: "send"): void
}>()

const text = defineModel<string>({
  required: true,
})

const {
  shift,
} = useMagicKeys()

const isEmpty = computed(() => !text.value.trim())
const icon = computed(() => {
  return isEmpty.value ? "mic" : "send"
})

function handleEnter(e: Event) {
  if (!text.value.trim()) {
    e.preventDefault()
    return
  }

  if (!shift.value) {
    e.preventDefault()
    emit("send")
  }
}
</script>

<template>
  <footer class="px-3 py-2 bg-white flex items-end justify-center gap-2">
    <div class="flex-1 flex">
      <ContentEditable is="span" v-model="text" class="input w-full h-auto p-[10px] textarea" placeholder="Type a message" @keydown.enter="handleEnter" />
    </div>

    <div v-if="!isEmpty" role="button" class="btn btn-ghost btn-circle avatar" @click="emit('send')">
      <Icon :name="icon" />
    </div>
  </footer>
</template>
