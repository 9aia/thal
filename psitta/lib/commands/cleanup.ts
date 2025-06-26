import { loadTranslations, saveTranslations } from '../messages'
import { extractMessagesFromFiles } from '../scan'
import { CONFIG } from '../../config'
import { normalizeString } from '../utils'

export async function cleanup() {
  console.log('🔍 Scanning codebase for used translation keys...')

  // Extract all messages used in the codebase
  const extractedMessages = await extractMessagesFromFiles(CONFIG.content as any)
  const usedKeys = new Set(extractedMessages.map(msg => normalizeString(msg.message)))

  console.log(`📝 Found ${usedKeys.size} translation keys used in codebase`)

  // Load existing translations
  await loadTranslations()

  // Import the current messages to get the existing translations
  const { messages } = await import('../messages')

  const existingKeys = Object.keys(messages)
  console.log(`📚 Found ${existingKeys.length} translation keys in locale files`)

  // Find unused keys (comparing normalized strings)
  const unusedKeys = existingKeys.filter(key => !usedKeys.has(normalizeString(key)))

  if (unusedKeys.length === 0) {
    console.log('✅ No unused translation keys found!')
    return
  }

  console.log(`🗑️  Found ${unusedKeys.length} unused translation keys:`)
  unusedKeys.forEach(key => console.log(`   - ${key}`))

  // Remove unused keys
  unusedKeys.forEach((key) => {
    delete messages[key]
  })

  // Save cleaned translations
  saveTranslations()

  console.log(`✅ Removed ${unusedKeys.length} unused translation keys`)
  console.log(`📚 ${Object.keys(messages).length} translation keys remaining`)
}
