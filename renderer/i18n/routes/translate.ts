import { getGemini } from "#framework/utils/gemini";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { z } from "zod";

export default new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      translations: z.any(),
      defaultLocale: z.any(),
    })
  ),
  async (c) => {
    const { GEMINI_API_KEY } = env(c);
    const { defaultLocale, translations } = c.req.valid("json");

    const prompt = `
      ## MISSION
      
      You are a translator. You will be given a translation JSON and will be expected to fulfill the values for the locales with a specific format.
      
      Generate the respective translation from '${defaultLocale}' to the corresponding locales.

      ## INPUT

      The input will contain a text in the locale '${defaultLocale}' as key for a object containing keys with empty respective translations as values (that will be expected to be fulfilled). Your output must be super consistent.

      Here is the initial object:

      ${JSON.stringify(translations)}

      ## OUTPUT FORMAT

      - Valid JSON that follows exactly the pattern in the example.
      - Don't leave empty values.

      ## OUTPUT EXAMPLE

      {
        "Interests e hobbies": {
          "pt": "Interesses e hobbies"
        },
        "Edit interests": {
          "pt": "Editar interesses"
        }
      }
      `;

    const gemini = getGemini(GEMINI_API_KEY as string);

    try {
      const res = (await gemini.generateContent(prompt)) as any;

      if ("error" in res) {
        throw new Error("Gemini error");
      }

      const text = res.candidates[0].content.parts[0].text;

      const parsedText = JSON.parse(text);

      const res2 = await fetch("http://localhost:3000/__translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: parsedText }),
      });

      if(!res2.ok) {
        throw new Error(String(res2));
      }

      const translations = JSON.parse(text);

      return c.json({ translations });
    } catch (e) {
      throw new Error("Error: " + e);
    }
  }
);
