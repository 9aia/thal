import { initializeGoogle } from '../../utils/auth'
import { getAppUrl } from '~/utils/h3'
import { internal } from '~/utils/nuxt'

let google: ReturnType<typeof initializeGoogle>

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)

  if (!runtimeConfig.GOOGLE_CLIENT_SECRET)
    throw internal('GOOGLE_CLIENT_SECRET is not set in the environment')

  if (!runtimeConfig.public.GOOGLE_CLIENT_ID)
    throw internal('GOOGLE_CLIENT_ID is not set in the environment')

  if (!google)
    google = initializeGoogle(runtimeConfig.public.GOOGLE_CLIENT_ID, runtimeConfig.GOOGLE_CLIENT_SECRET, getAppUrl(event))

  event.context.google = google
})

declare module 'h3' {
  interface H3EventContext {
    google: ReturnType<typeof initializeGoogle> | null
  }
}
