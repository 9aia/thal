import process from 'node:process'
import fs from 'node:fs/promises'
import { CONFIG } from '../config'

export const cache = new Set<string>()

export async function loadCache() {
  const exists = await fs.stat(`${process.cwd()}/${CONFIG.localesFolder}/index.js`).catch(() => null)
  if (!exists) {
    await fs.writeFile(`${process.cwd()}/${CONFIG.localesFolder}/index.js`, '/* eslint-disable */ export default {}')
  }

  const messages = await import(`${process.cwd()}/${CONFIG.localesFolder}/index.js`)

  if (!messages.default) {
    return
  }

  Object.values(messages).forEach((translations) => {
    Object.keys(translations as any).forEach((message) => {
      cache.add(message)
    })
  })
}
