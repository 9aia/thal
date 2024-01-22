import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import { env } from "hono/adapter";
import lessons from "../../lessons";
import { LessonImplementation, PromptOptions } from "../../types";
import { content } from "../../utils";

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

  const res = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      body: JSON.stringify(content(prompt)),
      method: "POST",
    }
  );

  const data = (await (await res).json()) as any;

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
