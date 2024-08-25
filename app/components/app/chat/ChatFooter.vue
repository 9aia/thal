<script lang="ts" setup>
const emit = defineEmits<{
  (e: "send"): void
}>()

const text = defineModel<string>({
  required: true,
})

const icon = computed(() => {
  return text.value ? "send" : "mic"
})
</script>

<template>
  <footer class="px-3 py-2 bg-white flex items-end justify-center gap-2">
    <div class="flex-1 flex">
      <ContentEditable is="span" v-model="text" class="input w-full h-auto p-[10px] textarea" placeholder="Type a message" />
    </div>

    <div role="button" class="btn btn-ghost btn-circle avatar" @click="emit('send')">
      <Icon :name="icon" />
    </div>
  </footer>
</template>
