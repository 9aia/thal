import { usePageContext } from "#framework/composables/usePageContext";

function useI18n() {
  const pageContext = usePageContext();
  return pageContext.i18n || {};
}

export default useI18n;
