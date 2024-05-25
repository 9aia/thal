import { computed, reactive, ref } from "vue"
import EXERCISES from "~/constants/exercises"

export const MAX_LESSON = 1

export const exercise = ref()

export const currentClass = reactive({
  currentLesson: 0,
})

export const NON_SELECTED = null
export const select = ref(NON_SELECTED)

export const implementation = computed(() => {
  if (!exercise.value)
    return undefined
  const impl = EXERCISES.find(lesson => lesson.name === exercise.value?.type)
  if (!impl)
    return undefined

  return {
    name: impl.name,
  }
})
