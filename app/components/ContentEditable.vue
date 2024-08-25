<script lang="ts" setup>
const props = withDefaults(defineProps<{
  placeholder: string
  is: string
}>(), {
  is: "div",
})

const inputRef = ref<HTMLSpanElement>()

const modelValue = defineModel<string>({
  default: "",
})

watch(modelValue, (value) => {
  if (!inputRef.value || inputRef.value.innerHTML === value)
    return

  inputRef.value.innerHTML = value
})

onMounted(() => {
  inputRef.value?.setAttribute("data-placeholder", props.placeholder)
})

function edit(e: InputEvent) {
  const target = e.target as HTMLElement
  modelValue.value = target.innerHTML
}
</script>

<template>
  <component :is="props.is" ref="inputRef" class="input w-full h-auto p-[10px] textarea" role="textbox" contenteditable @input="edit" />
</template>

<style scoped>
[contenteditable]:empty::before {
  content: attr(data-placeholder);
  color: gray;
}
</style>
