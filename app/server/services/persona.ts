import { eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import { notFound } from "~/utils/nuxt"
import { personas } from "~~/db/schema"

export async function getPersonaByUsername(
  orm: H3EventContext["orm"],
  username: string,
) {
  const [persona] = await orm
    .select().from(personas)
    .where(eq(personas.username, username))

  if (!persona)
    throw notFound("Persona not found")

  return persona
}
