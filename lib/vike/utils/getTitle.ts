import * as _ from 'lodash-es'
import type { PageContext } from 'vike/types'

/**
 * Get the page's title if defined, either from the additional data fetched by
 * the page's onBeforeRender() hook or from the config.
 */
export function getTitle(c: PageContext): null | string {
  if (c.title !== undefined)
    return c.title

  const titleConfig = c.configEntries.title?.[0]
  if (!titleConfig)
    return null

  const title = titleConfig.configValue
  if (typeof title === 'string')
    return title

  if (!title)
    return null

  const { configDefinedAt } = titleConfig
  if (_.isFunction(title)) {
    const val = title(c)
    if (typeof val !== 'string')
      throw new Error(`${configDefinedAt} should return a string`)

    return val
  }
  throw new Error(
    `${configDefinedAt} should be a string or a function returning a string`,
  )
}
