import type { GenerationConfig, InputContent } from "@google/generative-ai"
import * as _ from "lodash-es"
import { internal } from "./nuxt"
import type { Message } from "~/types"

export function chatHistoryToGemini(history: Message[]): InputContent[] {
  return history.map(msg => ({
    role: msg.from === "user" ? "user" : "model",
    parts: [
      { text: msg.message },
    ],
  }))
}

export function getGemini(apiKey: string) {
  const generateContent = async (
    prompt: string,
    generationConfig?: GenerationConfig,
  ) => {
    const input = _.trimStart(prompt)

    const url
      = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    const body = {
      contents: [
        {
          parts: [
            {
              text: input,
            },
          ],
        },
      ],
      generationConfig,
    }

    try {
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok)
        throw internal(`Error fetching Gemini: ${response.status}`)

      return await response.json() as any
    }
    catch (error) {
      throw new Error(`Error generating content:: ${error}`)
    }
  }

  const respondChat = async (history: InputContent[], generationConfig?: GenerationConfig) => {
    const url
      = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    const body = {
      contents: history,
      generationConfig,
    }

    try {
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok)
        throw internal(`Error fetching Gemini: ${response.status}`)

      return await response.json() as any
    }
    catch (error) {
      throw new Error(`Error responding content:: ${error}`)
    }
  }

  return {
    generateContent,
    respondChat,
  }
}
