import { z } from "zod"
import { getStt } from "~/src/base/utils/gcp"
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

  const stt = getStt(GCLOUD_ACCESS_TOKEN);

  const data = await stt.transcribe(options);
  return data
})
