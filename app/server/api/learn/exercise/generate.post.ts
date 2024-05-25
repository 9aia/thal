import { z } from "zod"
import { exercises } from "~~/db/schema"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", z.object({
    lessonId: z.string(),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const [exercise] = await orm
    .insert(exercises)
    .values({
      data: {
        alternatives: ["Paris", "London", "Berlin", "Madrid"],
        correct: 0,
        question: "What is the capital of France?",
        text: "",
      },
      lessonId: data.lessonId,
      type: "ReadAndAnswer",
    })
    .returning()

  return exercise
})
