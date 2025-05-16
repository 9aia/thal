import { block } from '@9aia/castor'
import { sql } from 'drizzle-orm'

block('Drop all database', {
  danger: true,
  run: async (db) => {
    // Drop tables
    const result = await db.run(
      sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE '_cf_METADATA' AND name NOT LIKE 'd1_migrations' AND name NOT LIKE 'sqlite_%'`,
    )
    const tableNames = result.results.map((t: any) => t.name)
    for (const tableName of tableNames) {
      await db.run(sql`DROP TABLE IF EXISTS ${sql.identifier(tableName)}`)
    }

    await db.run(sql`DELETE FROM d1_migrations`)

    // Drop indexes
    const indexResult = await db.run(
      sql`SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_%'`,
    )
    const indexNames = indexResult.results.map((t: any) => t.name)
    for (const indexName of indexNames) {
      await db.run(sql`DROP INDEX IF EXISTS ${sql.identifier(indexName)}`)
    }

    // Drop triggers
    const triggerResult = await db.run(
      sql`SELECT name FROM sqlite_master WHERE type = 'trigger' AND name NOT LIKE 'sqlite_%'`,
    )
    const triggerNames = triggerResult.results.map((t: any) => t.name)
    for (const triggerName of triggerNames) {
      await db.run(sql`DROP TRIGGER IF EXISTS ${sql.identifier(triggerName)}`)
    }
  },
})
