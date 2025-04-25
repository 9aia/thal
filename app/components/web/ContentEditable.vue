<script lang="ts" setup>
const props = withDefaults(defineProps<{
  placeholder: string
  is?: string
  disabled?: boolean
}>(), {
  is: 'div',
  disabled: false,
})

const inputRef = ref<HTMLSpanElement>()

const modelValue = defineModel<string>({
  default: '',
})

watch(modelValue, (value) => {
  if (!inputRef.value || inputRef.value.innerHTML === value)
    return

  inputRef.value.innerHTML = value
})

onMounted(() => {
  inputRef.value?.setAttribute('data-placeholder', props.placeholder)
})

function edit(e: InputEvent) {
  if (props.disabled)
    return

  const target = e.target as HTMLElement
  modelValue.value = target.innerHTML
}

const cursorLastPosition = ref({
  container: null as Node | null,
  offset: 0,
})

function saveCursorPosition() {
  if (props.disabled)
    return

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
  if (!cursorLastPosition.value.container || props.disabled)
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
  focus: (startFromEnd?: boolean) => {
    if (!inputRef.value || props.disabled)
      return

    setCursorEnd(inputRef.value)

    if (!startFromEnd) {
      restoreCursorPosition()
    }

    inputRef.value.focus()
  },
})

function handlePaste(event: ClipboardEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  event.preventDefault()
  const plainText = event.clipboardData?.getData('text/plain')

  if (inputRef.value) {
    document.execCommand('insertText', false, plainText)
  }
}
</script>

<template>
  <component
    :is="props.is"
    ref="inputRef"
    role="textbox"
    :contenteditable="!props.disabled"
    @input="edit"
    @blur="saveCursorPosition"
    @paste="handlePaste"
  />
</template>

<style scoped>
[contenteditable]:empty::before {
  content: attr(data-placeholder);
  color: gray;
}
</style>
