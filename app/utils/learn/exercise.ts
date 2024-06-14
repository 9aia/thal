import { MAX_EXERCISE_AMOUNT, MAX_LESSON_AMOUNT, findExerciseImplementation } from "~/constants/exercises"
import { course } from "~/constants/course"
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

export function getMaxLessonAmount(sectionSlug: string, unitSlug: string, levelSlug: string) {
  const section = course.sections.find(s => s.slug === sectionSlug)

  if (!section)
    return null

  const unit = section.units.find(u => u.slug === unitSlug)

  if (!unit)
    return null

  const level = unit.levels.find(l => l.slug === levelSlug)

  if (!level)
    return null

  return level.maxLessonAmount || MAX_LESSON_AMOUNT
}

export function getMaxExerciseAmount(sectionSlug: string, unitSlug: string, levelSlug: string) {
  const section = course.sections.find(s => s.slug === sectionSlug)

  if (!section)
    return null

  const unit = section.units.find(u => u.slug === unitSlug)

  if (!unit)
    return null

  const level = unit.levels.find(l => l.slug === levelSlug)

  if (!level)
    return null

  return level.maxExerciseAmount || MAX_EXERCISE_AMOUNT
}
