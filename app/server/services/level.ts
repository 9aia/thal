import { and, eq } from "drizzle-orm"
import type { H3Event } from "h3"
import { levels } from "~~/db/schema"

export async function getLevel(
  event: H3Event,
  unitSlug: string,
  levelSlug: string,
) {
  const orm = event.context.orm

  const [level] = await orm
    .select()
    .from(levels)
    .where(
      and(
        eq(levels.unitSlug, unitSlug),
        eq(levels.slug, levelSlug),
      ),
    )

  if (!level)
    return await saveLevel(event, unitSlug, levelSlug)

  return level
}

export async function saveLevel(
  event: H3Event,
  unitSlug: string,
  levelSlug: string,
  lessonIndex: number = 0,
) {
  const orm = event.context.orm

  const [level] = await orm
    .insert(levels)
    .values({
      slug: levelSlug,
      unitSlug,
      lessonIndex,
      currentExercise: 0,
    })
    .returning()

  return level
}
