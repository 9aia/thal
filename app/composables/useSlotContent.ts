import type {
  Slot,
} from 'vue'
import {
  computed,
  useSlots,
} from 'vue'

function getSlotContent(slot?: Slot) {
  if (!slot)
    return null

  const node = slot()[0]

  if (!node)
    return null

  return node.children
}

function useSlotContent<T extends string>(fallback?: () => T | undefined) {
  const slots = useSlots()

  return computed<T>(() => {
    return (getSlotContent(slots.default) || fallback?.()) as T
  })
}

export default useSlotContent
