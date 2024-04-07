import { z } from "zod"
import { getTts } from "~/src/base/utils/gcp"
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

  const data = await getValidated(event, 'body', z.object({
    text: z.string(),
    locale: z.string().default("en-US"),
  }))

  const tts = getTts(GCLOUD_ACCESS_TOKEN);

  const ssml = '<speak>' + data.text.split(" ").map((w, i) => `<mark name="${i}"/>${w}`).join(" ") + '</speak>'

  const options = {
    input: {
      ssml: ssml
    },
    voice: {
      languageCode: data.locale,
      ssmlGender: 'FEMALE',
    },
    enableTimePointing: [
      'SSML_MARK'
    ],
    audioConfig: { audioEncoding: 'MP3' },
  }

  const audio = await tts.synthesize(options)

  return audio
})
