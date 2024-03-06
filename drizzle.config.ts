import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/base/server/db/schema.ts',
  out: './src/base/server/db/migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: 'maratongue',
  },
})
