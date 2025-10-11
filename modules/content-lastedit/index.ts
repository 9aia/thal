import fs from 'node:fs'
import { defineNuxtModule, useLogger } from 'nuxt/kit'
import chokidar from 'chokidar'
import * as pathe from 'pathe'

export type TimestampFileContent = Record<string, number>
export interface TimestampFileResult { data: TimestampFileContent | null, error: Error | null }

const TIMESTAMP_FILEPATH = './content/.timestamp.json'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-content-lastedit',
    configKey: 'contentLastedit',
    compatibility: {
      nuxt: '^4.0.0',
    },
  },
  defaults: {
    contentDir: './content',
    pattern: /\.md$/i,
    timestampFile: TIMESTAMP_FILEPATH,
    verbose: true,
  },
  setup(options, nuxt) {
    if (!nuxt.options.dev)
      return

    const logger = useLogger('nuxt-content-lastedit')

    logger.info('Module initialized with options:', options)

    const readTimestampFile = (): TimestampFileResult => {
      try {
        const json = JSON.parse(fs.readFileSync(options.timestampFile, 'utf8'))
        return { data: json, error: null }
      }
      catch (err) {
        logger.error(`Error reading JSON file ${options.timestampFile}:`, err)
        return { data: null, error: err as Error }
      }
    }

    const updateTimestampFile = (json: TimestampFileContent): TimestampFileResult => {
      try {
        fs.writeFileSync(options.timestampFile, JSON.stringify(json, null, 2), 'utf8')
        return { data: json, error: null }
      }
      catch (err) {
        logger.error(`Error writing JSON file ${options.timestampFile}:`, err)
        return { data: null, error: err as Error }
      }
    }

    function addTimestampsForNewFiles() {
      const timestampFileResult = readTimestampFile()
      if (timestampFileResult.error || !timestampFileResult.data)
        return

      const json = timestampFileResult.data
      const contentDir = pathe.join(nuxt.options.workspaceDir, options.contentDir)

      function walk(dir: string, relPrefix = '/') {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          const entryPath = pathe.join(dir, entry.name)
          const relativePath = pathe.join(relPrefix, entry.name)
          if (entryPath === pathe.join(nuxt.options.workspaceDir, TIMESTAMP_FILEPATH))
            continue
          if (entry.isDirectory()) {
            // Recurse into directories, but do not add them to the timestamp JSON
            walk(entryPath, relativePath)
          }
          else if (entry.isFile()) {
            // Only add files
            if (!(relativePath in json)) {
              json[relativePath] = Date.now()
            }
          }
        }
      }

      walk(contentDir)

      updateTimestampFile(json)
    }

    /**
     * Synchronize the timestamp file by removing entries for files that no longer exist
     * in the content directory. This ensures the .timestamp.json doesn't contain stale records.
     */
    const removeStaleTimestamps = () => {
      const timestampFileResult = readTimestampFile()
      if (timestampFileResult.error || !timestampFileResult.data)
        return

      const json = timestampFileResult.data

      // Build a set of current files in the content directory (recursively)
      const contentDir = pathe.join(nuxt.options.workspaceDir, options.contentDir)
      const existingFiles = new Set<string>()

      function collectFiles(dir: string, relPrefix = '/') {
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true })
          for (const entry of entries) {
            const entryPath = pathe.join(dir, entry.name)
            const relativePath = pathe.join(relPrefix, entry.name)

            if (entryPath === pathe.join(nuxt.options.workspaceDir, TIMESTAMP_FILEPATH))
              continue

            if (entry.isDirectory()) {
              collectFiles(entryPath, relativePath)
            }
            else if (entry.isFile()) {
              existingFiles.add(relativePath)
            }
          }
        }
        catch {
          // Directory might not exist, skip it
        }
      }

      collectFiles(contentDir)

      // Delete any timestamp entries for files that are no longer present
      let removedCount = 0
      for (const file in json) {
        if (!existingFiles.has(file)) {
          delete json[file]
          removedCount++
        }
      }

      if (removedCount > 0) {
        updateTimestampFile(json)
        logger.info(`Removed ${removedCount} stale timestamp entries`)
      }
    }

    /**
     * Watch the content directory for changes and update the timestamp file accordingly
     */
    function watchFiles() {
      const contentDir = pathe.join(nuxt.options.workspaceDir, options.contentDir)
      const watcher = chokidar.watch(contentDir, {
        ignoreInitial: true, // don't fire events for files already there on startup
      })

      watcher.on('all', (eventName, path) => {
        if (eventName === 'addDir')
          return // Ignore directory creation

        const relativePath = path.replace(pathe.join(nuxt.options.workspaceDir, options.contentDir), '')
        const match = relativePath.match(options.pattern)
        if (!match)
          return

        const timestampFileResult = readTimestampFile()
        if (timestampFileResult.error || !timestampFileResult.data)
          return

        const json = timestampFileResult.data

        if (eventName === 'unlink') { // File deleted
          delete json[relativePath]
          updateTimestampFile(json)
          logger.info(`Removed last edit timestamp for deleted file: ${relativePath}`)
          return
        }

        if (eventName === 'unlinkDir') { // Directory deleted
          // Remove timestamps for all files that were inside this directory
          const dirPath = relativePath.endsWith('/') ? relativePath : `${relativePath}/`
          const filesToRemove: string[] = []

          for (const filePath in json) {
            if (filePath.startsWith(dirPath)) {
              filesToRemove.push(filePath)
            }
          }

          filesToRemove.forEach((filePath) => {
            delete json[filePath]
          })

          updateTimestampFile(json)
          logger.info(`Removed last edit timestamps for the files inside deleted directory: ${relativePath}`)
          return
        }

        // Save the last edit date
        const timestamp = new Date().getTime()
        json[relativePath] = timestamp
        updateTimestampFile(json)
        logger.info(`Updated last edit date for ${relativePath}`)
      })

      // Stop watcher when closing dev server
      nuxt.hook('close', () => watcher.close())
    }

    addTimestampsForNewFiles()
    removeStaleTimestamps()
    watchFiles()
  },
})
