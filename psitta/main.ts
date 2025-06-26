import process from 'node:process'
import { translate } from './lib/commands/translate'
import { cleanup } from './lib/commands/cleanup'
import { adjust } from './lib/commands/adjust'

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
    console.log('  adjust       🔧 Edit existing translations with AI')
    console.log('')
    process.exit(1)
  }

  switch (command) {
    case 'translate':
      await translate()
      break
    case 'cleanup':
      await cleanup()
      break
    case 'adjust': {
      const prompt = args.slice(1).join(' ')
      if (!prompt) {
        console.log('❌ Please provide a prompt for adjusting translations')
        console.log('')
        console.log('Usage: psitta adjust "<prompt>"')
        console.log('')
        console.log('Examples:')
        console.log('  psitta adjust "Convert all translations from Portuguese (Portugal) to Portuguese (Brazil)"')
        console.log('  psitta adjust "Make all translations more formal"')
        console.log('  psitta adjust "Change all translations to use more casual language"')
        console.log('')
        process.exit(1)
      }
      await adjust(prompt)
      break
    }
    default:
      console.error(`❌ Unknown command: ${command}`)
      console.log('')
      console.log('Available commands:')
      console.log('  translate    🔄 Scan and translate missing keys')
      console.log('  cleanup      🧹 Remove unused translation keys')
      console.log('  adjust       🔧 Edit existing translations with AI')
      console.log('')
      process.exit(1)
  }
}

main().catch(console.error)
