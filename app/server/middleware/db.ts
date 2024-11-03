import { type DrizzleD1Database, drizzle as initializeDrizzle } from "drizzle-orm/d1"
import * as schema from "../../../db/schema"

let drizzle: DrizzleD1Database<typeof schema>

export default defineEventHandler(async (event) => {
  const { DB } = event.context.cloudflare.env

  if (!drizzle) {
    drizzle = initializeDrizzle(DB, {
      schema,
    })
  }

  event.context.orm = drizzle
})

declare module "h3" {
  interface H3EventContext {
    orm: DrizzleD1Database<typeof schema>
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}
