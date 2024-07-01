import { z } from "zod"
import { SECTION_SLUGS, course } from "~/constants/course"
import { MAX_EXERCISE_AMOUNT, MAX_LESSON_AMOUNT } from "~/constants/exercises"
import { getLevelsBySection } from "~/server/services/level"
import type { Level } from "~/types"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const {
    slug,
  } = await getValidated(event, "params", z.object({
    slug: z.enum(SECTION_SLUGS),
  }))

  const section = course.sections.find(s => s.slug === slug)!

  const sectionLevels = await getLevelsBySection(event, slug)

  const units = section.units.map((unit) => {
    const levels: Level[] = unit.levels.map((level) => {
      const levelOnDb = sectionLevels.find(l => l.unitSlug === unit.slug && l.slug === level.slug)

      const maxLessonAmount = level.maxLessonAmount || MAX_LESSON_AMOUNT
      const maxExerciseAmount = level.maxExerciseAmount || MAX_EXERCISE_AMOUNT

      const lessonIndex = levelOnDb?.lessonIndex || 0

      const active = lessonIndex > 0
      const completed = lessonIndex === maxLessonAmount

      return {
        ...level,
        maxExerciseAmount,
        maxLessonAmount,
        active,
        completed,
        lessonAmount: lessonIndex,
      }
    })

    return {
      ...unit,
      levels,
    }
  })

  return {
    ...section,
    units,
  }
})
