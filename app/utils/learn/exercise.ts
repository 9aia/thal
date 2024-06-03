import { findExerciseImplementation } from "~/constants/exercises"
import type { ExerciseGetDto } from "~/types"
import type { ExerciseSelect } from "~~/db/schema"

export function convertExerciseEntityToGenerateDto(ent: ExerciseSelect) {
  const exercise = findExerciseImplementation(ent.type)
  const processedData = exercise.postprocess(ent.data)

  const exerciseDto: ExerciseGetDto = {
    id: ent.id,
    type: ent.type,
    data: processedData,
  }

  return exerciseDto
}
