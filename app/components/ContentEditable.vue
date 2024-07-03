<script lang="ts" setup>
const props = withDefaults(defineProps<{
  placeholder: string
  is: string
}>(), {
  is: "div",
})

const inputRef = ref<HTMLSpanElement>()

const modelValue = defineModel()

watch(modelValue, (value) => {
  if (!inputRef.value || inputRef.value.innerHTML === value)
    return

  inputRef.value.innerHTML = value

  return value
})

onMounted(() => {
  inputRef.value?.setAttribute("data-placeholder", props.placeholder)
})

function edit(e: Event) {
  modelValue.value = e.target.innerHTML
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
