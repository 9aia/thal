import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = sqliteTable("Profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  lastName: text("lastName").notNull(),
  username: text("username").notNull().unique(),
  signupDate: text("signupDate").notNull(),
  pronouns: text("pronouns"),
  goals: text("goals"),
  worktime: text("worktime"),
  uselessSkill: text("uselessSkill"),
  bioTitle: text("bioTitle"),
  obsession: text("obsession"),
  location: text("location"),
  interests: text("interests"),
});

export const profileUpdateSchema = createInsertSchema(profiles, {
  interests: (schema) =>
    schema.interests.refine((interests) => interests.split(",").length <= 7, {
      message: "Interests must contain at most 7 items separated by commas",
    }),
}).partial();

export const profileSelectSchema = createSelectSchema(profiles);

export type Profile = z.infer<typeof profileSelectSchema>;
