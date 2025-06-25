import process from 'node:process'
import { CONFIG } from '../config'

export const cache = new Set<string>()

export async function loadCache() {
  const messages = await import(`${process.cwd()}/${CONFIG.localesFolder}/index.js`)

  Object.values(messages).forEach((translations) => {
    Object.keys(translations as any).forEach((message) => {
      cache.add(message)
    })
  })
}
