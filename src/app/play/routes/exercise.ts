import { ApiContext } from "#framework/api";
import { getGemini } from "#framework/utils/gemini";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { z } from "zod";
import { getProfile } from "~/app/profile/utils/getProfile";
import EXERCISES, { findExerciseImplementation } from "../exercises";
import { exercises } from "../schemas/exercises";
import { getExercise, saveExercise } from "../services/exercise";
import { ExerciseImplementation, ExercisePromptOptions } from "../types";

const exerciseRouter = new Hono<ApiContext>();

export default exerciseRouter
  .get("/", async (c) => {
    const orm = c.get("orm");
    const res = await orm.select().from(exercises);

    return c.json(res);
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const exercise = await getExercise(c, Number(id));

      return c.json(exercise);
    }
  )
  .post(
    "/verify/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        answer: z.any(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { answer } = c.req.valid("json");

      const exercise = await getExercise(c, Number(id));
      const parsedExerciseData = JSON.parse(exercise.data as any) as any;
      const implementation = findExerciseImplementation(exercise.type);
      const correct = implementation.verify(parsedExerciseData, answer);

      return c.json({
        correct,
      });
    }
  )
  .post(
    "/generate",
    zValidator(
      "json",
      z.object({
        username: z.string(),
        lessonId: z.number(),
      })
    ),
    async (c) => {
      const { username } = c.req.valid("json");

      const profile = await getProfile(c, username);

      const { GEMINI_API_KEY } = env(c);
      const options: ExercisePromptOptions = {
        goals: profile.goals || "",
        hobbies: profile.hobbies || "",
        profession: profile.profession || "",
        observation: profile.observation || "",
        level: "a1",
        languageFrom: "Português",
        languageTo: "English",
      };

      const index = Math.floor(Math.random() * Object.keys(EXERCISES).length);
      const exercise = EXERCISES[index] as ExerciseImplementation;
      const promptData = exercise?.prompt(options);

      const prompt = `
        You are an exercise generator for an English learning app, where students can learn with lessons individually personalized.

        ${promptData.instructions}

        ## Output Criteria

        - Your output should be a complete valid JSON.
        - The output should follow exactly the format in the example below;
        ${promptData.criteria || ""}

        ## Output Example

        ${JSON.stringify(promptData.example)}
      `;

      const gemini = getGemini(GEMINI_API_KEY);

      const data = (await gemini.generateContent(prompt)) as any;

      if ("error" in data) {
        throw new Error("Gemini 500");
      }

      const text = data.candidates[0].content.parts[0].text;

      let parsedExercise;

      try {
        parsedExercise = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON");
      }

      const savedExercise = await saveExercise(c, {
        type: exercise.name,
        lessonId: 0,
        data: text,
      });

      delete parsedExercise['correct'];

      return c.json({
        id: savedExercise.id,
        lessonId: savedExercise.lessonId,
        type: savedExercise.type,
        data: parsedExercise,
      });
    }
  );
