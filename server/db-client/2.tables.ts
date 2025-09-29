import { block } from '@9aia/castor'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

function truncate(value: string | number | null | undefined | Date | boolean, len: number = 20) {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === 'boolean') {
    return value
  }

  const str = String(value)
  const truncatedStr = str.length > len ? `${str.slice(0, len - 1)}…` : str

  if (typeof value === 'number') {
    return String(value).length > len ? truncatedStr : value
  }

  return truncatedStr
}

block('Head tables', {
  schema: z.object({
    limit: z.number(),
  }),
  description: `
    This block will show the first rows of each table in the database.
    It will also truncate the column names to 5 characters.
    It will also truncate the table names to 5 characters.
  `,
  run: async (db, { limit }) => {
    const result = await db.run(
      sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE '_cf_METADATA' AND name NOT LIKE 'd1_migrations' AND name NOT LIKE 'sqlite_%'`,
    )
    const tableNames = result.results.map((t: any) => t.name as string)

    const data = await Promise.all(tableNames.map(async (tableName: string) => ({
      name: tableName,
      columns: await db.run(sql`SELECT * FROM ${sql.identifier(tableName)} LIMIT ${limit}`),
    })))

    data.forEach((table: { name: string, columns: D1Result<unknown> }) => {
      console.log('TABLE', table.name)

      const truncatedResults = table.columns.results.map((row: any) => {
        const truncatedRow: Record<string, unknown> = {}

        Object.keys(row ?? {}).forEach((key) => {
          const truncatedKey = truncate(key, 5)
          const truncatedValue = truncate((row as any)[key], 5)
          truncatedRow[truncatedKey as any] = truncatedValue
        })

        return truncatedRow
      })

      console.table(truncatedResults)
    })

    return data
  },
})
