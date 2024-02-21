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

function useSlotContent(fallback?: () => string | undefined) {
  const slots = useSlots()

  return computed(() => {
    return getSlotContent(slots.default) || fallback?.()
  })
}

export default useSlotContent
