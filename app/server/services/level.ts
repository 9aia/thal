import { and, eq } from "drizzle-orm"
import type { H3Event } from "h3"
import type { SectionName } from "~/constants/course"
import { levels } from "~~/db/schema"

export async function getOrCreateLevel(
  event: H3Event,
  unitSlug: string,
  levelSlug: string,
) {
  const orm = event.context.orm

  const user = event.context.user!

  const [level] = await orm
    .select()
    .from(levels)
    .where(
      and(
        eq(levels.unitSlug, unitSlug),
        eq(levels.slug, levelSlug),
        eq(levels.userId, user.id),
      ),
    )

  if (!level)
    return await saveLevel(event, unitSlug, levelSlug)

  return level
}

export async function getLevel(
  event: H3Event,
  sectionSlug: SectionName,
  unitSlug: string,
  levelSlug: string,
) {
  const orm = event.context.orm

  const user = event.context.user!

  const [level] = await orm
    .select()
    .from(levels)
    .where(
      and(
        eq(levels.unitSlug, unitSlug),
        eq(levels.slug, levelSlug),
        eq(levels.sectionSlug, sectionSlug),
        eq(levels.userId, user.id),
      ),
    )

  return level
}

export async function saveLevel(
  event: H3Event,
  unitSlug: string,
  levelSlug: string,
  lessonIndex: number = 0,
) {
  const orm = event.context.orm

  const user = event.context.user!

  const [level] = await orm
    .insert(levels)
    .values({
      slug: levelSlug,
      unitSlug,
      sectionSlug: "a1",
      lessonIndex,
      lastExercisePosition: 0,
      userId: user.id,
    })
    .returning()

  return level
}

export async function getLevelsBySection(
  event: H3Event,
  sectionSlug: SectionName,
) {
  const orm = event.context.orm

  const user = event.context.user!

  const foundLevels = orm
    .select()
    .from(levels)
    .where(
      and(
        eq(levels.sectionSlug, sectionSlug),
        eq(levels.userId, user.id),
      ),
    )

  return foundLevels
}
