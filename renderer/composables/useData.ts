import { computed } from "vue";
import { usePageContext } from "./usePageContext";
import { InferData } from "../types";

type AnyFunction = (...args: any) => any;

export function useData<T extends AnyFunction>() {
  type DataType = InferData<T>;

  const pageContext = usePageContext();
  return computed<DataType>(
    () => (pageContext.data as DataType)
  );
}
