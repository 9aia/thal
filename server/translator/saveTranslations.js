import fs, { existsSync } from 'node:fs'
import path from 'node:path'
import { mergeTranslations } from './mergeTranslations.js'

export async function saveTranslationsFile(requestTranslations) {
  const FILE_NAME = './locales/index.js'

  const currentTranslations = existsSync(FILE_NAME)
    ? (await import('../../locales/index.js')).default
    : {}

  const mergedTranslations = mergeTranslations(
    requestTranslations,
    currentTranslations,
  )

  const mergedContent = `export default ${JSON.stringify(
    mergedTranslations,
    null,
    2,
  )};`

  const folderPath = path.dirname(FILE_NAME)

  if (!fs.existsSync(folderPath))
    fs.mkdirSync(folderPath, { recursive: true })

  fs.writeFileSync(FILE_NAME, mergedContent)

  console.log(`File ${FILE_NAME} saved successfully.`)
}
