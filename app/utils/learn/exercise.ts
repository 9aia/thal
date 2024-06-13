import { findExerciseImplementation } from "~/constants/exercises"
import type { LessonGetDto } from "~/types"
import type { ExerciseSelect, LevelSelect } from "~~/db/schema"

export function getLessonDto(entity: ExerciseSelect | null, level: LevelSelect) {
  let exercise = null

  if (entity) {
    const impl = findExerciseImplementation(entity.type)
    const processedData = impl.postprocess(entity.data)

    exercise = {
      id: entity.id,
      type: entity.type,
      data: processedData,
    }
  }

  const exerciseDto: LessonGetDto = {
    currentExercise: level.currentExercise,
    lessonIndex: level.lessonIndex,
    exercise,
  }

  return exerciseDto
}
