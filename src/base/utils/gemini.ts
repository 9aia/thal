import type { GenerationConfig } from '@google/generative-ai'
import * as _ from 'lodash-es'

export function getGemini (apiKey: string) {
  const generateContent = async (
    prompt: string,
    generationConfig?: GenerationConfig,
  ) => {
    const input = _.trimStart(prompt)

    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) { throw new Error(`Error: ${response.status}`) }

      return await response.json() as any
    } catch (error) {
      throw new Error(`Error generating content:: ${error}`)
    }
  }

  return {
    generateContent,
  }
}
