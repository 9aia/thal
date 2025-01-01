import { internal } from './nuxt'

interface Alternative {
  transcript: string
  confidence: number
}

interface Result {
  alternatives: Alternative[]
  resultEndTime: string
  languageCode: string
}

interface TranscriptionResponse {
  results?: Result[]
  totalBilledTime: string
  requestId: string
  usingLegacyModels: boolean
}

export function getStt(apiKey: string) {
  const transcribe = async (
    options: any,
  ) => {
    try {
      const res = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok)
        throw internal(`Error ${res.status} fetching GCP STT: ${JSON.stringify(await res.json())}`)

      return await res.json() as TranscriptionResponse
    }
    catch (error) {
      throw new Error(`Error transcribing content: ${error}`)
    }
  }

  return {
    transcribe,
  }
}

interface SpeechSynthesisResponse {
  audioContent: string
  timepoints: any[]
  audioConfig: any
}

export function getTts(apiKey: string) {
  const synthesize = async (
    options: any,
  ) => {
    try {
      const res = await fetch(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok)
        throw internal(`Error ${res.status} fetching GCP TTS: ${JSON.stringify(await res.json())}`)

      return await res.json() as SpeechSynthesisResponse
    }
    catch (error) {
      throw new Error(`Error synthesizing speech: ${error}`)
    }
  }

  return {
    synthesize,
  }
}
