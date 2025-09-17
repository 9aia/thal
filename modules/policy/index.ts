import fs from 'node:fs'
import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'policy-date',
    configKey: 'policyDate',
    compatibility: {
      nuxt: '^4.0.0',
    },
  },
  defaults: {
    rootDir: '/content',
    pattern: /^\/legal\/([a-z]{2})\/([\w-]+)\.md$/i,
    timestampFile: 'modules/policy/.timestamp.json',
    verbose: true,
  },
  setup(options, nuxt) {
    if (!fs.existsSync(options.timestampFile)) {
      fs.writeFileSync(options.timestampFile, '{}', 'utf8')
    }

    nuxt.hook('vite:extendConfig', (config) => {
      config.plugins = config.plugins || []

      config.plugins.push({
        name: 'vite-policy-date-plugin',
        handleHotUpdate({ file, modules }) {
          let relativeFile = file.replace(nuxt.options.srcDir, '')

          if (!relativeFile.startsWith(options.rootDir)) {
            return modules
          }

          relativeFile = relativeFile.replace(options.rootDir, '')

          const match = relativeFile.match(options.pattern)

          if (!match) {
            return modules
          }

          try {
            const timestamp = new Date().getTime()
            const json = JSON.parse(fs.readFileSync(options.timestampFile, 'utf-8'))
            const file = relativeFile.slice(1)
            json[file] = timestamp

            fs.writeFileSync(options.timestampFile, JSON.stringify(json), 'utf8')
            console.log(`[vite-policy-date-plugin] Updated policy effective date for ${relativeFile}`)
          }
          catch (err) {
            console.error(`[vite-policy-date-plugin] Error processing file ${file}:`, err)
          }

          return modules
        },
      })
    })
  },
})
