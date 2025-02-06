import { z } from 'zod'
import { getEnv } from '~/utils/envs'
import { getTts } from '~/utils/gcp'
import { getValidated } from '~/utils/h3'
import { internal, unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const { GCP_CLOUD_TTS_API_KEY } = getEnv(event)

  if (!GCP_CLOUD_TTS_API_KEY)
    throw internal('GCP_CLOUD_TTS_API_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const data = await getValidated(event, 'body', z.object({
    text: z.string(),
    locale: z.string().default('en-US'),
  }))

  const tts = getTts(GCP_CLOUD_TTS_API_KEY)

  const ssml = `<speak>${data.text.split(' ').map((w, i) => `<mark name="${i}"/>${w}`).join(' ')}</speak>`

  const options = {
    input: {
      ssml,
    },
    voice: {
      languageCode: data.locale,
      ssmlGender: 'FEMALE',
    },
    enableTimePointing: [
      'SSML_MARK',
    ],
    audioConfig: { audioEncoding: 'MP3' },
  }

  const audio = await tts.synthesize(options)

  return audio
})
