import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';

export function useMedia(query: string): Ref<boolean> {
  const mediaQuery = window.matchMedia(query);
  const matches = ref(mediaQuery.matches);
  
  const updateMatches = () => {
    matches.value = mediaQuery.matches;
  };

  onMounted(() => {
    updateMatches();
    mediaQuery.addListener(updateMatches);
  });

  onBeforeUnmount(() => {
    mediaQuery.removeListener(updateMatches);
  });

  return matches;
}
