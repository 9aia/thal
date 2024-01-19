import { computed } from "vue";
import { usePageContext } from "./usePageContext";

export function useParams() {
  const pageContext = usePageContext();
  return computed(() => pageContext.routeParams);
}
