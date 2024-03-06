import { initializeGoogle } from '../utils/auth'

let google: ReturnType<typeof initializeGoogle>

export default defineEventHandler(async (event) => {
  const { GOOGLE_CLIENT_SECRET } = process.env
  
  if(!google) {
    google = initializeGoogle(GOOGLE_CLIENT_SECRET!)
  }

  event.context.google = google
})

declare module 'h3' {
  interface H3EventContext {
    google: ReturnType<typeof initializeGoogle> | null
  }
}
