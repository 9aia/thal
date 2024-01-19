import { ComponentInternalInstance, computed, getCurrentInstance } from "vue";

const getSlotContent = (
  vm: ComponentInternalInstance | null = getCurrentInstance()
) => {
  const slots = vm?.slots.default?.();

  if (slots && slots.length > 0) {
    const f = slots[0];
    return f.children;
  }

  return null;
};

export function useSlotContent(fallback?: () => string | undefined) {
  return computed(() => {
    return getSlotContent() || fallback?.();
  });
}
