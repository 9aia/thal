import { ApiContext } from "#framework/api";
import { getGemini } from "#framework/utils/gemini";
import { Hono } from "hono";
import { env } from "hono/adapter";
import lessons from "../lessons";
import { LessonImplementation, PromptOptions } from "../types";

const lessonRouter = new Hono<ApiContext>();

export default lessonRouter.get("/", async (c) => {
  const { GEMINI_API_KEY } = env(c);

  const options: PromptOptions = {
    interests: ["travel"].join(", "),
    level: "a1",
    languageFrom: "Português",
    languageTo: "English",
  };

  const index = Math.floor(Math.random() * Object.keys(lessons).length);
  
  const lesson = lessons[index] as LessonImplementation;
  const promptData = lesson?.prompt(options);

  let prompt = `
    You are a exercise generator for an English learning app, where students can learn with lessons individually personalized.

    ${promptData.instructions}

    ## Criteria

    - Your output should be a complete valid JSON.
    - The output should follow exactly the format in the example below;
    ${promptData.criteria || ""}

    ## Example

    Here is a JSON for the output example, follow this style!

    ${JSON.stringify(promptData.example)}
  `;

  const gemini = getGemini(GEMINI_API_KEY);

  const data = await gemini.generateContent(prompt) as any;

  if ("error" in data) {
    throw new Error("Gemini 500");
  }

  const text = data.candidates[0].content.parts[0].text;

  try {
    const obj = JSON.parse(text);

    return c.json({
      type: lesson.name,
      obj: obj,
    });
  } catch (e) {
    throw new Error("Invalid JSON");
  }
});
