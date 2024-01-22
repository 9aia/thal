import { Prompt } from "~/app/lesson/types";

export function chat(prompt: Prompt) {
  return {
    contents: [
      {
        role: "system",
        parts: [{ text: prompt.system }],
      },
      {
        role: "user",
        parts: [{ text: prompt.user }],
      },
    ],
  };
}

export function content(prompt: string) {
  return {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };
}
