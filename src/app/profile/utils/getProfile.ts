import { eq } from "drizzle-orm";
import { Context } from "hono";
import { profiles } from "../schemas/profile";
import { notFound } from "#framework/utils/httpThrowers";
import { ApiContext } from "#framework/api";

export async function getProfile(c: Context<ApiContext>, username: string) {
  const orm = c.get("orm");

  const profile = (
    await orm.select().from(profiles).where(eq(profiles.username, username))
  ).at(0);

  if (!profile) {
    throw notFound(`"Profile not found: ${username}`);
  }

  return profile;
}
