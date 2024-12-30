import process from "node:process"
import { z } from "zod"
import { getStt } from "~/utils/gcp"
import { getValidated } from "~/utils/h3"
import { internal, unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const { GCLOUD_ACCESS_TOKEN } = process.env

  if (!GCLOUD_ACCESS_TOKEN)
    throw internal("GCLOUD_ACCESS_TOKEN is not set in the environment")

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const data = await getValidated(event, "body", z.object({
    audio: z.string(),
  }))

  const stt = getStt(GCLOUD_ACCESS_TOKEN)

  const options = {
    config: {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000,
      languageCode: "en-US",
    },
    audio: {
      content: data.audio.replace("data:audio/webm;base64,", ""),
    },
  }
  const text = await stt.transcribe(options)

  return text
})
