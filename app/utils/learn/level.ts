import { type SectionName, course } from "~/constants/course"
import EXERCISES, { type ExerciseImplementation } from "~/constants/exercises"
import type { Level } from "~/types"

export function getLevelConfig(sectionSlug: SectionName, unitSlug: string, levelSlug: string) {
  const section = course.sections.find(s => s.slug === sectionSlug)

  if (!section)
    return null

  const unit = section.units.find(u => u.slug === unitSlug)

  if (!unit)
    return null

  const level = unit.levels.find(l => l.slug === levelSlug)

  if (!level)
    return null

  return level
}

export function getLevelImplementation(level: Level) {
  const implementation = EXERCISES.find(e => e.name === level.type)

  if (!implementation)
    return null

  return {
    selectable: true,
    ...implementation,
  } as ExerciseImplementation
}
