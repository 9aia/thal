import { findExerciseImplementation } from "~/constants/exercises"
import { getLevel } from "~/server/services/level"
import type { ExerciseGetDto } from "~/types"
import type { ExerciseSelect, LevelSelect } from "~~/db/schema"

export function getLessonDto(ent: ExerciseSelect, level: LevelSelect) {
  const exercise = findExerciseImplementation(ent.type)
  const processedData = exercise.postprocess(ent.data)

  const exerciseDto: ExerciseGetDto = {
    id: ent.id,
    type: ent.type,
    data: processedData,
    currentExercise: level.currentExercise,
    lessonAmount: level.lessonAmount,
  }

  return exerciseDto
}
