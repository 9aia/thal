import { computed, reactive, ref } from "vue";
import lessons from "./lessons";
import { generateLesson } from "./utils";

export const MAX_LESSON = 10;

export const data = ref<Awaited<ReturnType<typeof generateLesson>>>();

export const currentClass = reactive({
  currentLesson: 0,
});

export const NON_SELECTED = null;
export const select = ref(NON_SELECTED);

export const implementation = computed(() => {
  if (!data.value) return undefined;
  const impl = lessons.find((lesson) => lesson.name === data.value?.type);
  if (!impl) return undefined;

  return {
    name: impl.name,
    verify: impl?.verify,
  };
});
