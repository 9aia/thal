import { internal } from '~~/server/utils/nuxt'

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
