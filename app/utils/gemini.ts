import type { Content, GenerationConfig } from '@google/generative-ai'
import * as _ from 'lodash-es'
import { internal } from './nuxt'
import type { Message } from '~/types'
import { getFullMessage } from '~/utils/chat'

export function chatHistoryToGemini(history: Message[]): Content[] {
  return history.map((msg) => {
    const fullMessage = getFullMessage(msg.message, msg.replyMessage)

    return {
      role: msg.from === 'user' ? 'user' : 'model',
      parts: [
        { text: fullMessage },
      ],
    }
  },
  )
}

export function getGemini(apiKey: string) {
  const generateContent = async (
    prompt: string,
    model: string,
    systemInstruction?: string,
    generationConfig?: GenerationConfig,
  ) => {
    const input = _.trimStart(prompt)

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    const body: any = {
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
      system_instruction: {
        parts: { text: systemInstruction },
      },
    }

    if (!systemInstruction)
      delete body.system_instruction

    try {
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data: any = await response.json()

      if ('error' in data)
        throw new Error(`Gemini internal error: ${data.error}`)

      return data
    }
    catch (_e) {
      const e = _e as Error
      throw internal(`Error while fetching Gemini API: ${e.message}`)
    }
  }

  const respondChat = async (
    history: Content[],
    model: string,
    systemInstruction?: string,
    generationConfig?: GenerationConfig,
  ) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    const body: any = {
      contents: history,
      generationConfig,
      system_instruction: {
        parts: { text: systemInstruction },
      },
    }

    if (!systemInstruction)
      delete body.system_instruction

    try {
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw internal(`Error fetching Gemini: ${response.status}`)
      }

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
