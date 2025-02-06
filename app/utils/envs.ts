import process from 'node:process'
import type { H3Event } from 'h3'

export function getEnv(event: H3Event): NodeJS.ProcessEnv | Env {
  const hasProcessEnv = !!Object.keys(process?.env).length

  if (hasProcessEnv) {
    console.log(process.env)
    return process.env
  }

  console.log(event.context?.cloudflare?.env)
  return event.context?.cloudflare?.env
}
