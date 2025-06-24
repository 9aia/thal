import type { Content, GenerationConfig, ResponseSchema } from '@google/generative-ai'
import { internal } from './nuxt'
import type { Message } from '~/types'
import { getFullMessage } from '~/utils/chat'

export function chatHistoryToGemini(history: Message[]): Content[] {
  return history.map((msg) => {
    const fullMessage = getFullMessage(msg.content, msg.inReplyTo?.content)

    return {
      role: msg.from === 'user' ? 'user' : 'model',
      parts: [
        { text: fullMessage },
      ],
    }
  },
  )
}

export async function getPrompt(options: {
  model: string
  prompt?: string
  history?: Content[]
  systemInstruction?: string
  responseSchema?: ResponseSchema
  generationConfig?: Omit<GenerationConfig, 'responseSchema'>
}) {
  const { model, prompt, systemInstruction, generationConfig, responseSchema } = options

  const _generationConfig = { ...generationConfig } as GenerationConfig

  if (responseSchema) {
    _generationConfig.responseSchema = responseSchema
    _generationConfig.responseMimeType = 'application/json'
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const contents = options.history ? options.history : [{ parts: [{ text: prompt }] }]

  const body: any = {
    contents,
    generationConfig: _generationConfig,
    system_instruction: { parts: { text: systemInstruction } },
  }

  if (!systemInstruction)
    delete body.system_instruction

  return {
    body: JSON.stringify(body),
    url,
  }
}

export async function getGeminiText(url: string, body: string, apiKey: string) {
  const response = await fetch(`${url}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!response.ok) {
    throw internal(`HTTP Error on fetch to Gemini: ${response.status}`)
  }

  const data: any = await response.json()

  if ('error' in data) {
    throw internal(`Gemini Error fetching to Gemini: ${data.error.message}`)
  }

  const bestCandidate = data.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text: string = bestPart?.text

  return text
}

export async function promptGeminiText(options: {
  model: string
  apiKey: string
  prompt: string
  systemInstruction?: string
  generationConfig?: GenerationConfig
}) {
  const { model, apiKey, prompt, systemInstruction, generationConfig } = options
  const { body, url } = await getPrompt({ model, prompt, systemInstruction, generationConfig })
  const text = await getGeminiText(url, body, apiKey)

  return text
}

export async function promptGeminiJson<T>(options: {
  model: string
  apiKey: string
  prompt: string
  systemInstruction?: string
  responseSchema?: ResponseSchema
  generationConfig?: GenerationConfig
}) {
  const { model, apiKey, prompt, systemInstruction, generationConfig, responseSchema } = options
  const { body, url } = await getPrompt({ model, prompt, systemInstruction, generationConfig, responseSchema })
  const text = await getGeminiText(url, body, apiKey)

  try {
    return JSON.parse(text) as T
  }
  catch (_e) {
    const e = _e as Error
    throw internal(`Error parsing JSON: ${e.message}`)
  }
}

export async function sendGeminiTextInTextOut(options: {
  model: string
  apiKey: string
  history: Content[]
  systemInstruction?: string
  responseSchema?: ResponseSchema
  generationConfig?: GenerationConfig
}) {
  const { model, apiKey, systemInstruction, generationConfig, history } = options
  const { body, url } = await getPrompt({ model, history, systemInstruction, generationConfig })
  const text = await getGeminiText(url, body, apiKey)

  if (!text)
    throw internal('Gemini did not return a valid response')

  return text
}
