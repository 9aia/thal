import {
  Slot,
  computed,
  useSlots
} from "vue";

const getSlotContent = (slot?: Slot) => {
  if (!slot) {
    return null;
  }

  const node = slot()[0];

  if (!node) {
    return null;
  }

  return node.children;
};

export function useSlotContent(fallback?: () => string | undefined) {
  const slots = useSlots();

  return computed(() => {
    return getSlotContent(slots.default) || fallback?.();
  });
}
