import { cache, loadCache } from '../cache'
import { loadTranslations, saveTranslations } from '../messages'
import { extractMessagesFromFiles } from '../scan'
import type { Chunk } from '../types'
import { translate } from '../translate'
import { normalizeString } from '../utils'
import { CONFIG } from '~~/psitta/config'

export async function scanAndTranslate() {
  console.log('🔄 Starting scan and translate process...')

  await loadCache()
  await loadTranslations()

  console.log('🔍 Scanning codebase for messages...')
  const extractedMessages = (await extractMessagesFromFiles(CONFIG.content as any)).filter(msg => !cache.has(normalizeString(msg.message)))

  console.log(`📝 Found ${extractedMessages.length} messages`)

  if (extractedMessages.length === 0) {
    console.log('❌ No messages found!')
    return
  }

  const chunks = Array.from(extractedMessages).reduce((acc, msg, index) => {
    const chunkIndex = Math.floor(index / CONFIG.messagePerChunk)
    const chunk = acc[chunkIndex] || {}
    chunk[msg.message] = {}
    acc[chunkIndex] = chunk

    console.log(msg.message)

    return acc
  }, [] as Chunk[])

  console.log(`📦 Split messages into ${chunks.length} chunks for translation`)

  for (const [index, chunk] of chunks.entries()) {
    if (Object.keys(chunk).length === 0) {
      continue
    }

    console.log(`🌐 Translating chunk ${index + 1}/${chunks.length} (${Object.keys(chunk).length} messages)...`)
    await translate(chunk)
  }

  saveTranslations()
  console.log('✅ Translation process completed!')
}
