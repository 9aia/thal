import { initializeGoogle } from '../../utils/auth'
import { getAppUrl } from '~/utils/h3'
import { internal } from '~/utils/nuxt'

let google: ReturnType<typeof initializeGoogle>

export default defineEventHandler(async (event) => {
  const { GOOGLE_CLIENT_SECRET } = useRuntimeConfig(event)

  if (!GOOGLE_CLIENT_SECRET)
    throw internal('GOOGLE_CLIENT_SECRET is not set in the environment')

  if (!google)
    google = initializeGoogle(GOOGLE_CLIENT_SECRET!, getAppUrl(event))

  event.context.google = google
})

declare module 'h3' {
  interface H3EventContext {
    google: ReturnType<typeof initializeGoogle> | null
  }
}
