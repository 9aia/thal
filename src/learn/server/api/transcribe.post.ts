import { z } from "zod"
import { getValidated } from "~/src/base/utils/h3"
import { unauthorized } from "~/src/base/utils/nuxt"

export default eventHandler(async (event) => {
  const user = event.context.user

  if(!user) {
    throw unauthorized()
  }

  const { GCLOUD_ACCESS_TOKEN } = process.env

  if(!GCLOUD_ACCESS_TOKEN) {
    throw new Error("GCLOUD_ACCESS_TOKEN is not set")
  }

  const formDataUser = await getValidated(event, 'body', z.object({
    audio: z.string()
  }))

  const options = {
    config: {
      encoding:"WEBM_OPUS",
      sampleRateHertz: 48000,
      languageCode: "en-US"
    },
    audio: {
      content: formDataUser.audio.replace('data:audio/webm;base64,', '')
    }
  }

  const t = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
    method: 'POST',
    body: JSON.stringify(options),
    headers: {
      "Content-Type": "application/json",
      "x-goog-user-project": "maratongue",
      "Authorization": `Bearer ${GCLOUD_ACCESS_TOKEN}`
    }
  })

  interface Result {
    alternatives: {
      transcript: string
      confidence: number
    }[]
    resultEndTime: string
    languageCode: string
  }

  interface TranscriptionResponse {
    results: Result[]
    totalBilledTime: string
    requestId: string
    usingLegacyModels: boolean
  }

  const data = await t.json<TranscriptionResponse>()

  return data.results[0]
})
