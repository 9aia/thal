import process from 'node:process'
import { scanAndTranslate } from './lib/commands/scan-and-translate'
import { cleanup } from './lib/commands/cleanup'

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command) {
    console.log('🦜 Psitta')
    console.log('')
    console.log('Usage: psitta <command>')
    console.log('')
    console.log('Commands:')
    console.log('  translate    🔄 Scan and translate missing keys')
    console.log('  cleanup      🧹 Remove unused translation keys')
    console.log('')
    process.exit(1)
  }

  switch (command) {
    case 'translate':
      await scanAndTranslate()
      break
    case 'cleanup':
      await cleanup()
      break
    default:
      console.error(`❌ Unknown command: ${command}`)
      console.log('')
      console.log('Available commands:')
      console.log('  translate    🔄 Scan and translate missing keys')
      console.log('  cleanup      🧹 Remove unused translation keys')
      console.log('')
      process.exit(1)
  }
}

main().catch(console.error)
