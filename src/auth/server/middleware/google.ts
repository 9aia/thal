import process from "node:process"
import { initializeGoogle } from "../utils/auth"
import { getAppUrl } from "~/src/base/utils/h3"

let google: ReturnType<typeof initializeGoogle>

export default defineEventHandler(async (event) => {
  const { GOOGLE_CLIENT_SECRET } = process.env

  if (!google)
    google = initializeGoogle(GOOGLE_CLIENT_SECRET!, getAppUrl(event))

  event.context.google = google
})

declare module "h3" {
  interface H3EventContext {
    google: ReturnType<typeof initializeGoogle> | null
  }
}
