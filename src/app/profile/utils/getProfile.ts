import { eq } from "drizzle-orm";
import { Context } from "hono";
import { ProfileInsert, profiles } from "../schemas/profile";
import { notFound } from "#framework/utils/httpThrowers";
import { ApiContext } from "#framework/api";
import { now } from "#framework/utils/date";

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

export async function createProfile(c: Context<ApiContext>, insert: ProfileInsert) {
  const orm = c.get("orm");

  const profile = await orm.insert(profiles).values({
    ...insert,
    signupDate: now().toString(),
  }).returning();

  return profile;
}
