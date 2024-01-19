import { reactive } from "vue";

export function resettable<T extends object>(initialState: T) {
  const obj = reactive<T>({ ...initialState });

  const reset = (newState = initialState) => {
    Object.assign(obj, { ...newState });
  };

  return [obj, reset] as [
    typeof obj,
    typeof reset
  ];
}
