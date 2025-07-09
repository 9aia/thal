import { z } from 'zod'

import { getTts } from '~/utils/gcp'
import { getValidated } from '~/utils/h3'
import { internal, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { SubscriptionStatus } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GCP_CLOUD_TTS_API_KEY } = useRuntimeConfig(event)

  if (!GCP_CLOUD_TTS_API_KEY)
    throw internal('GCP_CLOUD_TTS_API_KEY is not set in the environment')

  const data = await getValidated(event, 'body', z.object({
    text: z.string(),
    locale: z.string().default('en-US'),
  }))

  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (user.subscriptionStatus === SubscriptionStatus.past_due)
    throw paymentRequired()

  const listenRateLimit = await event.context.cloudflare.env.LISTEN_RATE_LIMIT.limit({ key: `listen-${user.id}` })

  if (!listenRateLimit.success)
    throw rateLimit()

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
