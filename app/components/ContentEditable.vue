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

const cursorLastPosition = ref({
  container: null as Node | null,
  offset: 0,
})

function saveCursorPosition() {
  const sel = window.getSelection()

  if (!sel || sel.rangeCount <= 0)
    return

  const range = sel.getRangeAt(0)
  cursorLastPosition.value = {
    container: range.startContainer,
    offset: range.startOffset,
  }
}

function restoreCursorPosition() {
  if (!cursorLastPosition.value.container)
    return

  const range = document.createRange()
  range.setStart(cursorLastPosition.value.container, cursorLastPosition.value.offset)
  range.collapse(true)

  const sel = window.getSelection()

  if (!sel)
    return

  sel.removeAllRanges()
  sel.addRange(range)
}

defineExpose({
  focus: () => {
    if (!inputRef.value)
      return

    setCursorEnd(inputRef.value)
    restoreCursorPosition()
    inputRef.value.focus()
  },
})
</script>

<template>
  <component
    :is="props.is"
    ref="inputRef"
    role="textbox"
    contenteditable
    @input="edit"
    @blur="saveCursorPosition"
  />
</template>

<style scoped>
[contenteditable]:empty::before {
  content: attr(data-placeholder);
  color: gray;
}
</style>
