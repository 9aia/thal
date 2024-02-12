import { usePageContext } from "#framework/composables/usePageContext";
import { computed } from "vue";

function useI18n() {
  const pageContext = usePageContext();
  return computed(() => pageContext.i18n || {});
}

export default useI18n;
