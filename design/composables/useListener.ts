import { onMounted, onUnmounted, Ref, ref } from 'vue';

type EventCallback = (event: Event) => void;

export function useListener(
  eventType: keyof WindowEventMap, 
  callback: EventCallback,
): Ref<boolean> {
  const isActive = ref(false);

  const handler = (event: Event) => {
    if (isActive.value) {
      callback(event);
    }
  };

  onMounted(() => {
    window.addEventListener(eventType, handler);
    isActive.value = true;
  });

  onUnmounted(() => {
    window.removeEventListener(eventType, handler);
    isActive.value = false;
  });

  return isActive;
}
