import { loadTranslations, messages, saveTranslations } from '../messages'
import { adjust as adjustMessages } from '../translate'
import type { Chunk } from '../types'
import { CONFIG } from '../../config'

export async function adjust(prompt: string) {
  console.log('🔧 Starting translation adjustment process...')
  console.log(`📝 Prompt: ${prompt}`)

  // Load existing translations
  await loadTranslations()

  const existingMessages = Object.entries(messages)

  if (existingMessages.length === 0) {
    console.log('❌ No translations found to adjust!')
    return
  }

  console.log(`📚 Found ${existingMessages.length} translation keys to adjust`)

  // Create chunks from existing messages
  const chunks = Array.from(existingMessages).reduce((acc, [message, translations], index) => {
    const chunkIndex = Math.floor(index / CONFIG.messagePerChunk)
    const chunk = acc[chunkIndex] || {}
    chunk[message] = translations as any
    acc[chunkIndex] = chunk

    return acc
  }, [] as Chunk[])

  console.log(`📦 Split messages into ${chunks.length} chunks for adjustment`)

  for (const [index, chunk] of chunks.entries()) {
    if (Object.keys(chunk).length === 0) {
      continue
    }

    console.log(`🔧 Adjusting chunk ${index + 1}/${chunks.length} (${Object.keys(chunk).length} messages)...`)

    await adjustMessages(chunk, prompt)
    saveTranslations()
  }

  console.log(`✅ Successfully adjusted ${existingMessages.length} translation keys`)
  console.log('💾 Changes saved to locale files')
}
