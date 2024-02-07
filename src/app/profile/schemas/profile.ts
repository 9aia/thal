import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const profiles = sqliteTable("Profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  lastName: text("lastName").notNull(),
  username: text("username").notNull().unique(),
  signupDate: text("signupDate").notNull(),
  worktime: text("worktime"),
  uselessSkill: text("uselessSkill"),
  bioTitle: text("bioTitle"),
  obsession: text("obsession"),
  location: text("location"),
  interests: text("interests"),
});

export const profileUpdateSchema = createSelectSchema(profiles, {
  interests: (schema) =>
    schema.interests.refine((interests) => interests.split(",").length <= 7, {
      message: "Interests must contain at most 7 items separated by commas",
    }),
}).partial();
