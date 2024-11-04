export function getCursorPosition(el: HTMLSpanElement) {
  const end = el.textContent?.length || 0

  if (!window.getSelection)
    return end
  const selection = window.getSelection()

  if (selection && selection.rangeCount) {
    const range = selection.getRangeAt(0)

    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(el)
    preCaretRange.setEnd(range.endContainer, range.endOffset)

    const pos = preCaretRange.toString().length

    if (pos > end)
      return end

    return pos
  }

  return end
}

export function setCursorPosition(el: HTMLSpanElement, pos: number) {
  const range = document.createRange()
  const selection = window.getSelection()
  const textNode = el.firstChild

  if (!textNode)
    return

  range.setStart(textNode, pos)
  range.collapse(true)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function setCursorEnd(el: HTMLSpanElement) {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const selection = window.getSelection()

  if (!selection)
    return

  selection.removeAllRanges()
  selection.addRange(range)
}
