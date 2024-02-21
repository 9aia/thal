import { HonoContext } from "#lib/hono/types";
import { notFound } from "#lib/hono/utils/httpStatus";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
  profileUpdateSchema,
  profiles,
  usernameSchema,
} from "../schemas/profile";

export default new Hono<HonoContext>()
  .get(
    "/:username",
    zValidator("param", z.object({ username: z.string() })),
    async (c) => {
      const { username } = c.req.valid("param");

      const orm = c.get("orm");
      const profile = (
        await orm.select().from(profiles).where(eq(profiles.username, username))
      ).at(0);

      if (!profile) {
        throw notFound("Profile not found");
      }

      return c.json(profile);
    }
  )
  .patch(
    "/:username",
    zValidator("param", z.object({ username: z.string() })),
    zValidator("json", profileUpdateSchema),
    async (c) => {
      const { username } = c.req.valid("param");
      const data = c.req.valid("json");

      const orm = c.get("orm");

      const profile = await orm
        .update(profiles)
        .set(data)
        .where(eq(profiles.username, username))
        .returning();

      return c.json(profile);
    }
  )
  .get(
    "/validateUsername/:username",
    zValidator("param", z.object({ username: z.string() })),
    async (c) => {
      const orm = c.get("orm");
      const { username } = c.req.valid("param");

      if (!usernameSchema.safeParse(username).success) {
        return c.json({ valid: false });
      }

      const usernameTaken =
        (
          await orm
            .select()
            .from(profiles)
            .where(eq(profiles.username, username))
        ).at(0) !== undefined;

      return c.json({
        valid: !usernameTaken,
      });
    }
  );
