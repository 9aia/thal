import type { PageContext } from 'vike/types'
import { getDefaultLocale } from '../core/utils'

function getLang(c: PageContext) {
  return c.locale || getDefaultLocale()
}

export default getLang
