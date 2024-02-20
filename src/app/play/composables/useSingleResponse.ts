import { Ref, onMounted, ref } from "vue";
import { useEventListener } from "@vueuse/core";

function useSingleResponse<T extends { alternatives: any[] }>(
  props: T,
  select: Ref<number | undefined>
) {
  onMounted(() => {
    useEventListener("keydown", (e: any) => {
      const num = e.key as number;

      if (!(num >= 1 && num <= props.alternatives.length)) {
        return;
      }

      select.value = num - 1;
    });
  });
}

export default useSingleResponse;
