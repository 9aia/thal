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
          "Content-Type": "application/json",
        }
      })

      if (!res.ok) {
        throw internal(`Error fetching GCP STT: ${res.status}`)
      }

      return await res.json() as TranscriptionResponse
    } catch (error) {
      throw new Error(`Error transcribing content: ${error}`)
    }
  }

  return {
    transcribe,
  }
}
