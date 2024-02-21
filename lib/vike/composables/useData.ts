import { computed } from "vue";
import { usePageContext } from "./usePageContext";
import { InferData } from "../types";
import { PageContext } from "vike/types";

type DataFunction = (pageContext: PageContext) => any;

export function useData<T extends DataFunction>() {
  type DataType = InferData<T>;

  const pageContext = usePageContext();
  return computed<DataType>(
    () => (pageContext.data as DataType)
  );
}
