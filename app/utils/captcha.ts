import process from 'node:process'

interface TurnstileResponse {
  'success': boolean
  'error-codes': string[]
  'challenge_ts': string
  'hostname': string
  'action': string
  'cdata': string
  'metadata': Record<string, unknown>
}

export async function validateTurnstileToken(token: string) {
  const { TURNSTILE_SECRET_KEY } = process.env

  if (!TURNSTILE_SECRET_KEY)
    throw internal('TURNSTILE_SECRET_KEY is not set in the environment')

  const formData = new FormData()

  formData.append('secret', TURNSTILE_SECRET_KEY)
  formData.append('response', token)

  const turnstileVerifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

  const firstResult = await fetch(turnstileVerifyUrl, {
    body: formData,
    method: 'POST',
  })

  const firstOutcome = await firstResult.json() as TurnstileResponse

  return firstOutcome.success
}
