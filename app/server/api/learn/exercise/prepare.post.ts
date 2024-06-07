import { z } from "zod"
import { getLessonState } from "~/server/services/lesson"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { numericString } from "~/utils/zod"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", z.object({
    unitSlug: z.string(),
    levelSlug: z.string(),
    lessonAmount: numericString(z.number()),
  }))
  const user = event.context.user

  if (!user)
    throw unauthorized()

  return getLessonState(event, data)
})
