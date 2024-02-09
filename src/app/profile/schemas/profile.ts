import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { MAX_GOALS_AMOUNT, MAX_HOBBIES_AMOUNT, MAX_PROFESSION_CHARS } from "../constants";

export const profiles = sqliteTable("Profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  lastName: text("lastName").notNull(),
  username: text("username").notNull().unique(),
  signupDate: text("signupDate").notNull(),
  pronouns: text("pronouns"),
  location: text("location"),
  goals: text("goals"),
  profession: text("profession"),
  hobbies: text("hobbies"),
});

export const profileUpdateSchema = createInsertSchema(profiles, {
  hobbies: (schema) =>
    schema.hobbies.refine(
      (hobbies) => hobbies.split(",").length <= MAX_HOBBIES_AMOUNT,
      {
        message: `Hobbies must contain at most ${MAX_HOBBIES_AMOUNT} items separated by commas`,
      }
    ),
  profession: (schema) =>
    schema.profession.refine(
      (profession) => profession.length <= MAX_PROFESSION_CHARS,
      {
        message: `Profession must contain at most ${MAX_PROFESSION_CHARS} characters`,
      }
    ),
  goals: (schema) =>
    schema.goals.refine(
      (goals) => goals.split(",").length <= MAX_GOALS_AMOUNT,
      {
        message: `Goals must contain at most ${MAX_GOALS_AMOUNT} items separated by commas`,
      }
    ),
}).partial();

export const profileSelectSchema = createSelectSchema(profiles);

export type Profile = z.infer<typeof profileSelectSchema>;
